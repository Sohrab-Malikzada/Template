import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, DollarSign, Package, Users, ShoppingCart, Calendar } from "lucide-react";

const yearlyData = {
  2024: {
    monthly: [
      { month: "Jan", sales: 45000, purchases: 32000, profit: 13000 },
      { month: "Feb", sales: 52000, purchases: 38000, profit: 14000 },
      { month: "Mar", sales: 48000, purchases: 35000, profit: 13000 },
      { month: "Apr", sales: 61000, purchases: 42000, profit: 19000 },
      { month: "May", sales: 55000, purchases: 40000, profit: 15000 },
      { month: "Jun", sales: 67000, purchases: 45000, profit: 22000 },
      { month: "Jul", sales: 72000, purchases: 48000, profit: 24000 },
      { month: "Aug", sales: 69000, purchases: 46000, profit: 23000 },
      { month: "Sep", sales: 64000, purchases: 44000, profit: 20000 },
      { month: "Oct", sales: 71000, purchases: 47000, profit: 24000 },
      { month: "Nov", sales: 76000, purchases: 50000, profit: 26000 },
      { month: "Dec", sales: 82000, purchases: 52000, profit: 30000 },
    ],
    stats: {
      totalRevenue: "$762,000",
      netProfit: "$243,000",
      productsSold: "3,847", 
      activeCustomers: "1,534",
      avgOrderValue: "$198"
    }
  },
  2023: {
    monthly: [
      { month: "Jan", sales: 38000, purchases: 28000, profit: 10000 },
      { month: "Feb", sales: 42000, purchases: 32000, profit: 10000 },
      { month: "Mar", sales: 39000, purchases: 30000, profit: 9000 },
      { month: "Apr", sales: 51000, purchases: 36000, profit: 15000 },
      { month: "May", sales: 47000, purchases: 34000, profit: 13000 },
      { month: "Jun", sales: 58000, purchases: 40000, profit: 18000 },
      { month: "Jul", sales: 62000, purchases: 42000, profit: 20000 },
      { month: "Aug", sales: 59000, purchases: 41000, profit: 18000 },
      { month: "Sep", sales: 54000, purchases: 38000, profit: 16000 },
      { month: "Oct", sales: 61000, purchases: 42000, profit: 19000 },
      { month: "Nov", sales: 66000, purchases: 44000, profit: 22000 },
      { month: "Dec", sales: 70000, purchases: 46000, profit: 24000 },
    ],
    stats: {
      totalRevenue: "$647,000",
      netProfit: "$194,000",
      productsSold: "3,241",
      activeCustomers: "1,289", 
      avgOrderValue: "$179"
    }
  }
};

const categoryData = [
  { name: "Electronics", value: 35, color: "hsl(var(--chart-1))" },
  { name: "Clothing", value: 25, color: "hsl(var(--chart-2))" },
  { name: "Home & Garden", value: 20, color: "hsl(var(--chart-3))" },
  { name: "Sports", value: 12, color: "hsl(var(--chart-4))" },
  { name: "Books", value: 8, color: "hsl(var(--chart-5))" },
];

const profitData = [
  { month: "Jan", profit: 13000 },
  { month: "Feb", profit: 14000 },
  { month: "Mar", profit: 13000 },
  { month: "Apr", profit: 19000 },
  { month: "May", profit: 15000 },
  { month: "Jun", profit: 22000 },
  { month: "Jul", profit: 24000 },
  { month: "Aug", profit: 23000 },
  { month: "Sep", profit: 20000 },
  { month: "Oct", profit: 24000 },
  { month: "Nov", profit: 26000 },
  { month: "Dec", profit: 30000 },
];

export default function Analytics() {
  const [selectedYear, setSelectedYear] = useState<"2024" | "2023">("2024");
  const currentData = yearlyData[selectedYear];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">Analytics & Reports</h1>
          <p className="text-muted-foreground">Comprehensive business insights and performance metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <Select value={selectedYear} onValueChange={(value) => setSelectedYear(value as "2024" | "2023")}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <StatsCard
          title="Total Revenue"
          value={currentData.stats.totalRevenue}
          icon={DollarSign}
          trend={{ value: selectedYear === "2024" ? 17.8 : 15.2, label: "from last year" }}
        />
        <StatsCard
          title="Net Profit"
          value={currentData.stats.netProfit}
          icon={TrendingUp}
          trend={{ value: selectedYear === "2024" ? 25.3 : 22.5, label: "from last year" }}
        />
        <StatsCard
          title="Products Sold"
          value={currentData.stats.productsSold}
          icon={Package}
          trend={{ value: selectedYear === "2024" ? 18.7 : 8.1, label: "this year" }}
        />
        <StatsCard
          title="Active Customers"
          value={currentData.stats.activeCustomers}
          icon={Users}
          trend={{ value: selectedYear === "2024" ? 19.0 : 12.3, label: "total" }}
        />
        <StatsCard
          title="Avg Order Value"
          value={currentData.stats.avgOrderValue}
          icon={ShoppingCart}
          trend={{ value: selectedYear === "2024" ? 10.6 : -2.4, label: "this year" }}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="gradient-card shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Monthly Performance - {selectedYear}
            </CardTitle>
            <CardDescription>Sales, purchases, and profit comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={currentData.monthly}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }} 
                />
                <Bar dataKey="sales" fill="hsl(var(--chart-1))" name="Sales" />
                <Bar dataKey="purchases" fill="hsl(var(--chart-2))" name="Purchases" />
                <Bar dataKey="profit" fill="hsl(var(--chart-3))" name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="gradient-card shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Sales by Category
            </CardTitle>
            <CardDescription>Product category distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 gradient-card shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Profit Trend - {selectedYear}
            </CardTitle>
            <CardDescription>Monthly profit analysis over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={currentData.monthly}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}