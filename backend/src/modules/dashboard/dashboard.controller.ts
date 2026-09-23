import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';

@ApiTags('Admin Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('overview')
  @ApiOperation({ summary: 'Dapatkan ringkasan metrik dan aktivitas terbaru untuk CMS Dashboard (Admin)' })
  @ApiResponse({ status: 200, description: 'Ringkasan metrik dashboard berhasil diambil' })
  getOverview() {
    return this.dashboardService.getOverview();
  }
}
