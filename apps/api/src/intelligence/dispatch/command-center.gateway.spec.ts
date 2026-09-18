import { Test, TestingModule } from '@nestjs/testing';
import { CommandCenterGateway } from './command-center.gateway';
import { JwtService } from '@nestjs/jwt';

describe('CommandCenterGateway', () => {
  let gateway: CommandCenterGateway;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommandCenterGateway,
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    gateway = module.get<CommandCenterGateway>(CommandCenterGateway);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleConnection', () => {
    let mockClient: any;

    beforeEach(() => {
      mockClient = {
        id: 'socket-id-123',
        handshake: {
          headers: {},
          auth: {},
        },
        join: jest.fn(),
        disconnect: jest.fn(),
      };
    });

    it('should drop connection if no token provided', async () => {
      await gateway.handleConnection(mockClient);
      expect(mockClient.disconnect).toHaveBeenCalledWith(true);
      expect(mockClient.join).not.toHaveBeenCalled();
    });

    it('should drop connection if token is invalid', async () => {
      mockClient.handshake.auth.token = 'invalid.jwt.token';
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('jwt malformed');
      });

      await gateway.handleConnection(mockClient);
      
      expect(jwtService.verify).toHaveBeenCalledWith('invalid.jwt.token');
      expect(mockClient.disconnect).toHaveBeenCalledWith(true);
      expect(mockClient.join).not.toHaveBeenCalled();
    });

    it('should drop connection if token has no companyId', async () => {
      mockClient.handshake.auth.token = 'valid.jwt.no-company';
      jest.spyOn(jwtService, 'verify').mockReturnValue({ userId: 'user-1' });

      await gateway.handleConnection(mockClient);
      
      expect(jwtService.verify).toHaveBeenCalledWith('valid.jwt.no-company');
      expect(mockClient.disconnect).toHaveBeenCalledWith(true);
      expect(mockClient.join).not.toHaveBeenCalled();
    });

    it('should join strictly isolated tenant room if token is valid', async () => {
      const companyId = 'test-tenant-xyz';
      mockClient.handshake.auth.token = 'valid.jwt.token';
      jest.spyOn(jwtService, 'verify').mockReturnValue({ companyId, userId: 'user-1' });

      await gateway.handleConnection(mockClient);

      expect(jwtService.verify).toHaveBeenCalledWith('valid.jwt.token');
      expect(mockClient.disconnect).not.toHaveBeenCalled();
      expect(mockClient.join).toHaveBeenCalledWith(`tenant_${companyId}`);
      expect(mockClient.companyId).toBe(companyId);
    });
  });
});
