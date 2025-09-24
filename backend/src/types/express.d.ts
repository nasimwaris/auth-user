import { User } from '@prisma/client';

declare module 'express' {
  interface Request {
    user?: {
      id: number;
      email: string;
      name: string;
      role: string;
    };
  }
}
