import { TenantCacheInterceptor } from './tenant-cache.interceptor';
import { ExecutionContext } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';

describe('TenantCacheInterceptor', () => {
  let interceptor: TenantCacheInterceptor;
  let mockContext: ExecutionContext;
  let mockRequest: any;
  let mockCacheManager: any;
  let mockReflector: any;

  beforeEach(() => {
    mockCacheManager = {};
    mockReflector = {};
    interceptor = new TenantCacheInterceptor(mockCacheManager, mockReflector);

    mockRequest = {
      url: '/api/v1/dashboard/kpis',
      user: {
        companyId: 'test-tenant-id'
      }
    };

    mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    } as unknown as ExecutionContext;
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should return undefined if companyId is missing', () => {
    mockRequest.user = undefined;
    expect(interceptor.trackBy(mockContext)).toBeUndefined();
  });

  it('should isolate cache key by appending companyId', () => {
    // Mock the super.trackBy to return a standard route path string
    jest.spyOn(CacheInterceptor.prototype as any, 'trackBy').mockReturnValue('/api/v1/dashboard/kpis');

    const cacheKey = interceptor.trackBy(mockContext);
    expect(cacheKey).toBe('/api/v1/dashboard/kpis_tenant_test-tenant-id');
  });
});
