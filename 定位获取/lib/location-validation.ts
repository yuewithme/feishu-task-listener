export type LocationPayload = {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  speed?: number;
  heading?: number;
  source?: string;
};

export type ValidationResult =
  | { ok: true; data: LocationPayload }
  | { ok: false; message: string };

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function validateOptionalNumber(
  payload: Record<string, unknown>,
  field: "accuracy" | "altitude" | "speed" | "heading",
): number | undefined {
  const value = payload[field];

  if (value === undefined) {
    return undefined;
  }

  if (!isFiniteNumber(value)) {
    throw new Error(`${field} must be a number`);
  }

  return value;
}

export function validateLocationPayload(payload: unknown): ValidationResult {
  if (!isPlainObject(payload)) {
    return { ok: false, message: "Request body must be a JSON object" };
  }

  if (!isFiniteNumber(payload.latitude) || payload.latitude < -90 || payload.latitude > 90) {
    return { ok: false, message: "latitude must be a number between -90 and 90" };
  }

  if (!isFiniteNumber(payload.longitude) || payload.longitude < -180 || payload.longitude > 180) {
    return { ok: false, message: "longitude must be a number between -180 and 180" };
  }

  try {
    const accuracy = validateOptionalNumber(payload, "accuracy");
    const altitude = validateOptionalNumber(payload, "altitude");
    const speed = validateOptionalNumber(payload, "speed");
    const heading = validateOptionalNumber(payload, "heading");
    const sourceValue = payload.source;

    if (sourceValue !== undefined && typeof sourceValue !== "string") {
      return { ok: false, message: "source must be a string" };
    }

    const source = typeof sourceValue === "string" ? sourceValue : undefined;

    return {
      ok: true,
      data: {
        latitude: payload.latitude,
        longitude: payload.longitude,
        accuracy,
        altitude,
        speed,
        heading,
        source,
      },
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Invalid location payload",
    };
  }
}
