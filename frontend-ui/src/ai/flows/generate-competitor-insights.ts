
'use server';
/**
 * @fileOverview A flow for generating AI-powered insights about a competitor.
 *
 * - generateCompetitorInsights - A function that takes a competitor name and returns key insights.
 * - GenerateCompetitorInsightsInput - The input type for the function.
 * - GenerateCompetitorInsightsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCompetitorInsightsInputSchema = z.object({
  competitor: z
    .string()
    .describe('The name of the competitor to analyze.'),
});
export type GenerateCompetitorInsightsInput = z.infer<typeof GenerateCompetitorInsightsInputSchema>;

const InsightSchema = z.object({
    title: z.string().describe("The title of the insight, e.g., 'Market Trends', 'Sentiment Analysis', 'Feature Comparison'."),
    summary: z.string().describe("A one or two sentence summary of the insight."),
});

const GenerateCompetitorInsightsOutputSchema = z.object({
  insights: z.array(InsightSchema).describe('A list of insights about the competitor.'),
});
export type GenerateCompetitorInsightsOutput = z.infer<typeof GenerateCompetitorInsightsOutputSchema>;

export async function generateCompetitorInsights(input: GenerateCompetitorInsightsInput): Promise<GenerateCompetitorInsightsOutput> {
  return generateCompetitorInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCompetitorInsightsPrompt',
  input: {schema: GenerateCompetitorInsightsInputSchema},
  output: {schema: GenerateCompetitorInsightsOutputSchema},
  system: `You are an expert market analyst. Generate three distinct insights for the given competitor. The insights should be titled 'Market Trends', 'Sentiment Analysis', and 'Feature Comparison'.`,
  prompt: `Generate insights for the following competitor: {{{competitor}}}`,
});

const generateCompetitorInsightsFlow = ai.defineFlow(
  {
    name: 'generateCompetitorInsightsFlow',
    inputSchema: GenerateCompetitorInsightsInputSchema,
    outputSchema: GenerateCompetitorInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
