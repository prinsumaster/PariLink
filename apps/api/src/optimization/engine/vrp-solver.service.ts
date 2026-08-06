import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Interface representing a node in the VRP graph.
 */
export interface VrpNode {
  id: string; // Load ID or location ID
  latitude: number;
  longitude: number;
  demandWeight?: number;
  demandVolume?: number;
  readyTime?: Date;
  dueDate?: Date;
  serviceDurationMinutes?: number;
}

export interface VrpVehicle {
  id: string; // Vehicle ID
  startLatitude: number;
  startLongitude: number;
  capacityWeight?: number;
  capacityVolume?: number;
  maxTravelTimeMinutes?: number;
}

export interface VrpSolution {
  vehicleRoutes: {
    vehicleId: string;
    route: VrpNode[];
    totalDistance: number;
    totalTimeMinutes: number;
    totalWeight: number;
  }[];
  unassignedNodes: VrpNode[];
}

@Injectable()
export class VrpSolverService {
  private readonly logger = new Logger(VrpSolverService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Approximates distance between two points using the Haversine formula.
   * Returns distance in kilometers.
   */
  private calculateHaversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const toRadian = (angle: number) => (Math.PI / 180) * angle;
    const distance = (a: number, b: number) => (Math.PI / 180) * (a - b);
    const RADIUS_OF_EARTH_IN_KM = 6371;

    const dLat = distance(lat2, lat1);
    const dLon = distance(lon2, lon1);

    lat1 = toRadian(lat1);
    lat2 = toRadian(lat2);

    const a =
      Math.pow(Math.sin(dLat / 2), 2) +
      Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.asin(Math.sqrt(a));
    return RADIUS_OF_EARTH_IN_KM * c;
  }

  /**
   * Solves the Capacitated Vehicle Routing Problem (CVRP) using a greedy Nearest-Neighbor heuristic.
   * This is scalable enough to run in a Node.js process for small-to-medium datasets.
   * For extremely large datasets, this would be swapped with a background worker (e.g. OR-Tools via BullMQ).
   */
  public solve(nodes: VrpNode[], vehicles: VrpVehicle[]): VrpSolution {
    this.logger.log(
      `Starting VRP Solve for ${nodes.length} nodes and ${vehicles.length} vehicles.`,
    );
    const unassignedNodes = [...nodes];
    const vehicleRoutes: VrpSolution['vehicleRoutes'] = vehicles.map((v) => ({
      vehicleId: v.id,
      route: [],
      totalDistance: 0,
      totalTimeMinutes: 0,
      totalWeight: 0,
    }));

    // Assume average speed of 60 km/h (1 km per minute)
    const SPEED_KM_PER_MIN = 1;

    for (const routeObj of vehicleRoutes) {
      const vehicle = vehicles.find((v) => v.id === routeObj.vehicleId);
      if (!vehicle) continue;

      let currentLocation = {
        lat: vehicle.startLatitude,
        lng: vehicle.startLongitude,
      };
      let capacityRemaining = vehicle.capacityWeight || Infinity;

      while (unassignedNodes.length > 0) {
        let nearestIdx = -1;
        let shortestDistance = Infinity;

        // Find nearest feasible node
        for (let i = 0; i < unassignedNodes.length; i++) {
          const node = unassignedNodes[i];
          const demand = node.demandWeight || 0;

          if (demand > capacityRemaining) continue; // Capacity constraint

          const distance = this.calculateHaversineDistance(
            currentLocation.lat,
            currentLocation.lng,
            node.latitude,
            node.longitude,
          );

          if (distance < shortestDistance) {
            shortestDistance = distance;
            nearestIdx = i;
          }
        }

        if (nearestIdx === -1) {
          // No feasible node found for this vehicle (e.g., due to capacity)
          break;
        }

        // Assign node
        const assignedNode = unassignedNodes[nearestIdx];
        routeObj.route.push(assignedNode);
        routeObj.totalDistance += shortestDistance;
        routeObj.totalTimeMinutes +=
          shortestDistance / SPEED_KM_PER_MIN +
          (assignedNode.serviceDurationMinutes || 0);
        routeObj.totalWeight += assignedNode.demandWeight || 0;

        capacityRemaining -= assignedNode.demandWeight || 0;
        currentLocation = {
          lat: assignedNode.latitude,
          lng: assignedNode.longitude,
        };

        // Remove from unassigned
        unassignedNodes.splice(nearestIdx, 1);
      }
    }

    this.logger.log(
      `VRP Solve complete. Unassigned nodes: ${unassignedNodes.length}`,
    );
    return { vehicleRoutes, unassignedNodes };
  }
}
