from fastapi import APIRouter, HTTPException, Query
from app.services.market_data import market_data_service
from typing import List, Dict, Any

router = APIRouter()

@router.get("/search", response_model=List[Dict[str, str]])
async def search_stocks(q: str = Query(..., min_length=1)):
    try:
        results = await market_data_service.search_stocks(q)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{symbol}", response_model=Dict[str, Any])
async def get_stock_info(symbol: str):
    try:
        info = await market_data_service.get_stock_info(symbol)
        return info
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Stock {symbol} not found or error fetching data: {str(e)}")

@router.get("/{symbol}/history", response_model=List[Dict[str, Any]])
async def get_stock_history(
    symbol: str, 
    period: str = Query("1mo", regex="^(1d|5d|1mo|3mo|6mo|1y|2y|5y|10y|ytd|max)$"),
    interval: str = Query("1d", regex="^(1m|2m|5m|15m|30m|60m|90m|1h|1d|5d|1wk|1mo|3mo)$")
):
    try:
        history = await market_data_service.get_historical_data(symbol, period, interval)
        return history
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{symbol}/prediction")
async def get_stock_prediction(symbol: str):
    from app.services.prediction import prediction_service
    try:
        prediction = await prediction_service.predict_price(symbol)
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{symbol}/sentiment")
async def get_stock_sentiment(symbol: str):
    from app.services.prediction import prediction_service
    try:
        sentiment = await prediction_service.analyze_sentiment(symbol)
        return sentiment
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
