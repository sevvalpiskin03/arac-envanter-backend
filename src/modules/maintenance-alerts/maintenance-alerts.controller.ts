import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateNotificationSettingsDto } from './dto/update-notification-settings.dto';
import { MaintenanceAlertsService } from './maintenance-alerts.service';

@ApiTags('Bakım Uyarıları')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('maintenance-alerts')
export class MaintenanceAlertsController {
  constructor(private readonly alerts: MaintenanceAlertsService) {}
  @Get() list() { return this.alerts.list(); }
  @Get('settings') getSettings() { return this.alerts.getSettings(); }
  @Patch('settings') updateSettings(@Body() input: UpdateNotificationSettingsDto) { return this.alerts.updateSettings(input); }
  @Post('send-emails') sendEmails() { return this.alerts.sendEmails(); }
}
