import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  roleId: string;
  companyId: string;
  scopes?: string[];
  roles?: string[];
  type?: string;
  customerId?: string;
  vendorId?: string;
  driverId?: string;
}

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
