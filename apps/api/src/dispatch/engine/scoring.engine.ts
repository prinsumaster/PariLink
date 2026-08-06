import { Injectable } from '@nestjs/common';

export interface ScoringWeights {
  distanceKm: number; // lower is better
  driverHoursRemaining: number; // higher is better
  vehicleUtilization: number; // higher is better
  driverSafetyScore: number; // higher is better
  idleTimeDays: number; // lower idle is better
}

export const DEFAULT_SCORING_WEIGHTS: ScoringWeights = {
  distanceKm: 30,
  driverHoursRemaining: 20,
  vehicleUtilization: 20,
  driverSafetyScore: 20,
  idleTimeDays: 10,
};

export interface CandidateInput {
  vehicleId: string;
  driverId: string;
  trailerId?: string;
  distanceToPickupKm: number;
  driverHoursRemainingToday: number; // 0–11
  vehicleUtilizationPct: number; // 0–100
  driverSafetyScore: number; // 0–100
  vehicleIdleDays: number; // days without assignment
}

export interface ScoredCandidate extends CandidateInput {
  totalScore: number;
  scoreBreakdown: Record<string, number>;
}

@Injectable()
export class ScoringEngine {
  /**
   * Scores each candidate against the configured weights.
   * Returns candidates sorted best-first (highest score).
   */
  score(
    candidates: CandidateInput[],
    weights: Partial<ScoringWeights> = {},
  ): ScoredCandidate[] {
    const w: ScoringWeights = { ...DEFAULT_SCORING_WEIGHTS, ...weights };
    const totalWeight = (Object.values(w) as number[]).reduce(
      (a, b) => a + b,
      0,
    );

    const scored = candidates.map((c) => {
      // Normalize each dimension 0–100 then apply weight
      const distanceScore = Math.max(0, 100 - c.distanceToPickupKm); // closer = higher
      const hoursScore = (c.driverHoursRemainingToday / 11) * 100;
      const utilizationScore = c.vehicleUtilizationPct;
      const safetyScore = c.driverSafetyScore;
      const idleScore = Math.max(0, 100 - c.vehicleIdleDays * 10); // fresh vehicles preferred

      const weighted =
        (distanceScore * w.distanceKm +
          hoursScore * w.driverHoursRemaining +
          utilizationScore * w.vehicleUtilization +
          safetyScore * w.driverSafetyScore +
          idleScore * w.idleTimeDays) /
        totalWeight;

      return {
        ...c,
        totalScore: Math.round(weighted * 100) / 100,
        scoreBreakdown: {
          distance: Math.round(distanceScore),
          hours: Math.round(hoursScore),
          utilization: Math.round(utilizationScore),
          safety: Math.round(safetyScore),
          idle: Math.round(idleScore),
        },
      };
    });

    return scored.sort((a, b) => b.totalScore - a.totalScore);
  }
}
