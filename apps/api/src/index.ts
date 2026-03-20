import { type GammaMarket, TradingMarketSchema } from "@repo/types";
import dotenv from "dotenv";
import express from "express";
import { z } from "zod";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Use Gamma API for market discovery
const GAMMA_API_URL = "https://gamma-api.polymarket.com/markets";

// Defined trading tags based on documentation analysis
const TRADING_TAGS = ["crypto", "finance", "economy", "business", "stocks", "macro"];

app.use(express.json());

/**
 * GET /markets
 * Fetches optimized trading markets.
 * Query Params:
 * - tag: specific tag (default: all trading tags)
 * - limit: number of results (default: 50)
 */
app.get("/markets", async (req, res) => {
	try {
		const tag = req.query.tag as string;
		const limit = Number.parseInt((req.query.limit as string) || "50", 10);

		const targetTags = tag ? [tag] : TRADING_TAGS;
		const allMarkets: GammaMarket[] = [];

		for (const t of targetTags) {
			const params = new URLSearchParams({
				active: "true",
				closed: "false",
				tag_slug: t,
				limit: "50",
				liquidity_num_min: "100",
			});

			const response = await fetch(`${GAMMA_API_URL}?${params.toString()}`);
			if (response.ok) {
				const data = (await response.json()) as GammaMarket[];
				allMarkets.push(...data);
			}
		}

		// Remove duplicates and sort
		const uniqueMarkets = Array.from(new Map(allMarkets.map((m) => [m.conditionId, m])).values());
		const sortedMarkets = uniqueMarkets
			.sort((a, b) => (b.liquidityNum || 0) - (a.liquidityNum || 0))
			.slice(0, limit);

		const validated = z.array(TradingMarketSchema).parse(sortedMarkets);
		res.json(validated);
	} catch (error) {
		console.error("Error fetching markets:", error);
		res.status(500).json({ error: "Failed to fetch markets" });
	}
});

/**
 * GET /trending
 * Specifically returns the top 20 hottest trading opportunities.
 */
app.get("/trending", async (_req, res) => {
	try {
		const allMarkets: GammaMarket[] = [];

		for (const t of TRADING_TAGS) {
			const params = new URLSearchParams({
				active: "true",
				closed: "false",
				tag_slug: t,
				limit: "20",
				liquidity_num_min: "500",
			});

			const response = await fetch(`${GAMMA_API_URL}?${params.toString()}`);
			if (response.ok) {
				const data = (await response.json()) as GammaMarket[];
				allMarkets.push(...data);
			}
		}

		const uniqueMarkets = Array.from(new Map(allMarkets.map((m) => [m.conditionId, m])).values());

		const trending = uniqueMarkets
			.sort((a, b) => {
				const scoreA = (a.liquidityNum || 0) + (a.volumeNum || 0) / 10;
				const scoreB = (b.liquidityNum || 0) + (b.volumeNum || 0) / 10;
				return scoreB - scoreA;
			})
			.slice(0, 20);

		const validated = z.array(TradingMarketSchema).parse(trending);
		res.json(validated);
	} catch (error) {
		console.error("Error fetching trending:", error);
		res.status(500).json({ error: "Failed to fetch trending markets" });
	}
});

app.listen(port, () => {
	console.log(`API listening on port ${port}`);
});
