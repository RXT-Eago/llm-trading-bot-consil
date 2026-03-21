import { z } from "zod";

/**
 * Gamma API raw market structure (partial)
 */
export const GammaMarketSchema = z.object({
	conditionId: z.string(),
	question: z.string(),
	outcomes: z.string().transform((val) => JSON.parse(val) as string[]),
	outcomePrices: z.string().transform((val) => {
		try {
			return JSON.parse(val).map(Number) as number[];
		} catch {
			return [] as number[];
		}
	}),
	clobTokenIds: z.string().transform((val) => JSON.parse(val) as string[]),
	liquidityNum: z.number().optional().default(0),
	volumeNum: z.number().optional().default(0),
	endDate: z.string().optional(),
	closed: z.boolean().optional().default(false),
	archived: z.boolean().optional().default(false),
});

/**
 * Optimized market data for LLM Trading Agent
 */
export const TradingMarketSchema = GammaMarketSchema.transform((m) => {
	const choices: Record<string, { p: number; t: string }> = {};
	m.outcomes.forEach((outcome, i) => {
		choices[outcome] = {
			p: m.outcomePrices?.[i] ?? 0,
			t: m.clobTokenIds?.[i] ?? "",
		};
	});

	return {
		id: m.conditionId,
		closed: m.closed,
		archived: m.archived,
		q: m.question,
		liq: Math.round(m.liquidityNum),
		vol: Math.round(m.volumeNum),
		ends: m.endDate?.split("T")[0] || "unknown",
		choices,
	};
});

export type GammaMarket = z.infer<typeof GammaMarketSchema>;
export type TradingMarket = z.infer<typeof TradingMarketSchema>;

export const MarketSchema = z
	.object({
		condition_id: z.string(),
		question: z.string(),
		description: z.string().optional(),
		active: z.boolean(),
		closed: z.boolean(),
		archived: z.boolean(),
		outcomes: z.array(z.string()).optional(),
		tokens: z
			.array(
				z
					.object({
						token_id: z.string(),
						outcome: z.string(),
						price: z.number().optional(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();

export type Market = z.infer<typeof MarketSchema>;
