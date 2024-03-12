import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { verifyJwt } from '@clerk/clerk-sdk-node';

@Injectable()
export class ClerkAuthService implements AuthService {
  authenticate(_username: string, _password: string): Promise<boolean> {
    throw new Error('Clerk authentication happens on their end.');
  }

  async validate(request: Request): Promise<boolean> {
    const tokenFromCookie: string | undefined = request.cookies?.['__session'];
    const tokenFromHeader = request.headers.authorization;

    const token = tokenFromHeader ? tokenFromHeader : tokenFromCookie;

    if (token === undefined) {
      return false;
    }

    const key = process.env.CLERK_PUBLIC_KEY;
    if (!key) {
      throw new Error('NO CLERK_PUBLIC_KEY present in the .env file');
    }

    try {
      const decoded = await verifyJwt(token, {
        issuer: null,
        key,
      });
      if (decoded.exp < Math.floor(Date.now() / 1000)) {
        return false;
      }
      if (decoded.nbf > Math.floor(Date.now() / 1000)) {
        return false;
      }
    } catch (_err) {
      return false;
    }

    return true;
  }
}
