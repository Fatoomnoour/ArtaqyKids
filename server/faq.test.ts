import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(user: TrpcContext["user"]): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("faq procedures", () => {
  it("allows public published FAQ reads", async () => {
    const caller = appRouter.createCaller(createContext(null));
    const result = await caller.faq.listPublished();
    expect(Array.isArray(result)).toBe(true);
  });

  it("blocks non-admin FAQ management", async () => {
    const caller = appRouter.createCaller(createContext({
      id: 2,
      openId: "parent-user",
      name: "Parent User",
      email: "parent@example.com",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    }));

    await expect(caller.faq.adminList()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
