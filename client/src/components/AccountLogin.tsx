import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Github, Mail } from "lucide-react";
import { FaGoogle } from "react-icons/fa";

export function AccountLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(isLogin ? "Login" : "Register", formData);
    // TODO: Implement authentication
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`${provider} login clicked`);
    // TODO: Implement social authentication
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="text-muted-foreground">
          {isLogin 
            ? "Sign in to access your API dashboard and manage your account."
            : "Create a new account to start using our API services."
          }
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <Card className="p-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleSocialLogin("Google")}
                data-testid="button-google-login"
              >
                <FaGoogle className="h-4 w-4 mr-2" />
                Continue with Google
              </Button>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleSocialLogin("GitHub")}
                data-testid="button-github-login"
              >
                <Github className="h-4 w-4 mr-2" />
                Continue with GitHub
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  data-testid="input-email"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  data-testid="input-password"
                  required
                />
              </div>

              {!isLogin && (
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    data-testid="input-confirm-password"
                    required
                  />
                </div>
              )}

              <Button type="submit" className="w-full" data-testid="button-submit">
                {isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm"
                data-testid="button-toggle-mode"
              >
                {isLogin 
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"
                }
              </Button>
            </div>

            {isLogin && (
              <div className="text-center">
                <Button variant="ghost" className="text-sm" data-testid="button-forgot-password">
                  Forgot your password?
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}