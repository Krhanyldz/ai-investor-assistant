import type { MarketDataSource } from "@/domain/market-data";

export function formatCurrency(value: number | undefined, currency = "USD") {
  if (value === undefined || !Number.isFinite(value)) {
    return "Unavailable";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: value >= 100 ? 2 : 4,
  }).format(value);
}

export function formatCompactNumber(value: number | undefined) {
  if (value === undefined || !Number.isFinite(value)) {
    return "Unavailable";
  }

  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number | undefined) {
  if (value === undefined || !Number.isFinite(value)) {
    return "Unavailable";
  }

  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export function formatMetricValue(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return "Unavailable";
  }

  if (typeof value === "number") {
    return Number.isInteger(value)
      ? new Intl.NumberFormat("en-US").format(value)
      : new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);
  }

  return value;
}

export function formatDateTime(value: string | undefined) {
  if (!value) {
    return "Unavailable";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function getFreshnessLabel(source: MarketDataSource | undefined) {
  if (!source) {
    return "Freshness unavailable";
  }

  if (source.isFallback) {
    return "Demo data - not live market data";
  }

  const timestamp = new Date(source.dataTimestamp).getTime();

  if (Number.isNaN(timestamp)) {
    return "Freshness unavailable";
  }

  const ageMinutes = Math.max(0, Math.round((Date.now() - timestamp) / 60_000));

  if (ageMinutes < 1) {
    return "Updated less than 1 minute ago";
  }

  if (ageMinutes < 60) {
    return `Updated ${ageMinutes} minutes ago`;
  }

  const ageHours = Math.round(ageMinutes / 60);
  return `Updated ${ageHours} hours ago`;
}
