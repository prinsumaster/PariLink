import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthenticatedUser {
  userId: string;
  id: string;
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
    if (request.user) {
      request.user.id =
        request.user.id || request.user.userId || request.user.sub;
      request.user.userId = request.user.userId || request.user.id;
    }
    return request.user;
  },
);
