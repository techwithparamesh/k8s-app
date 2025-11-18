import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { NamespaceProvider } from "@/contexts/NamespaceContext";
import { NamespaceSelector } from "@/components/NamespaceSelector";
import Dashboard from "@/pages/Dashboard";
import Nodes from "@/pages/Nodes";
import Pods from "@/pages/Pods";
import Deployments from "@/pages/Deployments";
import Services from "@/pages/Services";
import Networking from "@/pages/Networking";
import Routes from "@/pages/Routes";
import Ingress from "@/pages/Ingress";
import StorageConfig from "@/pages/StorageConfig";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/nodes" component={Nodes} />
      <Route path="/pods" component={Pods} />
      <Route path="/deployments" component={Deployments} />
      <Route path="/services" component={Services} />
      <Route path="/networking" component={Networking} />
      <Route path="/networking/ingress" component={Ingress} />
      <Route path="/routes" component={Routes} />
      <Route path="/storage" component={StorageConfig} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <NamespaceProvider>
          <SidebarProvider style={style as React.CSSProperties}>
            <div className="flex h-screen w-full">
              <AppSidebar />
              <div className="flex flex-col flex-1 overflow-hidden">
                <header className="h-16 flex items-center px-6 border-b border-border bg-gradient-to-r from-background to-card/50 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
                  <SidebarTrigger data-testid="button-sidebar-toggle" />
                  <div className="ml-6">
                    <NamespaceSelector />
                  </div>
                  <div className="ml-auto flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Cluster Active</span>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-foreground">Kubernetes Platform</span>
                  </div>
                </header>
              <main className="flex-1 overflow-auto bg-gradient-to-br from-background via-background to-muted/20">
                <Router />
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </NamespaceProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
