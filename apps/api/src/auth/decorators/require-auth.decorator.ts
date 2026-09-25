import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';

/**
 * Bundles the standard JWT Authentication and Permissions guards along with Swagger API Bearer auth.
 */
export function RequireAuth() {
  return applyDecorators(
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard, PermissionsGuard),
  );
}
