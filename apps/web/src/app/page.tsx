"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { MarketCard } from "@/components/MarketCard";
import {
  BarChart3,
  Clock,
  Flame,
  Search,
  ArrowUpDown,
  Filter,
  RefreshCw,
  Tag as TagIcon,
} from "lucide-react";
import type { TradingMarket } from "@repo/types";

const API_URL = "http://localhost:3001";
const TRADING_TAGS = [
  "crypto",
  "finance",
  "economy",
  "business",
  "stocks",
  "macro",
];

interface Tag {
  slug: string;
  label: string;
}

export default function Dashboard() {
  const [selectedTags, setSelectedTags] = useState<string[]>(["crypto"]);
  const [sortBy, setSortBy] = useState("liq");
  const [order, setOrder] = useState("desc");

  // Fetch all available tags for discovery
  const { data: remoteTags } = useQuery<Tag[]>({
    queryKey: ["tags"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/tags`);
      if (!res.ok) return [];
      return res.json();
    },
  });

  const {
    data: markets,
    isLoading,
    refetch,
    isFetching,
  } = useQuery<TradingMarket[]>({
    queryKey: ["markets", selectedTags, sortBy, order],
    queryFn: async () => {
      const params = new URLSearchParams({
        tags: selectedTags.join(","),
        sortBy,
        order,
        limit: "40",
      });
      const res = await fetch(`${API_URL}/markets?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  // Combine default trading tags with remote tags, unique by slug
  const displayTags = Array.from(
    new Map<string, Tag>([
      ...TRADING_TAGS.map(
        (t) =>
          [t, { slug: t, label: t.charAt(0).toUpperCase() + t.slice(1) }] as [
            string,
            Tag,
          ],
      ),
      ...(remoteTags?.map((t) => [t.slug, t] as [string, Tag]) || []),
    ]).values(),
  ).slice(0, 25);

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
            <BarChart3 className="w-8 h-8" />
            Trading Desk
          </h1>
          <p className="text-muted-foreground">
            Polymarket Real-time Intelligence
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </header>

      {/* Filters Bar */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Tags Discovery */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <TagIcon className="w-3 h-3" />
                Discovery Tags
              </div>
              {selectedTags.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedTags([])}
                  className="text-[10px] text-primary hover:underline font-bold uppercase tracking-widest"
                >
                  Clear All
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {displayTags.map((tag) => (
                <button
                  key={tag.slug}
                  type="button"
                  onClick={() => toggleTag(tag.slug)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-all ${
                    selectedTags.includes(tag.slug)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted text-muted-foreground border-transparent hover:border-border"
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sorting Control */}
          <div className="space-y-3 lg:min-w-[320px]">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <ArrowUpDown className="w-3 h-3" />
              Optimization Priority
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-muted p-1 rounded-lg border border-border gap-1 flex-1">
                {[
                  { id: "liq", label: "Liq", icon: BarChart3 },
                  { id: "vol", label: "Vol", icon: Search },
                  { id: "date", label: "Exp", icon: Clock },
                  { id: "trending", label: "Hot", icon: Flame },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSortBy(opt.id)}
                    className={`flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-[10px] font-bold transition-all flex-1 ${
                      sortBy === opt.id
                        ? "bg-card text-primary shadow-sm ring-1 ring-border"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    <opt.icon className="w-3 h-3" />
                    {opt.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setOrder(order === "desc" ? "asc" : "desc")}
                className="p-2.5 bg-muted hover:bg-secondary rounded-lg border border-border transition-colors"
              >
                <ArrowUpDown
                  className={`w-4 h-4 transition-transform ${order === "asc" ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Showing {markets?.length || 0} markets
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="bg-muted rounded-xl h-64 animate-pulse border border-border"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {markets?.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        )}

        {markets?.length === 0 && !isLoading && (
          <div className="text-center py-32 bg-muted/20 rounded-3xl border border-dashed border-border">
            <Filter className="w-10 h-10 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground font-medium text-lg">
              No active markets found.
            </p>
            <p className="text-sm text-muted-foreground/60">
              Try selecting different categories or lowering filters.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
