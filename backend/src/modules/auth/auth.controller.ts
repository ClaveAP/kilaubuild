import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // Anti brute-force: max 5 login per menit
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login admin dan dapatkan JWT Bearer Token' })
  @ApiResponse({ status: 200, description: 'Login berhasil mengembalikan token JWT' })
  @ApiResponse({ status: 401, description: 'Email atau password salah' })
  @ApiResponse({ status: 429, description: 'Terlalu banyak percobaan login, coba beberapa saat lagi' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Dapatkan informasi profil admin yang sedang login' })
  @ApiResponse({ status: 200, description: 'Data profil admin berhasil didapatkan' })
  @ApiResponse({ status: 401, description: 'Unauthorized / Token tidak valid' })
  getProfile(@CurrentUser('id') userId: string) {
    return this.authService.getProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Ubah password admin (verifikasi password lama & validasi password baru)' })
  @ApiResponse({ status: 200, description: 'Password berhasil diubah' })
  @ApiResponse({ status: 400, description: 'Password lama salah atau format password baru tidak sesuai' })
  changePassword(
    @CurrentUser('id') userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(userId, changePasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout admin' })
  @ApiResponse({ status: 200, description: 'Logout berhasil' })
  logout() {
    return {
      message: 'Logout berhasil',
      data: { loggedOut: true },
    };
  }
}
