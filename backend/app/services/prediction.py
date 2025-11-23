import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from textblob import TextBlob
from app.services.market_data import market_data_service
from datetime import datetime, timedelta

class PredictionService:
    async def predict_price(self, symbol: str):
        # 1. Fetch historical data (1 year)
        data = await market_data_service.get_historical_data(symbol, period="1y", interval="1d")
        if not data:
            return None
            
        df = pd.DataFrame(data)
        df['date'] = pd.to_datetime(df['date'])
        df['days'] = (df['date'] - df['date'].min()).dt.days
        
        # 2. Simple Linear Regression for Long Term Trend
        X = df[['days']].values
        y = df['close'].values
        
        model = LinearRegression()
        model.fit(X, y)
        
        future_days = np.array([[df['days'].max() + i] for i in range(1, 31)]) # Predict next 30 days
        predictions = model.predict(future_days)
        
        # 3. Intraday "Algorithm" (Mock logic based on recent volatility)
        last_close = df['close'].iloc[-1]
        volatility = df['close'].std()
        intraday_target = last_close + (volatility * 0.1) # Simple mock target
        
        return {
            "current_price": last_close,
            "predicted_price_30d": predictions[-1],
            "trend": "UP" if predictions[-1] > last_close else "DOWN",
            "intraday_target": intraday_target,
            "confidence": 0.75 # Mock confidence
        }

    async def analyze_sentiment(self, symbol: str):
        # Mock news data (In real app, fetch from NewsAPI)
        news_headlines = [
            f"{symbol} reports strong earnings growth",
            f"Market outlook positive for {symbol} sector",
            f"Analysts upgrade {symbol} target price"
        ]
        
        sentiment_score = 0
        for headline in news_headlines:
            blob = TextBlob(headline)
            sentiment_score += blob.sentiment.polarity
            
        avg_sentiment = sentiment_score / len(news_headlines)
        
        return {
            "sentiment_score": avg_sentiment, # -1 to 1
            "sentiment_label": "Positive" if avg_sentiment > 0 else "Negative" if avg_sentiment < 0 else "Neutral",
            "headlines": news_headlines
        }

prediction_service = PredictionService()
