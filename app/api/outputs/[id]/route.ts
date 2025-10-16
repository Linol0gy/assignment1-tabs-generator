import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: any) {
  const output = await prisma.generatedOutput.findUnique({
    where: { id: params.id },
  });

  if (!output) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json(output);
}

export async function PUT(request: Request, { params }: any) {
  const body = (await request.json().catch(() => null)) as
    | { scenario?: string; html?: string }
    | null;

  if (!body || !body.scenario || !body.html) {
    return NextResponse.json(
      { error: "Both scenario and html fields are required." },
      { status: 400 },
    );
  }

  try {
    const updated = await prisma.generatedOutput.update({
      where: { id: params.id },
      data: {
        scenario: body.scenario,
        html: body.html,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
}

export async function DELETE(_: Request, { params }: any) {
  try {
    await prisma.generatedOutput.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
}
