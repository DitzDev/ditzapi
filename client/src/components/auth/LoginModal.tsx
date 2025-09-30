import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { signInWithGoogle, signInWithGithub, signInWithEmail, signUpWithEmail } from '../../lib/firebase';
import { Github, Mail } from 'lucide-react';
import { toast } from '../../hooks/use-toast';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    displayName: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      toast({ title: 'Success', description: 'Logged in with Google successfully' });
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to login with Google', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    try {
      setIsLoading(true);
      await signInWithGithub();
      toast({ title: 'Success', description: 'Logged in with GitHub successfully' });
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to login with GitHub', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    try {
      setIsLoading(true);
      if (!formData.email || !formData.password) {
        toast({ title: 'Error', description: 'Email and password are required', variant: 'destructive' });
        return;
      }
      await signInWithEmail(formData.email, formData.password);
      toast({ title: 'Success', description: 'Logged in successfully' });
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to login', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignup = async () => {
    try {
      setIsLoading(true);
      if (!formData.email || !formData.password || !formData.username) {
        toast({ title: 'Error', description: 'All fields are required for signup', variant: 'destructive' });
        return;
      }

      // Register with Firebase
      await signUpWithEmail(formData.email, formData.password);
      
      // Register with our backend
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          username: formData.username,
          displayName: formData.displayName || formData.username,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }

      toast({ title: 'Success', description: 'Account created successfully' });
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to create account', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign in to DitzAPI</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Social Login Buttons */}
          <div className="space-y-2">
            <Button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full"
              variant="outline"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            <Button
              onClick={handleGithubLogin}
              disabled={isLoading}
              className="w-full"
              variant="outline"
            >
              <Github className="w-4 h-4 mr-2" />
              Continue with GitHub
            </Button>
          </div>

          <Separator className="my-4" />

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                />
              </div>
              <Button onClick={handleEmailLogin} disabled={isLoading} className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Sign In with Email
              </Button>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="display-name">Display Name (Optional)</Label>
                <Input
                  id="display-name"
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  placeholder="Your display name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                />
              </div>
              <Button onClick={handleEmailSignup} disabled={isLoading} className="w-full">
                Create Account
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}