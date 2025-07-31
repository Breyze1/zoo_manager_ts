import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private configService: ConfigService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    let requiredRoles =
      this.reflector.getAllAndOverride<string[]>('roles', [
        context.getHandler(),
        context.getClass(),
      ]) || [];
    const { user } = context.switchToHttp().getRequest();

    // Try all possible keys for roles
    const auth0Domain = this.configService.get('AUTH0_ISSUER_BASE_URL')?.replace('https://', '').replace('/', '') || 'YOUR_AUTH0_DOMAIN';
    let roles: string[] =
      user['https://zooapi.com/roles'] ||
      user['roles'] ||
      user[`https://${auth0Domain}/roles`] ||
      [];

    // Defensive: ensure roles is always an array
    if (!Array.isArray(roles)) {
      roles = [roles];
    }

    // Support comma-separated requiredRoles
    const normalizedRequiredRoles = requiredRoles.flatMap(r => r.split(',').map(s => s.trim()));

    console.log('🔍 User object from JWT:', user);
    console.log('🔍 Found roles:', roles);
    console.log('🔍 Required roles:', requiredRoles);
    console.log('🔍 Normalized required roles:', normalizedRequiredRoles);
    console.log('Type of roles:', typeof roles, Array.isArray(roles));
    console.log('Type of requiredRoles:', typeof requiredRoles, Array.isArray(requiredRoles));

    // Log actual values and lengths
    roles.forEach((r, i) => {
      console.log(`Role in token [${i}]: '${r}' (length: ${r.length})`);
    });
    normalizedRequiredRoles.forEach((r, i) => {
      console.log(`Required role [${i}]: '${r}' (length: ${r.length})`);
    });

    // Log lowercased values
    roles.map((r) => r.toLowerCase()).forEach((role, i) => {
      console.log(`Role in token lowercased [${i}]: '${role}'`);
    });
    normalizedRequiredRoles.map((r) => r.toLowerCase()).forEach((role, i) => {
      console.log(`Required role lowercased [${i}]: '${role}'`);
    });

    const hasAnyRole = normalizedRequiredRoles.some((role) =>
      roles.map((r) => r.toLowerCase()).includes(role.toLowerCase())
    );

    console.log('🔍 hasAnyRole:', hasAnyRole);

    return normalizedRequiredRoles.length === 0 || hasAnyRole;
  }
}

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);