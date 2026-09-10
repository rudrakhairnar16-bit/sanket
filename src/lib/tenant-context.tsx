"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { User } from "@/types";

export interface TenantInfo {
  user: User | null;
  tenantFilter: Record<string, string>;
  orgName: string;
  stateName: string;
}

const TenantContext = createContext<TenantInfo>({
  user: null,
  tenantFilter: {} as Record<string, string>,
  orgName: "",
  stateName: "",
});

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [orgName, setOrgName] = useState("");
  const [stateName, setStateName] = useState("");

  useEffect(() => {
    if (user) {
      setOrgName(user.organizationId || user.department || "");
      setStateName(user.state || "");
    } else {
      setOrgName("");
      setStateName("");
    }
  }, [user]);

  const tenantFilter = useMemo(() => {
    if (!user) return {} as Record<string, string>;
    switch (user.role) {
      case "clerk":
      case "interpreter":
        return { organizationId: user.organizationId || "" } as Record<string, string>;
      case "dept_admin":
        return { organizationId: user.organizationId || "" } as Record<string, string>;
      case "org_admin":
        return { organizationId: user.organizationId || "" } as Record<string, string>;
      case "state_admin":
        return { state: user.state || "" } as Record<string, string>;
      case "national_admin":
      case "super_admin":
        return {} as Record<string, string>;
      default:
        return {} as Record<string, string>;
    }
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      tenantFilter,
      orgName,
      stateName,
    }),
    [user, tenantFilter, orgName, stateName]
  );

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenant() {
  return useContext(TenantContext);
}
