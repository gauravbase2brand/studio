
"use client";

import { useEffect, useState, useMemo } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Download, TrendingUp, TrendingDown, Package, DollarSign, CheckCircle, AlertCircle, RefreshCw, FileDown, Search, Ban } from "lucide-react";


const statusVariantMap = {
  "Delivered": "bg-green-100 text-green-800 border-green-200",
  "Cancelled": "bg-red-100 text-red-800 border-red-200",
  "Returned": "bg-orange-100 text-orange-800 border-orange-200",
  "Pending": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Processing": "bg-blue-100 text-blue-800 border-blue-200",
  "Out for Delivery": "bg-indigo-100 text-indigo-800 border-indigo-200",
};

const paymentStatusVariantMap = {
    "Paid": "text-green-600",
    "Pending": "text-yellow-600",
    "Failed": "text-red-600",
    "Refunded": "text-blue-600",
    "Not Applicable": "text-gray-500",
}


export default function CancelledOrdersPage() {
  const [allCancelledOrders, setAllCancelledOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const storedOrders = localStorage.getItem("orders");
    if (storedOrders) {
      try {
        const allOrders = JSON.parse(storedOrders);
        const filtered = allOrders.filter(order => order.status === 'Cancelled');
        const sorted = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        setAllCancelledOrders(sorted);
        setFilteredOrders(sorted);
      } catch (e) {
        console.error("Failed to parse orders from localStorage", e);
        setAllCancelledOrders([]);
        setFilteredOrders([]);
      }
    }
  }, []);
  
  useEffect(() => {
    const results = allCancelledOrders.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(results);
  }, [searchTerm, allCancelledOrders]);

  const getPaymentStatus = (order) => {
    if (order.paymentMethod === 'Cash on Delivery') return 'Not Applicable';
    if (order.status === 'Cancelled') {
        const refundStatus = order.refundStatus || 'Pending';
        if (refundStatus === 'Completed') return 'Refunded';
        return `Ref. ${refundStatus}`;
    }
    return 'Paid';
  }

  const analytics = useMemo(() => {
    const totalCancelled = allCancelledOrders.length;
    const refundedAmount = allCancelledOrders
        .filter(o => o.paymentMethod !== 'Cash on Delivery')
        .reduce((sum, o) => sum + o.total, 0);
    
    const reasonCounts = allCancelledOrders.reduce((acc, order) => {
        const reason = order.cancellationReason || 'Unknown';
        acc[reason] = (acc[reason] || 0) + 1;
        return acc;
    }, {});
    
    const topReason = Object.entries(reasonCounts).sort(([,a],[,b]) => b-a)[0]?.[0] || 'N/A';

    const totalOrdersCount = JSON.parse(localStorage.getItem("orders") || "[]").length;
    const cancellationRate = totalOrdersCount > 0 ? (totalCancelled / totalOrdersCount) * 100 : 0;

    return { totalCancelled, refundedAmount, topReason, cancellationRate };
  }, [allCancelledOrders]);
  
  const handleExport = (format) => {
      toast({
          title: "Exporting Data",
          description: `Your cancelled orders data is being exported as a ${format.toUpperCase()} file.`,
      });
      // In a real application, this would trigger a file download.
  }

  return (
    <>
      <DashboardHeader title="Cancelled Orders" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Cancelled</CardTitle>
                  <Ban className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalCancelled}</div>
                  <p className="text-xs text-muted-foreground">Total orders marked as cancelled</p>
              </CardContent>
          </Card>
          <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Refunded Amount</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">${analytics.refundedAmount.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">For prepaid cancelled orders</p>
              </CardContent>
          </Card>
          <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Top Cancellation Reason</CardTitle>
                  <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold truncate">{analytics.topReason}</div>
                  <p className="text-xs text-muted-foreground">Most frequent reason for cancellation</p>
              </CardContent>
          </Card>
           <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cancellation Rate</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">{analytics.cancellationRate.toFixed(2)}%</div>
                  <p className="text-xs text-muted-foreground">Of all orders are cancelled</p>
              </CardContent>
          </Card>
      </div>
      <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle>All Cancelled Orders</CardTitle>
                    <CardDescription>
                        View and manage all canceled orders.
                    </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            type="search" 
                            placeholder="Search by Order ID or Customer..." 
                            className="pl-8 sm:w-[300px]" 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Refund Status</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead className="text-right">Total Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                    const paymentStatus = getPaymentStatus(order);
                    return (
                        <TableRow key={order.id} className="cursor-pointer" onClick={() => router.push(`/dashboard/orders/${order.id}`)}>
                            <TableCell className="font-medium text-primary">#{order.id}</TableCell>
                            <TableCell>{order.customer.name}</TableCell>
                            <TableCell className="max-w-[200px] truncate" title={order.cancellationReason}>{order.cancellationReason || "No reason specified"}</TableCell>
                            <TableCell>{order.paymentMethod}</TableCell>
                             <TableCell>
                                <span className={cn("font-semibold", paymentStatusVariantMap[paymentStatus])}>
                                    {paymentStatus}
                                </span>
                            </TableCell>
                            <TableCell>{format(new Date(order.date), "PPP")}</TableCell>
                            <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                        </TableRow>
                    )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                    No cancelled orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
