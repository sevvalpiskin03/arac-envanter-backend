import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import type { MaintenanceAlert } from './maintenance-alert.types';

@Injectable()
export class EmailService {
  constructor(private readonly config: ConfigService) {}

  async sendMaintenanceAlert(recipient: string, alerts: MaintenanceAlert[]): Promise<void> {
    const host = this.config.get<string>('SMTP_HOST');
    const user = this.config.get<string>('SMTP_USER');
    const pass = this.config.get<string>('SMTP_PASSWORD');
    if (!host || !user || !pass) {
      throw new BadRequestException('E-posta gönderimi için SMTP ayarları henüz yapılmamış.');
    }
    const transporter = nodemailer.createTransport({
      host, port: Number(this.config.get('SMTP_PORT') ?? 587),
      secure: String(this.config.get('SMTP_SECURE') ?? 'false') === 'true',
      auth: { user, pass },
    });
    const rows = alerts.map((alert) => `<tr><td style="padding:8px">${alert.plate}</td><td style="padding:8px">${alert.brand} ${alert.model}</td><td style="padding:8px">${alert.remainingMileage < 0 ? `${Math.abs(alert.remainingMileage)} km gecikti` : `${alert.remainingMileage} km kaldı`}</td></tr>`).join('');
    await transporter.sendMail({
      from: this.config.get<string>('MAIL_FROM') ?? user,
      to: recipient,
      subject: `Filo Yönetimi: ${alerts.length} bakım uyarısı`,
      html: `<h2>Bakım uyarıları</h2><p>Aşağıdaki araçların bakımı yaklaşmış veya gecikmiştir.</p><table><thead><tr><th>Plaka</th><th>Araç</th><th>Durum</th></tr></thead><tbody>${rows}</tbody></table>`,
    });
  }
}
