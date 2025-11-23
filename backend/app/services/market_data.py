import yfinance as yf
import pandas as pd
import json
from app.core.redis import get_redis_pool
from typing import List, Dict, Any

class MarketDataService:
    async def get_stock_info(self, symbol: str) -> Dict[str, Any]:
        try:
            redis = await get_redis_pool()
            cache_key = f"stock_info:{symbol}"
            cached_data = await redis.get(cache_key)
            if cached_data:
                return json.loads(cached_data)
        except Exception as e:
            print(f"Redis error: {e}")
            redis = None
        
        # Fetch from yfinance
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            
            if redis:
                try:
                    await redis.setex(cache_key, 3600, json.dumps(info))
                except Exception:
                    pass
            return info
        except Exception as e:
            print(f"YFinance error for {symbol}: {e}")
            # Return mock data if yfinance fails (for demo purposes)
            return {
                "symbol": symbol,
                "longName": f"{symbol} (Mock)",
                "currentPrice": 1500.0,
                "regularMarketPrice": 1500.0,
                "regularMarketChangePercent": 1.5
            }

    async def get_historical_data(self, symbol: str, period: str = "1mo", interval: str = "1d") -> List[Dict[str, Any]]:
        try:
            redis = await get_redis_pool()
            cache_key = f"stock_history:{symbol}:{period}:{interval}"
            cached_data = await redis.get(cache_key)
            if cached_data:
                return json.loads(cached_data)
        except Exception:
            redis = None
        
        try:
            ticker = yf.Ticker(symbol)
            history = ticker.history(period=period, interval=interval)
            
            data = []
            for index, row in history.iterrows():
                data.append({
                    "date": index.isoformat(),
                    "open": row["Open"],
                    "high": row["High"],
                    "low": row["Low"],
                    "close": row["Close"],
                    "volume": row["Volume"]
                })
                
            if redis:
                try:
                    await redis.setex(cache_key, 900, json.dumps(data))
                except Exception:
                    pass
            return data
        except Exception:
            # Mock history
            return []

    async def search_stocks(self, query: str) -> List[Dict[str, Any]]:
        # Basic search implementation
        popular_stocks = [
            {"symbol": "RELIANCE.NS", "name": "Reliance Industries"},
            {"symbol": "TCS.NS", "name": "Tata Consultancy Services"},
            {"symbol": "HDFCBANK.NS", "name": "HDFC Bank"},
            {"symbol": "INFY.NS", "name": "Infosys"},
            {"symbol": "ICICIBANK.NS", "name": "ICICI Bank"},
            {"symbol": "SBIN.NS", "name": "State Bank of India"},
            {"symbol": "BHARTIARTL.NS", "name": "Bharti Airtel"},
            {"symbol": "ITC.NS", "name": "ITC Limited"},
            {"symbol": "KOTAKBANK.NS", "name": "Kotak Mahindra Bank"},
            {"symbol": "LICI.NS", "name": "Life Insurance Corporation"},
            {"symbol": "TATAMOTORS.NS", "name": "Tata Motors"},
            {"symbol": "MARUTI.NS", "name": "Maruti Suzuki"},
            {"symbol": "SUNPHARMA.NS", "name": "Sun Pharmaceutical"},
            {"symbol": "AXISBANK.NS", "name": "Axis Bank"},
            {"symbol": "TITAN.NS", "name": "Titan Company"},
            {"symbol": "BAJFINANCE.NS", "name": "Bajaj Finance"},
            {"symbol": "ULTRACEMCO.NS", "name": "UltraTech Cement"},
            {"symbol": "ASIANPAINT.NS", "name": "Asian Paints"},
            {"symbol": "WIPRO.NS", "name": "Wipro"},
            {"symbol": "HCLTECH.NS", "name": "HCL Technologies"},
            {"symbol": "^NSEI", "name": "NIFTY 50"},
            {"symbol": "^BSESN", "name": "SENSEX"},
            {"symbol": "GC=F", "name": "Gold"},
            {"symbol": "SI=F", "name": "Silver"},
        ]
        
        query = query.lower()
        results = [
            s for s in popular_stocks 
            if query in s["symbol"].lower() or query in s["name"].lower()
        ]

        if not results:
            return []

        # Fetch real-time data for these symbols
        symbols = [s["symbol"] for s in results]
        try:
            # Batch fetch using yfinance
            tickers = yf.Tickers(" ".join(symbols))
            
            enriched_results = []
            for stock in results:
                try:
                    ticker = tickers.tickers[stock["symbol"]]
                    # Fast info access
                    info = ticker.fast_info
                    
                    price = info.last_price
                    prev_close = info.previous_close
                    change = price - prev_close
                    change_percent = (change / prev_close) * 100 if prev_close else 0

                    enriched_results.append({
                        "symbol": stock["symbol"],
                        "shortname": stock["name"],
                        "longname": stock["name"],
                        "exchange": "NSE" if ".NS" in stock["symbol"] else "N/A",
                        "quoteType": "EQUITY",
                        "regularMarketPrice": price,
                        "regularMarketChange": change,
                        "regularMarketChangePercent": change_percent
                    })
                except Exception as e:
                    print(f"Error fetching {stock['symbol']}: {e}")
                    # Fallback to basic info if fetch fails
                    enriched_results.append({
                        "symbol": stock["symbol"],
                        "shortname": stock["name"],
                        "longname": stock["name"],
                        "exchange": "NSE",
                        "quoteType": "EQUITY",
                        "regularMarketPrice": 0.0,
                        "regularMarketChange": 0.0,
                        "regularMarketChangePercent": 0.0
                    })
            
            return enriched_results

        except Exception as e:
            print(f"Batch fetch error: {e}")
            return results

market_data_service = MarketDataService()
