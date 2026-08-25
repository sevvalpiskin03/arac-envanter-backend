import type { NotificationType } from '../../generated/prisma/enums';
import type { MaintenanceAlert, NotificationSettingsView } from './maintenance-alert.types';

export const MAINTENANCE_ALERT_REPOSITORY = Symbol('MAINTENANCE_ALERT_REPOSITORY');

export interface MaintenanceAlertRepository {
  getSettings(): Promise<NotificationSettingsView>;
  updateSettings(input: Omit<NotificationSettingsView, 'id'>): Promise<NotificationSettingsView>;
  findAlerts(threshold: number): Promise<MaintenanceAlert[]>;
  findAllScheduled(): Promise<MaintenanceAlert[]>;
  getRecipientEmails(): Promise<string[]>;
  wasSent(vehicleId: string, type: NotificationType, recipient: string, mileage: number): Promise<boolean>;
  logSent(vehicleId: string, type: NotificationType, recipient: string, mileage: number): Promise<void>;
}
