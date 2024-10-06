// DashboardOverview.tsx
import { getTotalProducts } from "@/actions/get-total-product";
import { getTotalRevenue } from "@/actions/get-total-revenue";
import { getTotalSales } from "@/actions/get-total-sales";
import { getOrderStatusTotalRevenue } from "@/actions/getgrap-by-order-status";
import { getGraphTotalRevenue } from "@/actions/getgrap-total-revenue";
import { getOrderTotalRevenueByCategory } from "@/actions/getgrap-total-revenue-by-cat";
import { getOrderPaymentStatusTotalRevenue } from "@/actions/getgrap-total-revenue-by-payment-status";
import { Heading } from "@/components/heading";
import Navbar from "@/components/navbar";
import Overview from "@/components/overview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatter } from "@/lib/utils";
import { DollarSign, ShoppingBasket, Store as StoreIcon } from "lucide-react";

interface DashboardOverviewProps {
  params: { storeId: string };
}

const DashboardOverview = async ({ params }: DashboardOverviewProps) => {
  // Fetch data from Firestore or backend APIs
  const totalRevenue = await getTotalRevenue(params.storeId);
  const totalSales = await getTotalSales(params.storeId);
  const totalProducts = await getTotalProducts(params.storeId);
  const monthlyGraphRevenue = await getGraphTotalRevenue(params.storeId);

  const paymentStatus = await getOrderPaymentStatusTotalRevenue(params.storeId);

  const revenueByCat = await getOrderTotalRevenueByCategory(params.storeId);

  const revenueByOrderStatus = await getOrderStatusTotalRevenue(params.storeId);

  console.log(revenueByOrderStatus);

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="Dashboard" description="Overview your store" />
        <Separator />
        <div className="grid gap-4 grid-cols-4">
          {/* Total Revenue Card */}
          <Card className="col-span-2">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-md font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <div className="text-2xl font-bold">
                {formatter.format(totalRevenue)}
              </div>
              <Button>Withdraw</Button>
            </CardContent>
          </Card>

          {/* Total Sales Card */}
          <Card className="col-span-1">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-md font-medium">Sales</CardTitle>
              <ShoppingBasket className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+ {totalSales}</div>
            </CardContent>
          </Card>

          {/* Total Products Card */}
          <Card className="col-span-1">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-md font-medium">Products</CardTitle>
              <StoreIcon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+ {totalProducts}</div>
            </CardContent>
          </Card>

          {/* Monthly Revenue Graph */}
          <Card className="col-span-3">
            <CardHeader className="flex items-center flex-row justify-between">
              <CardTitle className="text-md font-medium">
                Revenue By Month
              </CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Overview data={monthlyGraphRevenue} title="Revenue by Month" />
            </CardContent>
          </Card>

          {/* Placeholder for other cards */}
          <Card className="col-span-1">
            <CardHeader className="flex items-center flex-row justify-between">
              <CardTitle className="text-md font-medium">
                Revenue Payment Status
              </CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="w-full h-full">
              <Overview data={paymentStatus} title="Revenue by Order Status" />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-md font-medium">
                Revenue By Category
              </CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Overview data={revenueByCat} title="Revenue by Category" />
            </CardContent>
          </Card>
          <Card className="col-span-1">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-md font-medium">
                Revenue By Order Status
              </CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Overview
                data={revenueByOrderStatus}
                title="Revenue by Order Status"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
