export type AlertStatus = 'APPROACHING' | 'OVERDUE';

export interface MaintenanceAlert {
  vehicleId: string;
  plate: string;
  brand: string;
  model: string;
  currentMileage: number;
  nextMaintenanceMileage: number;
  remainingMileage: number;
  status: AlertStatus;
  company: { id: string; name: string };
  unit: { id: string; name: string };
}

export interface NotificationSettingsView {
  id: string;
  warningMileageThreshold: number;
  emailEnabled: boolean;
  recipientEmails: string[];
}
