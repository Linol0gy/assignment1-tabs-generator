import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import type { PrismaClient } from "@prisma/client";

const dbPath = path.join(process.cwd(), "prisma", "test.db");

let prisma: PrismaClient;
let outputsApi: typeof import("@/app/api/outputs/route");
let outputIdApi: typeof import("@/app/api/outputs/[id]/route");

describe("Outputs API", () => {
  beforeAll(async () => {
    process.env.DATABASE_URL = `file:${dbPath.replace(/\\/g, "/")}`;

    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }

    // Ensure we do not reuse any cached Prisma instance
    delete (globalThis as unknown as { prisma?: PrismaClient }).prisma;

    prisma = (await import("@/lib/prisma")).prisma;

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "GeneratedOutput" (
        "id" TEXT PRIMARY KEY,
        "scenario" TEXT NOT NULL,
        "html" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    outputsApi = await import("@/app/api/outputs/route");
    outputIdApi = await import("@/app/api/outputs/[id]/route");
  });

  beforeEach(async () => {
    await prisma.generatedOutput.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
  });

  it("creates a snapshot via POST and lists it with GET", async () => {
    const payload = {
      scenario: "court-room",
      html: "<html><body>Example</body></html>",
    };

    const createResponse = await outputsApi.POST(
      new Request("http://localhost/api/outputs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    );

    expect(createResponse.status).toBe(201);
    const created = await createResponse.json();
    expect(created.scenario).toBe(payload.scenario);
    expect(created.html).toBe(payload.html);

    const listResponse = await outputsApi.GET();
    expect(listResponse.status).toBe(200);
    const list = (await listResponse.json()) as Array<{ id: string }>;
    expect(list).toHaveLength(1);
    expect(list[0]?.id).toBe(created.id);
  });

  it("retrieves, updates, and deletes a snapshot via the dynamic route", async () => {
    const initial = await prisma.generatedOutput.create({
      data: {
        scenario: "court-room",
        html: "<html><body>Initial</body></html>",
      },
    });

    const getResponse = await outputIdApi.GET(
      new Request(`http://localhost/api/outputs/${initial.id}`),
      { params: { id: initial.id } },
    );
    expect(getResponse.status).toBe(200);
    const fetched = await getResponse.json();
    expect(fetched.id).toBe(initial.id);

    const updateResponse = await outputIdApi.PUT(
      new Request(`http://localhost/api/outputs/${initial.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario: "court-room",
          html: "<html><body>Updated</body></html>",
        }),
      }),
      { params: { id: initial.id } },
    );

    expect(updateResponse.status).toBe(200);
    const updated = await updateResponse.json();
    expect(updated.html).toContain("Updated");

    const deleteResponse = await outputIdApi.DELETE(
      new Request(`http://localhost/api/outputs/${initial.id}`, {
        method: "DELETE",
      }),
      { params: { id: initial.id } },
    );

    expect(deleteResponse.status).toBe(200);

    const remaining = await prisma.generatedOutput.count();
    expect(remaining).toBe(0);
  });
});
