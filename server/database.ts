import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

// Database interfaces
export interface User {
  id: string;
  uid?: string; // Firebase UID
  username: string;
  displayName: string;
  email: string;
  password?: string; // For email+password auth, hashed
  profilePhoto: string;
  tier: 'free' | 'premium';
  apiKey: string;
  apiKeyGeneratedAt: number;
  requestsThisWeek: number;
  requestsResetAt: number; // Timestamp for next reset
  emailNotifications: boolean;
  createdAt: number;
  lastApiKeyRegeneration?: number;
}

export interface OTPVerification {
  email: string;
  otp: string;
  expiresAt: number;
  type: 'password_reset' | 'email_verification';
  verified: boolean;
}

export interface Database {
  users: User[];
  otpVerifications: OTPVerification[];
}

class JSONDatabase {
  private dbPath: string;
  private db: Database = { users: [], otpVerifications: [] };

  constructor() {
    this.dbPath = path.join(import.meta.dirname, '..', 'database.json');
    this.loadDatabase();
  }

  private loadDatabase(): void {
    try {
      if (fs.existsSync(this.dbPath)) {
        const data = fs.readFileSync(this.dbPath, 'utf-8');
        this.db = JSON.parse(data);
      } else {
        this.db = { users: [], otpVerifications: [] };
        this.saveDatabase();
      }
    } catch (error) {
      console.error('Error loading database:', error);
      this.db = { users: [], otpVerifications: [] };
    }
  }

  private saveDatabase(): void {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(this.db, null, 2));
    } catch (error) {
      console.error('Error saving database:', error);
    }
  }

  // User management methods
  async createUser(userData: Partial<User>): Promise<User> {
    const now = Date.now();
    const user: User = {
      id: uuidv4(),
      username: userData.username || '',
      displayName: userData.displayName || userData.username || 'User',
      email: userData.email || '',
      profilePhoto: userData.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.displayName || userData.username || 'User')}&background=random`,
      tier: 'free',
      apiKey: this.generateApiKey(),
      apiKeyGeneratedAt: now,
      requestsThisWeek: 0,
      requestsResetAt: now + (7 * 24 * 60 * 60 * 1000), // Next week
      emailNotifications: true,
      createdAt: now,
      ...userData,
    };

    // Hash password if provided
    if (userData.password) {
      user.password = await bcrypt.hash(userData.password, 10);
    }

    this.db.users.push(user);
    this.saveDatabase();
    return user;
  }

  findUserById(id: string): User | undefined {
    return this.db.users.find(user => user.id === id);
  }

  findUserByEmail(email: string): User | undefined {
    return this.db.users.find(user => user.email === email);
  }

  findUserByUsername(username: string): User | undefined {
    return this.db.users.find(user => user.username === username);
  }

  findUserByFirebaseUID(uid: string): User | undefined {
    return this.db.users.find(user => user.uid === uid);
  }

  findUserByApiKey(apiKey: string): User | undefined {
    return this.db.users.find(user => user.apiKey === apiKey);
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const userIndex = this.db.users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;

    // Hash password if being updated
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    this.db.users[userIndex] = { ...this.db.users[userIndex], ...updates };
    this.saveDatabase();
    return this.db.users[userIndex];
  }

  deleteUser(id: string): boolean {
    const userIndex = this.db.users.findIndex(user => user.id === id);
    if (userIndex === -1) return false;

    this.db.users.splice(userIndex, 1);
    this.saveDatabase();
    return true;
  }

  async validatePassword(email: string, password: string): Promise<User | null> {
    const user = this.findUserByEmail(email);
    if (!user || !user.password) return null;

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  // API Key management
  private generateApiKey(): string {
    return 'dk_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
  }

  canRegenerateApiKey(userId: string): boolean {
    const user = this.findUserById(userId);
    if (!user) return false;

    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const lastRegeneration = user.lastApiKeyRegeneration || 0;
    return (Date.now() - lastRegeneration) >= oneWeek;
  }

  async regenerateApiKey(userId: string): Promise<string | null> {
    if (!this.canRegenerateApiKey(userId)) return null;

    const newApiKey = this.generateApiKey();
    const now = Date.now();
    
    const updatedUser = await this.updateUser(userId, {
      apiKey: newApiKey,
      apiKeyGeneratedAt: now,
      lastApiKeyRegeneration: now,
    });

    return updatedUser ? newApiKey : null;
  }

  // Request tracking
  incrementUserRequests(userId: string): boolean {
    const user = this.findUserById(userId);
    if (!user) return false;

    // Check if we need to reset weekly counter
    if (Date.now() > user.requestsResetAt) {
      user.requestsThisWeek = 0;
      user.requestsResetAt = Date.now() + (7 * 24 * 60 * 60 * 1000);
    }

    // Check limits
    const weeklyLimit = user.tier === 'premium' ? Infinity : 300;
    if (user.requestsThisWeek >= weeklyLimit) return false;

    user.requestsThisWeek++;
    this.saveDatabase();
    return true;
  }

  getUserRequestsRemaining(userId: string): number {
    const user = this.findUserById(userId);
    if (!user) return 0;

    // Check if we need to reset weekly counter
    if (Date.now() > user.requestsResetAt) {
      user.requestsThisWeek = 0;
      user.requestsResetAt = Date.now() + (7 * 24 * 60 * 60 * 1000);
      this.saveDatabase();
    }

    const weeklyLimit = user.tier === 'premium' ? Infinity : 300;
    return Math.max(0, weeklyLimit - user.requestsThisWeek);
  }

  // OTP management
  createOTP(email: string, type: 'password_reset' | 'email_verification'): string {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + (10 * 60 * 1000); // 10 minutes

    // Remove any existing OTPs for this email and type
    this.db.otpVerifications = this.db.otpVerifications.filter(
      v => !(v.email === email && v.type === type)
    );

    this.db.otpVerifications.push({
      email,
      otp,
      expiresAt,
      type,
      verified: false,
    });

    this.saveDatabase();
    return otp;
  }

  verifyOTP(email: string, otp: string, type: 'password_reset' | 'email_verification'): boolean {
    const verification = this.db.otpVerifications.find(
      v => v.email === email && v.otp === otp && v.type === type && !v.verified
    );

    if (!verification || Date.now() > verification.expiresAt) {
      return false;
    }

    verification.verified = true;
    this.saveDatabase();
    return true;
  }

  cleanupExpiredOTPs(): void {
    const now = Date.now();
    this.db.otpVerifications = this.db.otpVerifications.filter(
      v => v.expiresAt > now
    );
    this.saveDatabase();
  }
}

export const database = new JSONDatabase();

// Cleanup expired OTPs every hour
setInterval(() => {
  database.cleanupExpiredOTPs();
}, 60 * 60 * 1000);