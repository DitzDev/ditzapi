import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import LandingPage from "@/pages/LandingPage";
import DashboardPage from "@/pages/DashboardPage";
import TierUpgradePage from "@/pages/TierUpgradePage";
import ApiListPage from "@/pages/ApiListPage";
import ApiDetailPage from "@/pages/ApiDetailPage";
import AccountPage from "@/pages/AccountPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/dashboard/apis" component={ApiListPage} />
      <Route path="/dashboard/api/:id" component={ApiDetailPage} />
      <Route path="/dashboard/account" component={AccountPage} />
      <Route path="/dashboard/settings" component={SettingsPage} />
      <Route path="/dashboard/upgrade" component={TierUpgradePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <AuthProvider>
            <Toaster />
            <Router />
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
