import { render,screen } from "@testing-library/react";
import { describe,expect,it,vi } from "vitest";
import { WatchlistView } from "@/features/watchlist/components/watchlist-view";
vi.mock("@/features/watchlist/lib/actions",()=>({addWatchlistItem:vi.fn(),deleteWatchlistItem:vi.fn()}));
const source={provider:"finnhub" as const,retrievedAt:"2026-07-20T12:00:00Z",dataTimestamp:"2026-07-20T12:00:00Z",isFallback:false,label:"Finnhub"};
const row={id:"123e4567-e89b-42d3-a456-426614174000",symbol:"AAPL",createdAt:"2026-07-20T12:00:00Z",quote:{ok:true as const,data:{symbol:"AAPL",currentPrice:200,change:2,percentChange:1,highPrice:201,lowPrice:198,openPrice:199,previousClose:198,source}}};
describe("WatchlistView",()=>{
 it("renders sourced quotes and research link",()=>{render(<WatchlistView rows={[row]}/>);expect(screen.getByRole("link",{name:"AAPL"}).getAttribute("href")).toBe("/stocks/AAPL");expect(screen.getByText("Finnhub",{exact:false})).toBeTruthy();expect(screen.getByText(/not recommendations/i)).toBeTruthy();});
 it("renders empty and error states",()=>{const{rerender}=render(<WatchlistView rows={[]}/>);expect(screen.getByRole("heading",{name:/watchlist is empty/i})).toBeTruthy();rerender(<WatchlistView rows={[]} error="Load failed"/>);expect(screen.getByRole("alert")).toBeTruthy();});
});
