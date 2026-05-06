import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

import { prisma } from "../../../lib/prisma";
import { validateLocationPayload } from "../../../lib/location-validation";

function getClientIp(headers: Headers): string | null {
  const forwardedFor = headers.get("x-forwarded-for");
  const realIp = headers.get("x-real-ip");
  const rawIp = forwardedFor?.split(",")[0]?.trim() || realIp?.trim();

  return rawIp || null;
}

function hashIp(ip: string | null): string | null {
  if (!ip) {
    return null;
  }

  return createHash("sha256").update(ip).digest("hex");
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const validation = validateLocationPayload(body);

  if (!validation.ok) {
    return NextResponse.json({ error: validation.message }, { status: 400 });
  }

  try {
    const userAgent = request.headers.get("user-agent");
    const ipHash = hashIp(getClientIp(request.headers));

    const record = await prisma.locationRecord.create({
      data: {
        latitude: validation.data.latitude,
        longitude: validation.data.longitude,
        accuracy: validation.data.accuracy,
        altitude: validation.data.altitude,
        speed: validation.data.speed,
        heading: validation.data.heading,
        source: validation.data.source,
        userAgent,
        ipHash,
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json({ success: true, id: record.id });
  } catch (error) {
    console.error("Failed to create location record", error);

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
