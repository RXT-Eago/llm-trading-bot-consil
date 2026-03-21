import { type GammaMarket, TradingMarketSchema } from "@repo/types";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { z } from "zod";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const GAMMA_API_URL = "https://gamma-api.polymarket.com";
const DEFAULT_TRADING_TAGS = [
  "crypto",
  "finance",
  "economy",
  "business",
  "stocks",
  "macro",
];

app.use(cors());
app.use(express.json());

/**
 * GET /tags
 * Fetches popular tags for discovery
 */
app.get("/tags", async (_req, res) => {
  try {
    const response = await fetch(
      `${GAMMA_API_URL}/tags?limit=100&order=id&ascending=true`,
    );
    if (!response.ok) throw new Error("Failed to fetch tags");
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tags" });
  }
});

/**
 * GET /markets (Unified)
 * Params:
 * - tags: comma separated slugs
 * - sortBy: liq | vol | date | trending
 * - order: asc | desc
 * - limit: number
 * - minLiq: number
 */
app.get("/markets", async (req, res) => {
  try {
    const tagsParam = req.query.tags as string;
    const sortBy = (req.query.sortBy as string) || "liq";
    const order = (req.query.order as string) || "desc";
    const limit = Number.parseInt((req.query.limit as string) || "50", 10);
    const minLiq = Number.parseInt((req.query.minLiq as string) || "100", 10);

    const targetTags = tagsParam ? tagsParam.split(",") : DEFAULT_TRADING_TAGS;
    const allMarkets: GammaMarket[] = [];

    // Parallel fetch for tags
    await Promise.all(
      targetTags.map(async (tag) => {
        const params = new URLSearchParams({
          active: "true",
          closed: "false",
          tag_slug: tag.trim(),
          limit: "100",
          liquidity_num_min: minLiq.toString(),
        });
        const response = await fetch(
          `${GAMMA_API_URL}/markets?${params.toString()}`,
        );
        if (response.ok) {
          const data = (await response.json()) as GammaMarket[];
          allMarkets.push(...data);
        }
      }),
    );

    // Deduplicate
    const uniqueMarkets = Array.from(
      new Map(allMarkets.map((m) => [m.conditionId, m])).values(),
    );

    // Dynamic Sort
    const sorted = uniqueMarkets.sort((a, b) => {
      let valA = 0;
      let valB = 0;

      switch (sortBy) {
        case "vol":
          valA = a.volumeNum || 0;
          valB = b.volumeNum || 0;
          break;
        case "date":
          valA = new Date(a.endDate || 0).getTime();
          valB = new Date(b.endDate || 0).getTime();
          break;
        case "trending":
          valA = (a.liquidityNum || 0) + (a.volumeNum || 0) / 10;
          valB = (b.liquidityNum || 0) + (b.volumeNum || 0) / 10;
          break;
        case "liq":
        default:
          valA = a.liquidityNum || 0;
          valB = b.liquidityNum || 0;
      }

      return order === "asc" ? valA - valB : valB - valA;
    });

    const result = z.array(TradingMarketSchema).parse(sorted.slice(0, limit));
    res.json(result);
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Failed to fetch markets" });
  }
});

app.listen(port, () => {
  console.log(`Unified API running on port ${port}`);
});
