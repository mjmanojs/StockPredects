import random
import string
from app.core.redis import get_redis_pool
from app.core.firebase import get_auth_client, get_firestore_db
from app.models.auth import UserCreate
from firebase_admin import auth

async def generate_otp(email: str):
    otp = ''.join(random.choices(string.digits, k=6))
    redis = await get_redis_pool()
    await redis.setex(f"otp:{email}", 300, otp) # 5 minutes expiry
    return otp

async def verify_otp(email: str, otp: str):
    redis = await get_redis_pool()
    stored_otp = await redis.get(f"otp:{email}")
    if stored_otp == otp:
        await redis.delete(f"otp:{email}")
        return True
    return False

async def create_user(user: UserCreate):
    try:
        # Create in Firebase Auth
        user_record = auth.create_user(
            email=user.email,
            password=user.password,
            display_name=user.full_name
        )
        
        # Create in Firestore
        db = get_firestore_db()
        db.collection("users").document(user_record.uid).set({
            "email": user.email,
            "full_name": user.full_name,
            "uid": user_record.uid,
            "created_at": firestore.SERVER_TIMESTAMP
        })
        return user_record
    except Exception as e:
        raise e
