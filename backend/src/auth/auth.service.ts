import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

interface AuthPayload {
  sub: number;
  email: string;
  role: string;
  name: string;
}

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async login(user: any) {
    const payload: AuthPayload = { sub: user.id, email: user.email, role: user.role, name: user.name || 'User' };
    await (this.prisma as any).loginActivity.create({ data: { userId: user.id, loginType: 'normal' } });
    return { access_token: this.jwt.sign(payload), user };
  }

  async register(email: string, password: string, name: string) {
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new BadRequestException('Email already registered');

    const hashed = await bcrypt.hash(password, 10);
    return this.prisma.user.create({ data: { email, password: hashed, name } });
  }

  async walletLogin(token: string) {
    try {
      const res = await axios.get('https://api.reown.com/verify', { headers: { Authorization: `Bearer ${token}` } });
      const walletUser = res.data;

      if (!walletUser?.email) throw new UnauthorizedException('Invalid wallet token');

      let user = await this.prisma.user.findUnique({ where: { email: walletUser.email } });

      if (!user) {
        user = await this.prisma.user.create({ data: { email: walletUser.email, name: walletUser.name || 'Wallet User', password: '' } });
      }

      const payload: AuthPayload = { sub: user.id, email: user.email, role: user.role, name: user.name || walletUser.name || 'Wallet User' };

      await (this.prisma as any).loginActivity.create({ data: { userId: user.id, loginType: 'wallet' } });

      return { access_token: this.jwt.sign(payload), user };
    } catch (err) {
      console.error('Wallet login error:', err.response?.data || err.message);
      throw new UnauthorizedException('Wallet login failed');
    }
  }
}
