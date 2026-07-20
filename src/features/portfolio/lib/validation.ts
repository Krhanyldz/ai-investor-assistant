export interface ValidPortfolioInput {
  symbol: string;
  quantity: number;
  averageCost: number;
  currency: string;
}

const MAX_VALUE = 1_000_000_000_000;

function positiveNumber(value: FormDataEntryValue | null, label: string) {
  const number = Number(String(value ?? "").trim());
  if (!Number.isFinite(number) || number <= 0 || number > MAX_VALUE) {
    throw new Error(`${label} must be greater than zero and no more than ${MAX_VALUE.toLocaleString("en-US")}.`);
  }
  return number;
}

export function validatePortfolioInput(formData: FormData): ValidPortfolioInput {
  const symbol = String(formData.get("symbol") ?? "").trim().toUpperCase();
  const currency = String(formData.get("currency") ?? "").trim().toUpperCase();
  if (!/^[A-Z0-9.-]{1,15}$/.test(symbol)) throw new Error("Symbol must contain 1–15 letters, numbers, dots, or hyphens.");
  if (!/^[A-Z]{3}$/.test(currency)) throw new Error("Currency must be a three-letter ISO code.");
  return { symbol, quantity: positiveNumber(formData.get("quantity"), "Quantity"), averageCost: positiveNumber(formData.get("averageCost"), "Average cost"), currency };
}

export function validatePositionId(value: FormDataEntryValue | null) {
  const id = String(value ?? "");
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) throw new Error("Invalid position identifier.");
  return id;
}
