import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useTheme } from "./ThemeProvider";
import { LoginModal } from "./auth/LoginModal";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "../hooks/use-toast";
import { Bell, User, Palette, Crown, Key, Trash2, LogOut } from "lucide-react";

export function Settings() {
  const { theme, setTheme } = useTheme();
  const { user, firebaseUser, logout, refreshUser } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: user?.emailNotifications ?? true,
    pushNotifications: false,
    apiKeyVisible: false,
    autoDownload: true,
    defaultFormat: "mp4",
    defaultQuality: "720p"
  });
  
  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    username: user?.username || "",
    profilePhoto: user?.profilePhoto || "",
  });
  
  const isLoggedIn = !!user;
  
  // Update form data when user changes
  React.useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName,
        username: user.username,
        profilePhoto: user.profilePhoto,
      });
      setSettings(prev => ({
        ...prev,
        emailNotifications: user.emailNotifications,
      }));
    }
  }, [user]);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveProfile = async () => {
    if (!user || !firebaseUser) return;
    
    try {
      setIsLoading(true);
      const token = await firebaseUser.getIdToken();
      
      const response = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          displayName: formData.displayName,
          username: formData.username,
          profilePhoto: formData.profilePhoto,
          emailNotifications: settings.emailNotifications,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update profile');
      }

      await refreshUser();
      toast({ title: 'Success', description: 'Profile updated successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateApiKey = async () => {
    if (!user || !firebaseUser) return;

    try {
      setIsLoading(true);
      const token = await firebaseUser.getIdToken();

      const response = await fetch('/api/auth/regenerate-api-key', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to regenerate API key');
      }

      const data = await response.json();
      await refreshUser();
      
      // Copy to clipboard
      navigator.clipboard.writeText(data.apiKey);
      toast({ 
        title: 'Success', 
        description: 'New API key generated and copied to clipboard' 
      });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || !firebaseUser) return;

    try {
      setIsLoading(true);
      const token = await firebaseUser.getIdToken();

      const response = await fetch('/api/auth/account', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete account');
      }

      toast({ title: 'Success', description: 'Account deleted successfully' });
      await logout();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const canRegenerateApiKey = () => {
    if (!user?.lastApiKeyRegeneration) return true;
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    return (Date.now() - user.lastApiKeyRegeneration) >= oneWeek;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and application settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Profile Settings</h3>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  placeholder="Your display name"
                  value={formData.displayName}
                  onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                  disabled={!isLoggedIn}
                  data-testid="input-display-name"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  disabled
                  value={isLoggedIn ? user.email : "Please log in"}
                  data-testid="input-email"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Contact support to change your email address
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Appearance</h3>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Theme</Label>
                <Select value={theme} onValueChange={(value: "light" | "dark") => setTheme(value)}>
                  <SelectTrigger data-testid="select-theme">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Notifications</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive updates on updates and other cool stuff
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                  data-testid="switch-email-notifications"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Push Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Browser notifications for completed downloads
                  </p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
                  data-testid="switch-push-notifications"
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">API Key</h3>
            <div className="space-y-4">
              <div>
                <Label>Your API Key</Label>
                <div className="flex gap-2">
                  <Input
                    type={settings.apiKeyVisible ? "text" : "password"}
                    value={isLoggedIn ? user.apiKey : "Please log in to view API key"}
                    readOnly
                    disabled={!isLoggedIn}
                    data-testid="input-api-key"
                  />
                  <Button
                    variant="outline"
                    onClick={() => handleSettingChange("apiKeyVisible", !settings.apiKeyVisible)}
                    data-testid="button-toggle-api-key"
                  >
                    {settings.apiKeyVisible ? "Hide" : "Show"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Use this key to authenticate with our API. don't share your API key!
                </p>
              </div>

              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleRegenerateApiKey}
                disabled={!isLoggedIn || isLoading || !canRegenerateApiKey()}
                data-testid="button-regenerate-key"
              >
                <Key className="w-4 h-4 mr-2" />
                Regenerate API Key
              </Button>
              
              {isLoggedIn && (
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <Label>Account Tier</Label>
                    <Badge variant={user.tier === 'premium' ? 'default' : 'secondary'}>
                      {user.tier === 'premium' ? (
                        <>
                          <Crown className="w-3 h-3 mr-1" />
                          Premium
                        </>
                      ) : (
                        'Free'
                      )}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {user.tier === 'premium'
                      ? 'Unlimited API requests'
                      : `${300 - user.requestsThisWeek} requests remaining this week`
                    }
                  </p>
                  {user.tier === 'free' && (
                    <Button variant="outline" className="w-full">
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade to Premium
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-destructive">Danger Zone</h3>
            <div className="space-y-4">
              <Separator />
              <div>
                <Label className="text-destructive">Delete Account</Label>
                <p className="text-xs text-muted-foreground mb-3">
                  Permanently delete your account and all associated data
                </p>
                {isLoggedIn ? (
                  <>
                    <Button 
                      variant="outline" 
                      className="w-full mb-2"
                      onClick={logout}
                      disabled={isLoading}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                    <Button 
                      onClick={handleSaveProfile}
                      disabled={isLoading}
                      className="w-full mb-2"
                    >
                      Save Changes
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full" data-testid="button-delete-account">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove all your data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={handleDeleteAccount}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Yes, delete my account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                ) : (
                  <Button 
                    onClick={() => setIsLoginModalOpen(true)} 
                    className="w-full"
                    data-testid="button-login"
                  >
                    Sign In to Access Account Settings
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          setIsLoginModalOpen(false);
          refreshUser();
        }}
      />
    </div>
  );
}
