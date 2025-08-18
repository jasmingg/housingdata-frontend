import type { HousingDto } from "../types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export function buildHousingUrl(state: string, metro: string) {
  const url = new URL("/api", BASE_URL);
  url.searchParams.set("state", state);
  let stringMetro = String(metro);
  url.searchParams.set("metro", stringMetro);
  return url.toString();
}

// creating a customized error for different issues
export class ApiError extends Error {
  status?: number;
  body?: string;
  constructor(message: string, status?: number, body?: string) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

export async function fetchHousing(state: string, metro: string): Promise<HousingDto> {
  const res = await fetch(buildHousingUrl(state, metro), { headers: { Accept: "application/json" } });
  if (!res.ok) {
    let text = "";
    try { text = await res.text(); } catch {}
    throw new ApiError(`HTTP ${res.status}`, res.status, text);
  }
  return res.json();
}