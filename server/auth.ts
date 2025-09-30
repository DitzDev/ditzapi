import { Router, Request, Response } from 'express';
import { database, User } from './database';
import { emailService } from './email';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join } from 'path';

const router = Router();

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    let credential;
    
    if (process.env.FIREBASE_PROJECT_ID && 
        process.env.FIREBASE_CLIENT_EMAIL && 
        process.env.FIREBASE_PRIVATE_KEY) {
      credential = admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      });
      console.log('Firebase Admin initialized with environment variables');
    } 
    else {
      const serviceAccountPath = join(import.meta.dirname, '../serviceAccountKey.json');
      const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
      credential = admin.credential.cert(serviceAccount);
      console.log('Firebase Admin initialized with service account file');
    }

    admin.initializeApp({
      credential: credential,
    });
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    throw error; // Throw error karena Firebase wajib ada
  }
}

// Middleware to verify Firebase token
async function verifyFirebaseToken(req: Request, res: Response, next: any) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Find or create user in our database
    let user = database.findUserByFirebaseUID(decodedToken.uid);
    if (!user) {
      user = await database.createUser({
        uid: decodedToken.uid,
        email: decodedToken.email || '',
        displayName: decodedToken.name || decodedToken.email?.split('@')[0] || 'User',
        username: decodedToken.email?.split('@')[0] || 'user',
      });
    }

    (req as any).user = user;
    (req as any).firebaseUser = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Email + Password Registration
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, username, displayName } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ error: 'Email, password, and username are required' });
    }

    // Check if user already exists
    const existingUser = database.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const existingUsername = database.findUserByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    const user = await database.createUser({
      email,
      password,
      username,
      displayName: displayName || username,
    });

    // Remove sensitive data
    const { password: _, ...safeUser } = user;
    res.status(201).json({ user: safeUser });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Email + Password Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await database.validatePassword(email, password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Remove sensitive data
    const { password: _, ...safeUser } = user;
    res.json({ user: safeUser });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user
router.get('/me', verifyFirebaseToken, (req: Request, res: Response) => {
  const user = (req as any).user;
  const { password, ...safeUser } = user;
  res.json({ user: safeUser });
});

// Update user profile
router.patch('/profile', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { displayName, username, profilePhoto, emailNotifications } = req.body;

    // Check if username is taken (if changing)
    if (username && username !== user.username) {
      const existingUsername = database.findUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ error: 'Username is already taken' });
      }
    }

    const updates: Partial<User> = {};
    if (displayName !== undefined) updates.displayName = displayName;
    if (username !== undefined) updates.username = username;
    if (profilePhoto !== undefined) updates.profilePhoto = profilePhoto;
    if (emailNotifications !== undefined) updates.emailNotifications = emailNotifications;

    const updatedUser = await database.updateUser(user.id, updates);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password, ...safeUser } = updatedUser;
    res.json({ user: safeUser });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Request password reset
router.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = database.findUserByEmail(email);
    if (!user) {
      // Don't reveal if email exists or not
      return res.json({ message: 'If the email exists, a reset code has been sent' });
    }

    const otp = database.createOTP(email, 'password_reset');
    const emailSent = await emailService.sendOTPEmail(email, otp, 'password_reset');

    if (!emailSent) {
      return res.status(500).json({ error: 'Failed to send reset email' });
    }

    res.json({ message: 'If the email exists, a reset code has been sent' });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify OTP and reset password
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Email, OTP, and new password are required' });
    }

    const isValidOTP = database.verifyOTP(email, otp, 'password_reset');
    if (!isValidOTP) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    const user = database.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await database.updateUser(user.id, { password: newPassword });
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Generate new API key
router.post('/regenerate-api-key', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!database.canRegenerateApiKey(user.id)) {
      return res.status(429).json({ 
        error: 'API key can only be regenerated once per week',
        canRegenerateAt: user.lastApiKeyRegeneration ? user.lastApiKeyRegeneration + (7 * 24 * 60 * 60 * 1000) : Date.now()
      });
    }

    const newApiKey = await database.regenerateApiKey(user.id);
    if (!newApiKey) {
      return res.status(500).json({ error: 'Failed to regenerate API key' });
    }

    res.json({ apiKey: newApiKey });
  } catch (error) {
    console.error('API key regeneration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete account
router.delete('/account', verifyFirebaseToken, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    // Delete from Firebase if user has Firebase UID
    if (user.uid) {
      try {
        await admin.auth().deleteUser(user.uid);
      } catch (firebaseError) {
        console.error('Firebase user deletion error:', firebaseError);
        // Continue with local deletion even if Firebase fails
      }
    }

    // Delete from local database
    const deleted = database.deleteUser(user.id);
    if (!deleted) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Account deletion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get API usage stats
router.get('/usage', verifyFirebaseToken, (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const remaining = database.getUserRequestsRemaining(user.id);
    const weeklyLimit = user.tier === 'premium' ? -1 : 300; // -1 for unlimited
    
    res.json({
      tier: user.tier,
      requestsThisWeek: user.requestsThisWeek,
      requestsRemaining: remaining,
      weeklyLimit,
      resetAt: user.requestsResetAt,
    });
  } catch (error) {
    console.error('Usage stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;