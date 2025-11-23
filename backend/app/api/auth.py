from fastapi import APIRouter, HTTPException, Depends
from app.models.auth import UserCreate, ForgotPasswordRequest, ResetPasswordRequest
from app.services.auth_service import create_user, generate_otp, verify_otp
from app.services.email_service import send_email
from firebase_admin import auth

router = APIRouter()

@router.post("/register")
async def register(user: UserCreate):
    try:
        user_record = await create_user(user)
        return {"message": "User created successfully", "uid": user_record.uid}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/forgot-password")
async def forgot_password(request: ForgotPasswordRequest):
    try:
        # Check if user exists
        auth.get_user_by_email(request.email)
        
        otp = await generate_otp(request.email)
        sent = send_email(request.email, "Password Reset OTP", f"Your OTP is: {otp}")
        
        if not sent:
            raise HTTPException(status_code=500, detail="Failed to send email")
            
        return {"message": "OTP sent to email"}
    except auth.UserNotFoundError:
        raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/reset-password")
async def reset_password(request: ResetPasswordRequest):
    is_valid = await verify_otp(request.email, request.otp)
    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
        
    try:
        user = auth.get_user_by_email(request.email)
        auth.update_user(user.uid, password=request.new_password)
        return {"message": "Password updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
