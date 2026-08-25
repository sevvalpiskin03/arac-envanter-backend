import { Injectable } from '@nestjs/common';
import type { NotificationType } from '../../generated/prisma/enums';
import { PrismaService } from '../../database/prisma.service';
import type { MaintenanceAlertRepository } from './maintenance-alert.repository';
import type { MaintenanceAlert, NotificationSettingsView } from './maintenance-alert.types';

@Injectable()
export class PrismaMaintenanceAlertRepository implements MaintenanceAlertRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings(): Promise<NotificationSettingsView> {
    const existing = await this.prisma.notificationSetting.findFirst();
    return existing ?? this.prisma.notificationSetting.create({ data: { recipientEmails: [] } });
  }

  async updateSettings(input: Omit<NotificationSettingsView, 'id'>): Promise<NotificationSettingsView> {
    const settings = await this.getSettings();
    return this.prisma.notificationSetting.update({ where: { id: settings.id }, data: input });
  }

  async findAlerts(threshold: number): Promise<MaintenanceAlert[]> {
    return (await this.findAllScheduled()).filter((alert) => alert.remainingMileage <= threshold);
  }

  async findAllScheduled(): Promise<MaintenanceAlert[]> {
    const vehicles = await this.prisma.vehicle.findMany({
      where: { nextMaintenanceMileage: { not: null } },
      include: { company: { select: { id: true, name: true } }, unit: { select: { id: true, name: true } } },
      orderBy: { nextMaintenanceMileage: 'asc' },
    });
    return vehicles.flatMap((vehicle) => {
      const next = vehicle.nextMaintenanceMileage;
      if (next === null) return [];
      const remainingMileage = next - vehicle.currentMileage;
      return [{
        vehicleId: vehicle.id, plate: vehicle.plate, brand: vehicle.brand, model: vehicle.model,
        currentMileage: vehicle.currentMileage, nextMaintenanceMileage: next, remainingMileage,
        status: remainingMileage < 0 ? 'OVERDUE' as const : 'APPROACHING' as const,
        company: vehicle.company, unit: vehicle.unit,
      }];
    });
  }

  async getRecipientEmails(): Promise<string[]> {
    const admins = await this.prisma.admin.findMany({ where: { isActive: true }, select: { email: true } });
    return admins.map((admin) => admin.email);
  }

  async wasSent(vehicleId: string, type: NotificationType, recipientEmail: string, mileageSnapshot: number) {
    return Boolean(await this.prisma.notificationLog.findFirst({ where: { vehicleId, type, recipientEmail, mileageSnapshot } }));
  }

  async logSent(vehicleId: string, type: NotificationType, recipientEmail: string, mileageSnapshot: number) {
    await this.prisma.notificationLog.create({ data: { vehicleId, type, recipientEmail, mileageSnapshot } });
  }
}
