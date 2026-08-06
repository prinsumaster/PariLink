import {
  ScoringEngine,
  DEFAULT_SCORING_WEIGHTS,
  CandidateInput,
} from './scoring.engine';

describe('ScoringEngine', () => {
  let engine: ScoringEngine;

  const baseCandidate: CandidateInput = {
    vehicleId: 'vehicle-1',
    driverId: 'driver-1',
    distanceToPickupKm: 10,
    driverHoursRemainingToday: 8,
    vehicleUtilizationPct: 75,
    driverSafetyScore: 90,
    vehicleIdleDays: 1,
  };

  beforeEach(() => {
    engine = new ScoringEngine();
  });

  it('should be defined', () => {
    expect(engine).toBeDefined();
  });

  it('should return empty array when no candidates provided', () => {
    const result = engine.score([]);
    expect(result).toEqual([]);
  });

  it('should return one scored candidate with a totalScore', () => {
    const result = engine.score([baseCandidate]);
    expect(result).toHaveLength(1);
    expect(result[0].totalScore).toBeGreaterThanOrEqual(0);
    expect(result[0].totalScore).toBeLessThanOrEqual(100);
    expect(result[0].scoreBreakdown).toBeDefined();
  });

  it('should sort candidates best-first (highest score first)', () => {
    const bestCandidate: CandidateInput = {
      ...baseCandidate,
      vehicleId: 'vehicle-best',
      driverId: 'driver-best',
      distanceToPickupKm: 1, // very close
      driverHoursRemainingToday: 11, // full hours
      vehicleUtilizationPct: 100,
      driverSafetyScore: 100,
      vehicleIdleDays: 0,
    };
    const worstCandidate: CandidateInput = {
      ...baseCandidate,
      vehicleId: 'vehicle-worst',
      driverId: 'driver-worst',
      distanceToPickupKm: 90, // very far
      driverHoursRemainingToday: 1, // almost done
      vehicleUtilizationPct: 10,
      driverSafetyScore: 20,
      vehicleIdleDays: 9,
    };

    const result = engine.score([worstCandidate, bestCandidate]);
    expect(result[0].vehicleId).toBe('vehicle-best');
    expect(result[1].vehicleId).toBe('vehicle-worst');
    expect(result[0].totalScore).toBeGreaterThan(result[1].totalScore);
  });

  it('should apply custom weights when provided', () => {
    const distanceFocused = engine.score([baseCandidate], {
      distanceKm: 100,
      driverHoursRemaining: 0,
      vehicleUtilization: 0,
      driverSafetyScore: 0,
      idleTimeDays: 0,
    });
    expect(distanceFocused[0].totalScore).toBeDefined();
  });

  it('should give 0 score for distance when candidate is 100+ km away', () => {
    const farCandidate: CandidateInput = {
      ...baseCandidate,
      distanceToPickupKm: 150,
    };
    const result = engine.score([farCandidate]);
    expect(result[0].scoreBreakdown.distance).toBe(0);
  });

  it('should give 0 idle score for a vehicle idle more than 10 days', () => {
    const idleCandidate: CandidateInput = {
      ...baseCandidate,
      vehicleIdleDays: 15,
    };
    const result = engine.score([idleCandidate]);
    expect(result[0].scoreBreakdown.idle).toBe(0);
  });

  it('should include scoreBreakdown with expected keys', () => {
    const result = engine.score([baseCandidate]);
    const breakdown = result[0].scoreBreakdown;
    expect(breakdown).toHaveProperty('distance');
    expect(breakdown).toHaveProperty('hours');
    expect(breakdown).toHaveProperty('utilization');
    expect(breakdown).toHaveProperty('safety');
    expect(breakdown).toHaveProperty('idle');
  });

  it('should preserve original candidate fields in scored output', () => {
    const result = engine.score([baseCandidate]);
    expect(result[0].vehicleId).toBe(baseCandidate.vehicleId);
    expect(result[0].driverId).toBe(baseCandidate.driverId);
  });
});
