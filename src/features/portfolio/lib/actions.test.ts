import { beforeEach, describe, expect, it, vi } from "vitest";
import { revalidatePath } from "next/cache";

const { client, createClient, insert, eq, getUser } = vi.hoisted(() => {
  const insert = vi.fn(); const eq = vi.fn(); const remove = vi.fn(() => ({ eq })); const getUser = vi.fn();
  const client = { auth: { getUser }, from: vi.fn(() => ({ insert, delete: remove })) };
  return { client, createClient: vi.fn(), insert, eq, getUser };
});
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/features/auth/lib/auth", () => ({ createSupabaseServerClient: createClient }));

function positionForm() { const data = new FormData(); data.set("symbol", "aapl"); data.set("quantity", "2"); data.set("averageCost", "180"); data.set("currency", "usd"); return data; }

describe("portfolio actions", () => {
  beforeEach(() => { vi.clearAllMocks(); createClient.mockResolvedValue(client); insert.mockResolvedValue({ error: null }); eq.mockResolvedValue({ error: null }); });

  it("does not insert when no authenticated user exists", async () => {
    getUser.mockResolvedValue({ data: { user: null }, error: null });
    const { addPortfolioPosition } = await import("./actions");
    expect(await addPortfolioPosition({ ok: false, message: "" }, positionForm())).toMatchObject({ ok: false, message: expect.stringContaining("signed in") });
    expect(insert).not.toHaveBeenCalled();
  });

  it("inserts normalized values for the authenticated user", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "user-1" } }, error: null });
    const { addPortfolioPosition } = await import("./actions");
    expect(await addPortfolioPosition({ ok: false, message: "" }, positionForm())).toEqual({ ok: true, message: "AAPL was added." });
    expect(insert).toHaveBeenCalledWith({ user_id: "user-1", symbol: "AAPL", quantity: 2, average_cost: 180, currency: "USD" });
    expect(revalidatePath).toHaveBeenCalledWith("/portfolio");
  });

  it("rejects invalid values before connecting to Supabase", async () => {
    const data = positionForm(); data.set("quantity", "0");
    const { addPortfolioPosition } = await import("./actions");
    expect(await addPortfolioPosition({ ok: false, message: "" }, data)).toMatchObject({ ok: false, message: expect.stringContaining("Quantity") });
    expect(createClient).not.toHaveBeenCalled();
  });

  it("deletes by validated id and relies on RLS ownership", async () => {
    const data = new FormData(); data.set("id", "123e4567-e89b-42d3-a456-426614174000");
    const { deletePortfolioPosition } = await import("./actions");
    expect(await deletePortfolioPosition({ ok: false, message: "" }, data)).toEqual({ ok: true, message: "Position deleted." });
    expect(eq).toHaveBeenCalledWith("id", "123e4567-e89b-42d3-a456-426614174000");
  });
});
