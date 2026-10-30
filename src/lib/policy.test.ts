import { describe, expect, it } from "vitest";
import { canCreateTicket, canViewTicket, seesAllTickets, toRole, type Actor } from "./policy";

const ingrid: Actor = { id: "user-ingrid", role: "employee" };
const sindre: Actor = { id: "user-sindre", role: "agent" };
const marte: Actor = { id: "user-marte", role: "admin" };

const ingridsTicket = { requesterId: "user-ingrid" };
const olasTicket = { requesterId: "user-ola" };

describe("canViewTicket", () => {
  it("lets an employee see their own ticket", () => {
    expect(canViewTicket(ingrid, ingridsTicket)).toBe(true);
  });

  it("stops an employee from seeing someone else's ticket", () => {
    expect(canViewTicket(ingrid, olasTicket)).toBe(false);
  });

  it("lets agents and admins see every ticket", () => {
    expect(canViewTicket(sindre, olasTicket)).toBe(true);
    expect(canViewTicket(marte, olasTicket)).toBe(true);
  });
});

describe("seesAllTickets", () => {
  it("is false for employees and true for agents and admins", () => {
    expect(seesAllTickets(ingrid)).toBe(false);
    expect(seesAllTickets(sindre)).toBe(true);
    expect(seesAllTickets(marte)).toBe(true);
  });
});

describe("canCreateTicket", () => {
  it("lets every role report a ticket", () => {
    expect(canCreateTicket(ingrid)).toBe(true);
    expect(canCreateTicket(sindre)).toBe(true);
    expect(canCreateTicket(marte)).toBe(true);
  });
});

describe("toRole", () => {
  it("keeps the three known roles", () => {
    expect(toRole("employee")).toBe("employee");
    expect(toRole("agent")).toBe("agent");
    expect(toRole("admin")).toBe("admin");
  });

  it("treats anything unexpected as an employee, the role with the least access", () => {
    expect(toRole("superuser")).toBe("employee");
    expect(toRole(undefined)).toBe("employee");
    expect(toRole(null)).toBe("employee");
  });
});
