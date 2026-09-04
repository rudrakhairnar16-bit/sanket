export type Role = 'clerk' | 'interpreter' | 'dept_admin' | 'org_admin' | 'state_admin' | 'national_admin' | 'super_admin';

const ROLE_HIERARCHY: Record<Role, number> = {
  clerk: 1,
  interpreter: 2,
  dept_admin: 3,
  org_admin: 4,
  state_admin: 5,
  national_admin: 6,
  super_admin: 7,
};

export function hasRole(userRole: string, requiredRole: string): boolean {
  const userLevel = ROLE_HIERARCHY[userRole as Role] ?? 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole as Role] ?? 0;
  return userLevel >= requiredLevel;
}

export function hasAnyRole(userRole: string, roles: string[]): boolean {
  return roles.includes(userRole);
}

export function canAccessRoute(userRole: string, route: string): boolean {
  if (route.startsWith('/national')) {
    return hasRole(userRole, 'national_admin');
  }
  if (route.startsWith('/admin')) {
    return hasRole(userRole, 'dept_admin');
  }
  if (route.startsWith('/interpreter')) {
    return hasRole(userRole, 'interpreter');
  }
  if (route.startsWith('/dashboard') || route.startsWith('/assist') || route.startsWith('/learn') || route.startsWith('/practice') || route.startsWith('/progress') || route.startsWith('/certificates')) {
    return true;
  }
  return true;
}
