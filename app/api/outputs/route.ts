import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const outputs = await prisma.generatedOutput.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(outputs);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: "Invalid payload." },
      { status: 400 },
    );
  }

  const { scenario, html } = body as { scenario?: string; html?: string };

  if (!scenario || !html) {
    return NextResponse.json(
      { error: "Both scenario and html fields are required." },
      { status: 400 },
    );
  }

  const created = await prisma.generatedOutput.create({
    data: {
      scenario,
      html,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
