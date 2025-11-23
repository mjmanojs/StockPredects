import asyncio
import yfinance as yf
import random
import firebase_admin
from firebase_admin import credentials, firestore
import os
from datetime import datetime

# List of symbols to track
SYMBOLS = [
    "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS", 
    "GC=F", "SI=F", "^NSEI", "^BSESN"
]

async def fetch_and_update():
    FORCE_MOCK_MODE = True  # User requested local only mode
    db = None
    
    if not FORCE_MOCK_MODE:
        # Initialize Firebase directly
        try:
        try:
            firebase_admin.get_app()
        except ValueError:
            cred_path = "firebase-adminsdk.json"
            if os.path.exists(cred_path):
                cred = credentials.Certificate(cred_path)
                firebase_admin.initialize_app(cred)
            else:
                firebase_admin.initialize_app()
        db = firestore.client()
    except Exception as e:
        print(f"Firebase Init Failed (Running in Mock Mode): {e}")
        db = None

    print("Starting background worker...")
    
    while True:
        print(f"Fetching data at {datetime.now()}...")
        for symbol in SYMBOLS:
            try:
                # Try fetching from yfinance
                ticker = yf.Ticker(symbol)
                # fast_info is often faster than .info
                price = ticker.fast_info.last_price
                change = 0.0 # fast_info doesn't always have change, would need calculation
                
                # Fallback/Mock for demo stability if yfinance fails or returns None
                if price is None:
                    raise ValueError("No price data")
                    
            except Exception as e:
                # Mock data for demo purposes if fetch fails
                # Generate a random price movement
                base_price = 2500.0 if "RELIANCE" in symbol else 1500.0
                if "GC=F" in symbol: base_price = 2000.0
                if "SI=F" in symbol: base_price = 25.0
                
                price = base_price + random.uniform(-10, 10)
                change = random.uniform(-1.5, 1.5)
            
            # Update Firestore
            if db:
                try:
                    doc_ref = db.collection("stocks").document(symbol)
                    doc_ref.set({
                        "symbol": symbol,
                        "price": price,
                        "change": change,
                        "last_updated": datetime.now().isoformat()
                    }, merge=True)
                    # print(f"Updated {symbol}: {price:.2f}")
                except Exception as e:
                    print(f"Failed to update Firestore for {symbol}: {e}")
            else:
                print(f"[MOCK] Would update {symbol}: {price:.2f} (Change: {change:.2f}%)")

        # Wait for 5 seconds before next update
        await asyncio.sleep(5)

if __name__ == "__main__":
    # Run the async loop
    asyncio.run(fetch_and_update())
