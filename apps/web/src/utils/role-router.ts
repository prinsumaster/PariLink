export const getDashboardRouteForRole = (role: string, onboardingCompleted: boolean = true): string => {
  // Phase 4: First Login Experience enforcement
  if (!onboardingCompleted) {
    return '/onboarding';
  }

  // Phase 3: Deterministic role-based routing (No dropdowns)
  switch (role?.toUpperCase()) {
    case 'OWNER':
    case 'ADMIN':
      return '/dashboard';
    case 'DISPATCHER':
      return '/dispatch-workspace';
    case 'FINANCE':
      return '/finance';
    case 'WAREHOUSE':
      return '/warehouse';
    case 'DRIVER':
      return '/driver/workspace';
    default:
      return '/dashboard'; // Fallback for unknown roles
  }
};
