import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/dashboard/Layout";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { CustomerAuthProvider, useCustomerAuth } from "./hooks/useCustomerAuth";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Sales from "./pages/Sales";
import Debts from "./pages/Debts";
import Purchases from "./pages/Purchases";
import Employees from "./pages/Employees";
import Analytics from "./pages/Analytics";
import Payroll from "./pages/Payroll";
import Returns from "./pages/Returns";
import UserManagement from "./pages/UserManagement";
import Login from "./pages/Login";
import CustomerLogin from "./pages/CustomerLogin";
import CustomerDashboard from "./pages/CustomerDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { isAuthenticated } = useAuth();
  const { isAuthenticated: isCustomerAuthenticated } = useCustomerAuth();

  // Customer portal routing
  if (isCustomerAuthenticated) {
    return <CustomerDashboard />;
  }

  // Admin portal routing
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/customer" element={<CustomerLogin />} />
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/debts" element={<Debts />} />
        <Route path="/purchases" element={<Purchases />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/payroll" element={<Payroll />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/customer" element={<CustomerLogin />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CustomerAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </CustomerAuthProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
