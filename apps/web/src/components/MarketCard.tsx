import type { TradingMarket } from "@repo/types";
import { Calendar, Droplets, TrendingUp, Copy } from "lucide-react";

export function MarketCard({ market }: { market: TradingMarket }) {
  const outcomes = Object.entries(market.choices);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(market.id);
  };

  return (
    <div className="bg-card text-card-foreground rounded-xl border border-border overflow-hidden flex flex-col h-full hover:border-primary transition-colors group">
      <div className="p-4 flex-1">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
            {market.q}
          </h3>
        </div>

        <div className="space-y-3">
          {outcomes.map(([name, data]) => {
            const pricePercent = Math.round(data.p * 100);
            return (
              <div key={name} className="space-y-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{name}</span>
                  <span className="text-muted-foreground">{pricePercent}¢</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${pricePercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-muted/30 p-4 pt-2 border-t border-border mt-auto">
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div className="flex items-center text-xs text-muted-foreground gap-1.5">
            <Droplets className="w-3.5 h-3.5" />
            <span>Liq: ${market.liq.toLocaleString()}</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground gap-1.5 text-right justify-end">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Vol: ${market.vol.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-[10px] text-muted-foreground gap-1 bg-secondary px-2 py-0.5 rounded">
            <Calendar className="w-3 h-3" />
            <span>Ends: {market.ends}</span>
          </div>
          <button
            type="button"
            onClick={copyToClipboard}
            className="p-1 hover:bg-secondary rounded transition-colors"
            title="Copy ID"
          >
            <Copy className="w-3 h-3 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
