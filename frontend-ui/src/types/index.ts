
export type Stat = {
  name: "Market Position" | "Sentiment Score" | "Key Strengths" | "Potential Threats";
  value: string;
};

export type Competitor = {
  id: string;
  name: string;
  logoUrl: string;
  marketPosition: number;
  stats: Stat[];
};

export type MentionVolume = {
    month: string;
    [key: string]: number | string;
}
