import firebase_admin
from firebase_admin import credentials, firestore, auth
from app.core.config import get_settings
import os

settings = get_settings()

def initialize_firebase():
    try:
        try:
            firebase_admin.get_app()
            return # App already initialized
        except ValueError:
            # App not initialized, proceed
            pass

        if os.path.exists(settings.FIREBASE_CREDENTIALS_PATH):
            cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
            firebase_admin.initialize_app(cred)
        else:
            print(f"Warning: Firebase credentials not found at {settings.FIREBASE_CREDENTIALS_PATH}")
            # Try default init (e.g. for Cloud Functions or if env var set)
            try:
                firebase_admin.initialize_app()
            except Exception:
                pass
    except Exception as e:
        print(f"Error initializing Firebase: {e}")

def get_firestore_db():
    initialize_firebase()
    return firestore.client()

def get_auth_client():
    initialize_firebase()
    return auth
