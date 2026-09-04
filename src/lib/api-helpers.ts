import { NextResponse } from 'next/server';
import { getAuthFromCookies } from './auth';
import { hasAnyRole } from './rbac';

export async function requireAuth() {
  const auth = await getAuthFromCookies();
  if (!auth) {
    return { auth: null, error: NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 }) };
  }
  return { auth, error: null };
}

export async function requireRole(...roles: string[]) {
  const auth = await getAuthFromCookies();
  if (!auth) {
    return { auth: null, error: NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 }) };
  }
  if (!hasAnyRole(auth.role, roles)) {
    return { auth, error: NextResponse.json({ success: false, error: 'Insufficient permissions' }, { status: 403 }) };
  }
  return { auth, error: null };
}

export function successResponse(data: Record<string, unknown>, status = 200) {
  return NextResponse.json({ success: true, ...data }, { status });
}

export function errorResponse(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status });
}
