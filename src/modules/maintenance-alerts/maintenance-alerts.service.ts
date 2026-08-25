import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import type { NotificationType } from '../../generated/prisma/enums';
import type { UpdateNotificationSettingsDto } from './dto/update-notification-settings.dto';
import { EmailService } from './email.service';
import { MAINTENANCE_ALERT_REPOSITORY, type MaintenanceAlertRepository } from './maintenance-alert.repository';

@Injectable()
export class MaintenanceAlertsService {
  constructor(
    @Inject(MAINTENANCE_ALERT_REPOSITORY) private readonly repository: MaintenanceAlertRepository,
    private readonly email: EmailService,
  ) {}

  getSettings() { return this.repository.getSettings(); }
  updateSettings(input: UpdateNotificationSettingsDto) {
    return this.repository.updateSettings({ ...input, recipientEmails: [...new Set(input.recipientEmails.map((email) => email.toLowerCase()))] });
  }
  async list() {
    const settings = await this.repository.getSettings();
    const [data, allMaintenance] = await Promise.all([this.repository.findAlerts(settings.warningMileageThreshold), this.repository.findAllScheduled()]);
    return { data, allMaintenance, summary: { total: data.length, approaching: data.filter((a) => a.status === 'APPROACHING').length, overdue: data.filter((a) => a.status === 'OVERDUE').length } };
  }
  @Cron('0 8 * * *', { timeZone: 'Europe/Istanbul' })
  async sendAutomaticEmails() { try { await this.sendEmails(); } catch { /* SMTP henüz ayarlı değilse uygulama çalışmaya devam eder. */ } }
  async sendEmails() {
    const settings = await this.repository.getSettings();
    if (!settings.emailEnabled) throw new BadRequestException('E-posta bildirimleri kapalı.');
    const recipientEmails = await this.repository.getRecipientEmails();
    if (!recipientEmails.length) throw new BadRequestException('Aktif yönetici e-posta adresi bulunamadı.');
    const alerts = await this.repository.findAlerts(settings.warningMileageThreshold);
    if (!alerts.length) return { sentRecipients: 0, alertCount: 0, skipped: 0 };
    let sentRecipients = 0; let skipped = 0;
    for (const recipient of recipientEmails) {
      const unsent = [];
      for (const alert of alerts) {
        const type: NotificationType = alert.status === 'OVERDUE' ? 'MAINTENANCE_OVERDUE' : 'MAINTENANCE_APPROACHING';
        if (await this.repository.wasSent(alert.vehicleId, type, recipient, alert.currentMileage)) skipped += 1;
        else unsent.push(alert);
      }
      if (!unsent.length) continue;
      await this.email.sendMaintenanceAlert(recipient, unsent);
      for (const alert of unsent) {
        const type: NotificationType = alert.status === 'OVERDUE' ? 'MAINTENANCE_OVERDUE' : 'MAINTENANCE_APPROACHING';
        await this.repository.logSent(alert.vehicleId, type, recipient, alert.currentMileage);
      }
      sentRecipients += 1;
    }
    return { sentRecipients, alertCount: alerts.length, skipped };
  }
}
