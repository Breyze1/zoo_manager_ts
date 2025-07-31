// auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${configService.get('AUTH0_ISSUER_BASE_URL')}.well-known/jwks.json`,
      }),
      audience: [
        'http://localhost:3000',
        configService.get('AUTH0_ISSUER_BASE_URL') + 'userinfo',
      ],
      issuer: configService.get('AUTH0_ISSUER_BASE_URL'),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    return payload;
  }
}
