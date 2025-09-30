import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { useAuth } from '../contexts/AuthContext';
import { Check, Crown, Zap, Shield, Clock } from 'lucide-react';

export default function TierUpgradePage() {
  const { user } = useAuth();

  const freeTierFeatures = [
    '300 API requests per week',
    'Basic API endpoints',
    'Email support',
    'Standard rate limits',
  ];

  const premiumTierFeatures = [
    'Unlimited API requests',
    'Priority API endpoints',
    'Premium support (24/7)',
    'Advanced rate limits',
    'Early access to new features',
    'Custom integrations',
    'Detailed analytics',
    'API request history',
  ];

  const handleUpgrade = () => {
    // This would typically integrate with a payment processor like Stripe
    // For now, we'll show a placeholder
    alert('Payment integration would be implemented here with Stripe or similar payment processor');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-muted-foreground">
          Unlock the full potential of DitzAPI with our premium features
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Free Tier */}
        <Card className={`relative ${user.tier === 'free' ? 'ring-2 ring-primary' : ''}`}>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Zap className="w-6 h-6 mr-2" />
              <CardTitle className="text-2xl">Free</CardTitle>
              {user.tier === 'free' && (
                <Badge className="ml-2">Current Plan</Badge>
              )}
            </div>
            <div className="text-3xl font-bold">$0</div>
            <CardDescription>Perfect for getting started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              {freeTierFeatures.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full" 
              disabled={user.tier === 'free'}
            >
              {user.tier === 'free' ? 'Current Plan' : 'Downgrade to Free'}
            </Button>
          </CardFooter>
        </Card>

        {/* Premium Tier */}
        <Card className={`relative ${user.tier === 'premium' ? 'ring-2 ring-primary' : 'border-primary shadow-lg'}`}>
          {user.tier !== 'premium' && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1">
                Most Popular
              </Badge>
            </div>
          )}
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Crown className="w-6 h-6 mr-2 text-yellow-500" />
              <CardTitle className="text-2xl">Premium</CardTitle>
              {user.tier === 'premium' && (
                <Badge className="ml-2">Current Plan</Badge>
              )}
            </div>
            <div className="text-3xl font-bold">$29</div>
            <CardDescription>per month • Unlimited access</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              {premiumTierFeatures.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" 
              onClick={handleUpgrade}
              disabled={user.tier === 'premium'}
            >
              {user.tier === 'premium' ? (
                <>
                  <Crown className="w-4 h-4 mr-2" />
                  Current Plan
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Premium
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Separator className="my-12" />

      {/* Current Usage Stats */}
      <div className="bg-card rounded-lg p-6 mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Your Current Usage</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Requests This Week</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.requestsThisWeek}</div>
              <p className="text-xs text-muted-foreground">
                {user.tier === 'premium' ? 'Unlimited' : `out of 300`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Remaining Requests</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {user.tier === 'premium' ? '∞' : Math.max(0, 300 - user.requestsThisWeek)}
              </div>
              <p className="text-xs text-muted-foreground">
                Resets {new Date(user.requestsResetAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Tier</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{user.tier}</div>
              <p className="text-xs text-muted-foreground">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="text-left max-w-3xl mx-auto space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Can I change my plan anytime?</h3>
            <p className="text-muted-foreground">
              Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected 
              immediately, and billing will be prorated accordingly.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">What happens if I exceed my free limit?</h3>
            <p className="text-muted-foreground">
              If you exceed your weekly limit on the free plan, your API requests will be 
              temporarily suspended until the next reset or until you upgrade to Premium.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Is there a refund policy?</h3>
            <p className="text-muted-foreground">
              We offer a 30-day money-back guarantee for all Premium subscriptions. 
              Contact support if you're not satisfied with your purchase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}