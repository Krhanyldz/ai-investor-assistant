import {beforeEach,describe,expect,it,vi} from "vitest";
const {createClient,getUser,insert,eq}=vi.hoisted(()=>({createClient:vi.fn(),getUser:vi.fn(),insert:vi.fn(),eq:vi.fn()}));
vi.mock("next/cache",()=>({revalidatePath:vi.fn()}));
vi.mock("@/features/auth/lib/auth",()=>({createSupabaseServerClient:createClient}));
function form(symbol:string){const data=new FormData();data.set("symbol",symbol);return data;}
describe("watchlist actions",()=>{
 beforeEach(()=>{vi.clearAllMocks();createClient.mockResolvedValue({auth:{getUser},from:vi.fn(()=>({insert,delete:()=>({eq})}))});insert.mockResolvedValue({error:null});eq.mockResolvedValue({error:null});});
 it("rejects invalid symbols before database access",async()=>{const{addWatchlistItem}=await import("./actions");expect(await addWatchlistItem({ok:false,message:""},form("BAD!"))).toMatchObject({ok:false});expect(createClient).not.toHaveBeenCalled();});
 it("requires authentication",async()=>{getUser.mockResolvedValue({data:{user:null}});const{addWatchlistItem}=await import("./actions");expect(await addWatchlistItem({ok:false,message:""},form("AAPL"))).toMatchObject({ok:false,message:expect.stringContaining("signed in")});expect(insert).not.toHaveBeenCalled();});
 it("normalizes and inserts an authenticated user's symbol",async()=>{getUser.mockResolvedValue({data:{user:{id:"user-1"}}});const{addWatchlistItem}=await import("./actions");expect(await addWatchlistItem({ok:false,message:""},form(" aapl "))).toEqual({ok:true,message:"AAPL added."});expect(insert).toHaveBeenCalledWith({user_id:"user-1",symbol:"AAPL"});});
 it("validates item UUID before deleting",async()=>{const{deleteWatchlistItem}=await import("./actions");const bad=new FormData();bad.set("id","------------------------------------");expect(await deleteWatchlistItem({ok:false,message:""},bad)).toMatchObject({ok:false});expect(createClient).not.toHaveBeenCalled();const valid=new FormData();valid.set("id","123e4567-e89b-42d3-a456-426614174000");expect(await deleteWatchlistItem({ok:false,message:""},valid)).toEqual({ok:true,message:"Item removed."});expect(eq).toHaveBeenCalledWith("id","123e4567-e89b-42d3-a456-426614174000");});
});
