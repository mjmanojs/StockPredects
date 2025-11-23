export interface Stock {
    symbol: string;
    name?: string;
    longName?: string;
    price?: number;
    currentPrice?: number;
    regularMarketPrice?: number;
    change?: number;
    regularMarketChangePercent?: number;
    last_updated?: string;
}

export interface Commodity {
    symbol: string;
    name: string;
    price: number;
    change: number;
}

export interface Prediction {
    trend: 'UP' | 'DOWN';
    predicted_price_30d: number;
    intraday_target: number;
    confidence: number;
}

export interface Sentiment {
    sentiment_label: 'Positive' | 'Negative' | 'Neutral';
    sentiment_score: number;
    headlines: string[];
}

export interface HistoryPoint {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}
