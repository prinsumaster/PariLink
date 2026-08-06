import { Test, TestingModule } from '@nestjs/testing';
import { ConditionEngineService } from './condition.service';

describe('ConditionEngineService', () => {
  let service: ConditionEngineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConditionEngineService],
    }).compile();

    service = module.get<ConditionEngineService>(ConditionEngineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const context = {
    load: {
      status: 'PENDING',
      amount: 1000,
      customer: { name: 'Acme Corp' },
      items: ['A', 'B'],
    },
    flags: { isActive: true },
  };

  describe('Logical Operators', () => {
    it('should evaluate AND correctly', () => {
      const node = {
        operator: 'AND',
        rules: [
          { field: 'load.status', operator: 'EQUALS', value: 'PENDING' },
          { field: 'load.amount', operator: 'GREATER_THAN', value: 500 },
        ],
      };
      expect(service.evaluate(node, context)).toBe(true);
    });

    it('should evaluate OR correctly', () => {
      const node = {
        operator: 'OR',
        rules: [
          { field: 'load.status', operator: 'EQUALS', value: 'ACTIVE' },
          { field: 'load.amount', operator: 'GREATER_THAN', value: 500 },
        ],
      };
      expect(service.evaluate(node, context)).toBe(true);
    });

    it('should evaluate NOT correctly', () => {
      const node = {
        operator: 'NOT',
        rules: [{ field: 'load.status', operator: 'EQUALS', value: 'ACTIVE' }],
      };
      expect(service.evaluate(node, context)).toBe(true);
    });
  });

  describe('Comparison Operators', () => {
    it('should evaluate EQUALS and NOT_EQUALS', () => {
      expect(
        service.evaluateRule(
          { field: 'load.status', operator: 'EQUALS', value: 'PENDING' },
          context,
        ),
      ).toBe(true);
      expect(
        service.evaluateRule(
          { field: 'load.status', operator: 'NOT_EQUALS', value: 'ACTIVE' },
          context,
        ),
      ).toBe(true);
    });

    it('should evaluate Numeric comparisons', () => {
      expect(
        service.evaluateRule(
          { field: 'load.amount', operator: 'GREATER_THAN', value: 500 },
          context,
        ),
      ).toBe(true);
      expect(
        service.evaluateRule(
          { field: 'load.amount', operator: 'LESS_THAN', value: 2000 },
          context,
        ),
      ).toBe(true);
      expect(
        service.evaluateRule(
          { field: 'load.amount', operator: 'BETWEEN', value: [500, 1500] },
          context,
        ),
      ).toBe(true);
    });

    it('should evaluate String operations', () => {
      expect(
        service.evaluateRule(
          { field: 'load.customer.name', operator: 'CONTAINS', value: 'Acme' },
          context,
        ),
      ).toBe(true);
      expect(
        service.evaluateRule(
          {
            field: 'load.customer.name',
            operator: 'STARTS_WITH',
            value: 'Acm',
          },
          context,
        ),
      ).toBe(true);
      expect(
        service.evaluateRule(
          { field: 'load.customer.name', operator: 'ENDS_WITH', value: 'Corp' },
          context,
        ),
      ).toBe(true);
      expect(
        service.evaluateRule(
          { field: 'load.customer.name', operator: 'REGEX', value: '^Acme' },
          context,
        ),
      ).toBe(true);
    });

    it('should evaluate Array operations', () => {
      expect(
        service.evaluateRule(
          {
            field: 'load.status',
            operator: 'IN',
            value: ['PENDING', 'ACTIVE'],
          },
          context,
        ),
      ).toBe(true);
      expect(
        service.evaluateRule(
          { field: 'load.status', operator: 'NOT_IN', value: ['CLOSED'] },
          context,
        ),
      ).toBe(true);
    });

    it('should evaluate Existence', () => {
      expect(
        service.evaluateRule(
          { field: 'load.status', operator: 'EXISTS' },
          context,
        ),
      ).toBe(true);
      expect(
        service.evaluateRule(
          { field: 'load.missingField', operator: 'NOT_EXISTS' },
          context,
        ),
      ).toBe(true);
    });
  });
});
