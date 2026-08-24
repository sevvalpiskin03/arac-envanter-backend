import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MAINTENANCE_ALERT_REPOSITORY } from './maintenance-alert.repository';
import { MaintenanceAlertsController } from './maintenance-alerts.controller';
import { MaintenanceAlertsService } from './maintenance-alerts.service';
import { PrismaMaintenanceAlertRepository } from './prisma-maintenance-alert.repository';

@Module({ controllers: [MaintenanceAlertsController], providers: [MaintenanceAlertsService, EmailService, { provide: MAINTENANCE_ALERT_REPOSITORY, useClass: PrismaMaintenanceAlertRepository }] })
export class MaintenanceAlertsModule {}
