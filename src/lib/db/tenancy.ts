import { JWTPayload } from "@/lib/auth";
import User, { IUser } from "@/models/User";
import { connectDB } from "@/lib/db";

export type TenantRole =
  | "clerk"
  | "interpreter"
  | "dept_admin"
  | "org_admin"
  | "state_admin"
  | "national_admin"
  | "super_admin";

const ROLE_HIERARCHY: Record<TenantRole, number> = {
  clerk: 1,
  interpreter: 2,
  dept_admin: 3,
  org_admin: 4,
  state_admin: 5,
  national_admin: 6,
  super_admin: 7,
};

export interface TenantUser {
  _id: string;
  username: string;
  role: TenantRole;
  organizationId: string;
  state: string;
  departmentId: string;
  department: string;
  name: string;
}

export function isRoleAtLeast(userRole: string, minRole: TenantRole): boolean {
  const level = ROLE_HIERARCHY[userRole as TenantRole] ?? 0;
  return level >= ROLE_HIERARCHY[minRole];
}

export function buildTenantFilter(user: TenantUser): Record<string, unknown> {
  switch (user.role) {
    case "clerk":
    case "interpreter":
      return { organizationId: user.organizationId };
    case "dept_admin":
      return { organizationId: user.organizationId };
    case "org_admin":
      return { organizationId: user.organizationId };
    case "state_admin":
      return { state: user.state };
    case "national_admin":
    case "super_admin":
      return {};
    default:
      return {};
  }
}

export function buildUserFilter(user: TenantUser): Record<string, unknown> {
  switch (user.role) {
    case "clerk":
    case "interpreter":
      return { organizationId: user.organizationId };
    case "dept_admin":
      return { organizationId: user.organizationId };
    case "org_admin":
      return { organizationId: user.organizationId };
    case "state_admin":
      return { state: user.state };
    case "national_admin":
    case "super_admin":
      return {};
    default:
      return {};
  }
}

export async function requireTenantRole(minRole: TenantRole) {
  const { getAuthFromCookies } = await import("@/lib/auth");
  const auth = await getAuthFromCookies();
  if (!auth) {
    return {
      auth: null,
      tenantUser: null,
      error: new Response(
        JSON.stringify({ success: false, error: "Authentication required" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      ),
    };
  }

  if (!isRoleAtLeast(auth.role, minRole)) {
    return {
      auth,
      tenantUser: null,
      error: new Response(
        JSON.stringify({ success: false, error: "Insufficient permissions" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      ),
    };
  }

  try {
    await connectDB();
    const dbUser = await User.findById(auth.userId).lean();
    if (!dbUser) {
      return {
        auth,
        tenantUser: null,
        error: new Response(
          JSON.stringify({ success: false, error: "User not found" }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        ),
      };
    }

    const tenantUser: TenantUser = {
      _id: (dbUser._id as any).toString(),
      username: dbUser.username,
      role: dbUser.role as TenantRole,
      organizationId: dbUser.organizationId || "",
      state: dbUser.state || "",
      departmentId: dbUser.departmentId || "",
      department: dbUser.department,
      name: dbUser.name,
    };

    return { auth, tenantUser, error: null };
  } catch {
    return {
      auth,
      tenantUser: null,
      error: new Response(
        JSON.stringify({ success: false, error: "Failed to load user context" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      ),
    };
  }
}
