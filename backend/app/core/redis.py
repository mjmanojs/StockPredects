import redis.asyncio as redis
from app.core.config import get_settings

settings = get_settings()

async def get_redis_pool():
    return redis.from_url(
        settings.REDIS_URL, 
        encoding="utf-8", 
        decode_responses=True
    )
