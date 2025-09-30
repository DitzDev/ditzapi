import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from '../../hooks/use-toast';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResetPasswordModal({ isOpen, onClose }: ResetPasswordModalProps) {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRequestReset = async () => {
    try {
      setIsLoading(true);
      if (!formData.email) {
        toast({ title: 'Error', description: 'Email is required', variant: 'destructive' });
        return;
      }

      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send reset email');
      }

      toast({ title: 'Success', description: 'Reset code sent to your email' });
      setStep('otp');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setIsLoading(true);
      if (!formData.otp || !formData.newPassword || !formData.confirmPassword) {
        toast({ title: 'Error', description: 'All fields are required', variant: 'destructive' });
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
        return;
      }

      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
          newPassword: formData.newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to reset password');
      }

      toast({ title: 'Success', description: 'Password reset successfully' });
      onClose();
      setStep('email');
      setFormData({ email: '', otp: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setStep('email');
    setFormData({ email: '', otp: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {step === 'email' ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email Address</Label>
                <Input
                  id="reset-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
              <Button onClick={handleRequestReset} disabled={isLoading} className="w-full">
                Send Reset Code
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  value={formData.otp}
                  onChange={(e) => handleInputChange('otp', e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                />
                <p className="text-sm text-muted-foreground">
                  Check your email for the verification code
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                />
              </div>
              <Button onClick={handleResetPassword} disabled={isLoading} className="w-full">
                Reset Password
              </Button>
              <Button 
                onClick={() => setStep('email')} 
                disabled={isLoading} 
                variant="outline" 
                className="w-full"
              >
                Back to Email
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}