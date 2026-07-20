"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/features/auth/lib/auth";
import type { PortfolioActionState, PortfolioPosition } from "@/domain/portfolio";
import { validatePortfolioInput, validatePositionId } from "@/features/portfolio/lib/validation";

interface PositionRow { id: string; symbol: string; quantity: number | string; average_cost: number | string; currency: string; created_at: string }

export async function getPortfolioPositions(): Promise<{ positions: PortfolioPosition[]; error?: string }> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("portfolio_positions").select("id, symbol, quantity, average_cost, currency, created_at").order("created_at", { ascending: false });
  if (error) return { positions: [], error: "Portfolio positions could not be loaded." };
  return { positions: ((data ?? []) as PositionRow[]).map((row) => ({ id: row.id, symbol: row.symbol, quantity: Number(row.quantity), averageCost: Number(row.average_cost), currency: row.currency, createdAt: row.created_at })) };
}

export async function addPortfolioPosition(_previous: PortfolioActionState, formData: FormData): Promise<PortfolioActionState> {
  try {
    const input = validatePortfolioInput(formData);
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { ok: false, message: "You must be signed in to add a position." };
    const { error } = await supabase.from("portfolio_positions").insert({ user_id: user.id, symbol: input.symbol, quantity: input.quantity, average_cost: input.averageCost, currency: input.currency });
    if (error) return { ok: false, message: error.code === "23505" ? "That symbol and currency already exist in your portfolio." : "The position could not be saved." };
    revalidatePath("/portfolio");
    return { ok: true, message: `${input.symbol} was added.` };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Invalid position." };
  }
}

export async function deletePortfolioPosition(_previous: PortfolioActionState, formData: FormData): Promise<PortfolioActionState> {
  try {
    const id = validatePositionId(formData.get("id"));
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("portfolio_positions").delete().eq("id", id);
    if (error) return { ok: false, message: "The position could not be deleted." };
    revalidatePath("/portfolio");
    return { ok: true, message: "Position deleted." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Invalid position." };
  }
}
