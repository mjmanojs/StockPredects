from fastapi import APIRouter, HTTPException
import yfinance as yf
from typing import List, Dict, Any

router = APIRouter()

@router.get("/", response_model=List[Dict[str, Any]])
async def get_market_news():
    try:
        # Fetch news for major Indian indices/stocks
        # Using a major ticker like ^NSEI usually gives broad market news
        ticker = yf.Ticker("^NSEI")
        news = ticker.news
        
        formatted_news = []
        formatted_news = []
        for item in news:
            content = item.get("content", {})
            # Try to get thumbnail from resolutions
            thumbnail = None
            if content.get("thumbnail") and content["thumbnail"].get("resolutions"):
                thumbnail = content["thumbnail"]["resolutions"][0].get("url")
            
            # Parse date to timestamp
            from datetime import datetime
            pub_date = content.get("pubDate")
            timestamp = 0
            if pub_date:
                try:
                    dt = datetime.strptime(pub_date, "%Y-%m-%dT%H:%M:%SZ")
                    timestamp = int(dt.timestamp())
                except:
                    pass

            formatted_news.append({
                "title": content.get("title"),
                "link": content.get("clickThroughUrl", {}).get("url"),
                "publisher": content.get("provider", {}).get("displayName"),
                "providerPublishTime": timestamp,
                "type": "STORY", # Default type
                "thumbnail": thumbnail
            })
            
        return formatted_news
    except Exception as e:
        print(f"News fetch error: {e}")
        # Return empty list or fallback instead of 500 to keep UI stable
        return []
