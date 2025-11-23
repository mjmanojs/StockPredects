from fastapi import APIRouter, HTTPException
from app.services.market_data import market_data_service

router = APIRouter()

@router.get("/")
async def get_commodities():
    # Gold and Silver symbols on Yahoo Finance
    commodities = [
        {"symbol": "GC=F", "name": "Gold"},
        {"symbol": "SI=F", "name": "Silver"},
        {"symbol": "CL=F", "name": "Crude Oil"},
    ]
    
    results = []
    for comm in commodities:
        try:
            info = await market_data_service.get_stock_info(comm["symbol"])
            results.append({
                "symbol": comm["symbol"],
                "name": comm["name"],
                "price": info.get("currentPrice") or info.get("regularMarketPrice"),
                "change": info.get("regularMarketChangePercent")
            })
        except Exception:
            continue
            
    return results
