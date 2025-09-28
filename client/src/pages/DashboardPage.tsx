import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { BarChart, Activity, Users, Download } from "lucide-react";

export default function DashboardPage() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b border-border">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          
          <main className="flex-1 overflow-auto p-8">
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-semibold text-foreground mb-2">Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome to your API downloader dashboard. Monitor your usage and explore available services.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6" data-testid="card-total-requests">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <BarChart className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Requests</p>
                      <p className="text-2xl font-semibold">1,234</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6" data-testid="card-active-apis">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                      <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Active APIs</p>
                      <p className="text-2xl font-semibold">6</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6" data-testid="card-downloads">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                      <Download className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Downloads</p>
                      <p className="text-2xl font-semibold">856</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6" data-testid="card-success-rate">
                  <div className="flex items-center gap-4">
                    <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
                      <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Success Rate</p>
                      <p className="text-2xl font-semibold">99.2%</p>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Link href="/dashboard/apis" data-testid="link-browse-apis">
                      <Button variant="outline" className="w-full justify-start">
                        Browse Available APIs
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full justify-start" data-testid="button-view-docs">
                      View Documentation
                    </Button>
                    <Button variant="outline" className="w-full justify-start" data-testid="button-api-status">
                      Check API Status
                    </Button>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm">YouTube video downloaded</span>
                      <span className="text-xs text-muted-foreground">2 min ago</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm">TikTok API request</span>
                      <span className="text-xs text-muted-foreground">5 min ago</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm">Instagram media extracted</span>
                      <span className="text-xs text-muted-foreground">12 min ago</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}