import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.firebase import get_auth_client, get_firestore_db
from firebase_admin import auth, firestore

def seed_user():
    email = "manojsprivatemail@gmail.com"
    password = "manojs@421"
    full_name = "Manoj S"
    
    try:
        # Check if user exists
        try:
            user = auth.get_user_by_email(email)
            print(f"User {email} already exists with UID: {user.uid}")
        except auth.UserNotFoundError:
            # Create user
            user = auth.create_user(
                email=email,
                password=password,
                display_name=full_name
            )
            print(f"Created user {email} with UID: {user.uid}")
            
            # Add to Firestore
            db = get_firestore_db()
            db.collection("users").document(user.uid).set({
                "email": email,
                "full_name": full_name,
                "uid": user.uid,
                "created_at": firestore.SERVER_TIMESTAMP
            })
            print("Added user to Firestore")
            
    except Exception as e:
        print(f"Error seeding user: {e}")

if __name__ == "__main__":
    seed_user()
