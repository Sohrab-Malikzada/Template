import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LogOut, ShoppingBag, DollarSign, Clock, CheckCircle } from "lucide-react";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { mockSales } from "@/data/mockData";

export default function CustomerDashboard() {
  const { currentCustomer, logout } = useCustomerAuth();
  
  const customerPurchases = useMemo(() => {
    return mockSales.filter(sale => sale.customer === currentCustomer?.name);
  }, [currentCustomer]);

  const totalPurchased = customerPurchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);
  const totalPaid = customerPurchases.reduce((sum, purchase) => sum + purchase.amountPaid, 0);
  const totalPending = customerPurchases.reduce((sum, purchase) => sum + purchase.pendingAmount, 0);
  const completedPurchases = customerPurchases.filter(purchase => purchase.pendingAmount === 0).length;

  const getPaymentStatus = (sale: any) => {
    if (sale.pendingAmount === 0) {
      return { label: "Paid", variant: "secondary" as const };
    } else if (sale.paymentType === 'installment') {
      return { label: "Installment", variant: "outline" as const };
    } else {
      return { label: "Pending", variant: "destructive" as const };
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Welcome, {currentCustomer?.name}</h1>
              <p className="text-sm text-muted-foreground">{currentCustomer?.email}</p>
            </div>
          </div>
          <Button onClick={logout} variant="outline" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6 max-w-7xl">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">؋{totalPurchased.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {customerPurchases.length} total orders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Amount Paid</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">؋{totalPaid.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {completedPurchases} completed payments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">؋{totalPending.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {customerPurchases.length - completedPurchases} pending payments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payment Progress</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalPurchased > 0 ? Math.round((totalPaid / totalPurchased) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Payment completion rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Purchase History */}
        <Card>
          <CardHeader>
            <CardTitle>Purchase History</CardTitle>
            <CardDescription>
              Your complete purchase and payment history
            </CardDescription>
          </CardHeader>
          <CardContent>
            {customerPurchases.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No purchases found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sale ID</TableHead>
                  <TableHead>Items</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Amount Paid</TableHead>
                    <TableHead>Pending Amount</TableHead>
                    <TableHead>Payment Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerPurchases.map((purchase) => {
                    const status = getPaymentStatus(purchase);
                    return (
                      <TableRow key={purchase.id}>
                        <TableCell className="font-medium">{purchase.id}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {purchase.items.map((item, index) => (
                              <div key={index} className="text-sm">
                                <span className="font-medium">{item.productName}</span>
                                <span className="text-muted-foreground ml-2">×{item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>؋{purchase.totalAmount.toLocaleString()}</TableCell>
                        <TableCell className="text-green-600">؋{purchase.amountPaid.toLocaleString()}</TableCell>
                        <TableCell className="text-orange-600">
                          {purchase.pendingAmount > 0 ? `؋${purchase.pendingAmount.toLocaleString()}` : '-'}
                        </TableCell>
                        <TableCell className="capitalize">{purchase.paymentType}</TableCell>
                        <TableCell>{new Date(purchase.saleDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Customer Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="text-base">{currentCustomer?.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-base">{currentCustomer?.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p className="text-base">{currentCustomer?.phone || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Address</p>
                <p className="text-base">{currentCustomer?.address || 'Not provided'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}