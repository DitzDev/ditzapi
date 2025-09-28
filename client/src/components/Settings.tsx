import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "./ThemeProvider";
import { Bell, User, Palette } from "lucide-react";

export function Settings() {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    apiKeyVisible: false,
    autoDownload: true,
    defaultFormat: "mp4",
    defaultQuality: "720p"
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
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
                  value="user@example.com"
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
                    value="sk-1234567890abcdef"
                    readOnly
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

              <Button variant="outline" className="w-full" data-testid="button-regenerate-key">
                Regenerate API Key
              </Button>
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
                <Button variant="destructive" data-testid="button-delete-account">
                  Delete Account
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
