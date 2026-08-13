import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";

let signToken: (payload: any) => string;
let decodeToken: (token: string) => any;

beforeAll(async () => {
  vi.stubEnv("JWT_SECRET", "test-secret-for-sanket-auth-tests-2026");
  const mod = (await import("./auth")) as typeof import("./auth");
  signToken = mod.signToken;
  decodeToken = mod.decodeToken;
});

afterAll(() => {
  vi.unstubAllEnvs();
});

const samplePayload = {
  userId: "user-123",
  username: "testuser",
  role: "learner" as const,
  department: "Water Tax",
};

describe("signToken", () => {
  it("creates a valid token string", () => {
    const token = signToken(samplePayload);
    expect(token).toBeTruthy();
    expect(typeof token).toBe("string");
    expect(token.split(".").length).toBe(3);
  });
});

describe("decodeToken", () => {
  it("returns payload for a valid token", () => {
    const token = signToken(samplePayload);
    const decoded = decodeToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded!.userId).toBe("user-123");
    expect(decoded!.username).toBe("testuser");
    expect(decoded!.role).toBe("learner");
    expect(decoded!.department).toBe("Water Tax");
  });

  it("returns null for an invalid token", () => {
    const result = decodeToken("invalid.token.here");
    expect(result).toBeNull();
  });

  it("returns null for a tampered token", () => {
    const token = signToken(samplePayload);
    const parts = token.split(".");
    const tampered = parts[0] + "." + parts[1] + ".bad signature";
    const result = decodeToken(tampered);
    expect(result).toBeNull();
  });
});
