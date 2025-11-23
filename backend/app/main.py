from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, stocks, commodities, news

app = FastAPI(title="Stock Predects API", version="0.1.0")

# CORS Configuration
origins = [
    "http://localhost:3000",  # Next.js frontend
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(stocks.router, prefix="/api/v1/stocks", tags=["stocks"])
app.include_router(commodities.router, prefix="/api/v1/commodities", tags=["commodities"])
app.include_router(news.router, prefix="/api/v1/news", tags=["news"])

@app.get("/")
async def root():
    return {"message": "Welcome to Stock Predects API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
