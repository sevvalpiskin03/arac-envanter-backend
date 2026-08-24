import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Sistem')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'API sağlık durumunu kontrol eder' })
  getHealth(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}

