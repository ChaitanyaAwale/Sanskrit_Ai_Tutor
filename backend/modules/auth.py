"""
Authentication module for SanskritaAI
Simple user authentication for prototype
"""

import json
import os
import base64
import hashlib
import hmac
import secrets
import time
from datetime import datetime

# Try to import bcrypt, fallback to simple hashing if not available
try:
    import bcrypt
    BCRYPT_AVAILABLE = True
except ImportError:
    BCRYPT_AVAILABLE = False
    print("bcrypt not installed. Using simple password storage (NOT secure for production!)")

_DEVELOPMENT_TOKEN_SECRET = secrets.token_bytes(32)
_REVOKED_TOKEN_DIGESTS = set()

class Authenticator:
    def __init__(self, users_file='data/users.json'):
        self.users_file = users_file
        self.users = self.load_users()
    
    def load_users(self):
        """Load users from JSON file with better error handling"""
        try:
            # Check if file exists
            if os.path.exists(self.users_file):
                # Check if file is empty
                if os.path.getsize(self.users_file) == 0:
                    print("Users file is empty. Creating default users.")
                    return self.create_default_users()
                
                # Try to load JSON
                with open(self.users_file, 'r', encoding='utf-8') as f:
                    content = f.read().strip()
                    if content:
                        users = json.loads(content)
                        print("Loaded user records from file")
                        return users
                    else:
                        print("Users file is empty. Creating default users.")
                        return self.create_default_users()
            else:
                print("Users file not found. Creating default users.")
                return self.create_default_users()
                
        except json.JSONDecodeError as e:
            print("Error parsing users JSON")
            print("Creating default users...")
            return self.create_default_users()
        except Exception as e:
            print("Unexpected error loading users")
            return self.create_default_users()
    
    def create_default_users(self):
        """Create default users"""
        default_users = {
            "admin": {
                "password": self.hash_password("admin123"),
                "role": "admin",
                "created_at": datetime.now().isoformat(),
                "level": "advanced",
                "completed": 10
            },
            "demo": {
                "password": self.hash_password("demo123"),
                "role": "student",
                "created_at": datetime.now().isoformat(),
                "level": "beginner",
                "completed": 5
            }
        }
        
        # Save default users
        self.save_users(default_users)
        print("✅ Created default users")
        return default_users
    
    def save_users(self, users=None):
        """Save users to JSON file"""
        if users is None:
            users = self.users
        
        try:
            os.makedirs(os.path.dirname(self.users_file), exist_ok=True)
            with open(self.users_file, 'w', encoding='utf-8') as f:
                json.dump(users, f, indent=2, ensure_ascii=False)
            print(f"✅ Users saved to {self.users_file}")
        except Exception as e:
            print(f"❌ Error saving users: {e}")
    
    def hash_password(self, password):
        """Hash a password for storing"""
        if BCRYPT_AVAILABLE:
            return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        else:
            # Simple hashing for demo (NOT secure!)
            return f"hashed_{password}"
    
    def verify_password(self, stored_password, provided_password):
        """Verify a stored password against one provided by user"""
        # Check backward compatibility for simple hashes
        if stored_password == f"hashed_{provided_password}":
            return True
            
        if BCRYPT_AVAILABLE:
            try:
                return bcrypt.checkpw(
                    provided_password.encode('utf-8'),
                    stored_password.encode('utf-8')
                )
            except Exception as e:
                print(f"❌ Error verifying password: {e}")
                return False
        return False
    
    def login(self, username, password):
        """Authenticate a user"""
        if username in self.users:
            if self.verify_password(self.users[username]['password'], password):
                return {
                    'username': username,
                    'role': self.users[username].get('role', 'student'),
                    'level': self.users[username].get('level', 'beginner'),
                    'completed': self.users[username].get('completed', 0)
                }
        return None

    def create_access_token(self, username):
        secret = self._token_secret()
        payload = f"{username}:{int(time.time()) + 86400}".encode("utf-8")
        encoded = base64.urlsafe_b64encode(payload).decode("ascii").rstrip("=")
        signature = hmac.new(secret, encoded.encode("ascii"), hashlib.sha256).hexdigest()
        return f"{encoded}.{signature}"

    def verify_access_token(self, token):
        if not isinstance(token, str) or "." not in token or self.token_is_revoked(token):
            return None
        encoded, signature = token.split(".", 1)
        try:
            expected = hmac.new(self._token_secret(), encoded.encode("ascii"), hashlib.sha256).hexdigest()
            if not hmac.compare_digest(signature, expected):
                return None
            padding = "=" * (-len(encoded) % 4)
            username, expiry = base64.urlsafe_b64decode(f"{encoded}{padding}").decode("utf-8").rsplit(":", 1)
            if int(expiry) < int(time.time()) or username not in self.users:
                return None
            return username
        except (RuntimeError, ValueError, UnicodeError, base64.binascii.Error):
            return None

    def revoke_access_token(self, token):
        if isinstance(token, str) and token:
            _REVOKED_TOKEN_DIGESTS.add(hashlib.sha256(token.encode("utf-8")).digest())

    @staticmethod
    def token_is_revoked(token):
        if not isinstance(token, str):
            return True
        return hashlib.sha256(token.encode("utf-8")).digest() in _REVOKED_TOKEN_DIGESTS

    @staticmethod
    def _token_secret():
        configured_secret = os.getenv("AUTH_TOKEN_SECRET")
        if configured_secret:
            return configured_secret.encode("utf-8")
        if os.getenv("APP_ENV", "development").lower() == "production":
            raise RuntimeError("AUTH_TOKEN_SECRET must be configured in production")
        return _DEVELOPMENT_TOKEN_SECRET
    
    def signup(self, username, password, role="student"):
        """Create a new user account"""
        if username in self.users:
            return False
        
        self.users[username] = {
            "password": self.hash_password(password),
            "role": role,
            "created_at": datetime.now().isoformat(),
            "level": "beginner",
            "completed": 0
        }
        
        self.save_users()
        return True
