import type { Express } from "express";
import { createServer, type Server } from "http";
import authRoutes from "./auth";
import { database } from "./database";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.use('/api/auth', authRoutes);

  // API key validation middleware for protected routes
  app.use('/api/download', (req, res, next) => {
    const apiKey = req.headers['x-api-key'] as string;
    
    if (!apiKey) {
      return res.status(401).json({ error: 'API key required' });
    }

    const user = database.findUserByApiKey(apiKey);
    if (!user) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    // Check rate limits
    const remaining = database.getUserRequestsRemaining(user.id);
    if (remaining <= 0) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded',
        resetAt: user.requestsResetAt 
      });
    }

    // Increment usage
    const success = database.incrementUserRequests(user.id);
    if (!success) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded',
        resetAt: user.requestsResetAt 
      });
    }

    // Add user and remaining requests to request object
    (req as any).user = user;
    (req as any).remainingRequests = remaining - 1;
    next();
  });

  // Protected API endpoint
  app.get('/api/download/:id', (req, res) => {
    const user = (req as any).user;
    const remaining = (req as any).remainingRequests;
    
    res.json({ 
      message: 'Download API endpoint',
      id: req.params.id,
      user: { id: user.id, tier: user.tier },
      remainingRequests: remaining,
      resetAt: user.requestsResetAt
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
