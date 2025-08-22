
"use client";

import { useEffect, useState, useMemo } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Download, TrendingUp, TrendingDown, Package, DollarSign, CheckCircle, AlertCircle, RefreshCw, FileDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Image from "next/image";
import { allOrders } from "@/lib/data";

const refundStatusVariantMap = {
    "Pending": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Processing": "bg-blue-100 text-blue-800 border-blue-200",
    "Completed": "bg-green-100 text-green-800 border-green-200",
    "Rejected": "bg-red-100 text-red-800 border-red-200",
};

export default function ReturnedOrdersPage() {
  const [allReturnedOrders, setAllReturnedOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const updateOrders = () => {
       try {
        const storedOrders = localStorage.getItem("orders");
        const orders = storedOrders ? JSON.parse(storedOrders) : allOrders;
        const returned = orders.filter(order => order.status === 'Returned').map(o => ({
            ...o,
            refundStatus: o.refundStatus || "Pending",
            refundMethod: o.refundMethod || (o.paymentMethod !== "Cash on Delivery" ? o.paymentMethod : "UPI"),
        }));
        setAllReturnedOrders(returned);
        setFilteredOrders(returned);
      } catch (e) {
        console.error("Failed to parse orders from localStorage", e);
        setAllReturnedOrders([]);
        setFilteredOrders([]);
      }
  }

  useEffect(() => {
    updateOrders();
    window.addEventListener('storage', updateOrders);
    return () => {
        window.removeEventListener('storage', updateOrders);
    }
  }, []);
  
  useEffect(() => {
    const results = allReturnedOrders.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(results);
  }, [searchTerm, allReturnedOrders]);

  const handleRefundStatusChange = (orderId, newStatus) => {
    const allOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const updatedOrders = allOrders.map(o => o.id === orderId ? { ...o, refundStatus: newStatus } : o);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    window.dispatchEvent(new Event('storage'));
    
    toast({
        title: "Refund Status Updated",
        description: `Order #${orderId} refund status set to ${newStatus}.`
    });
  };
  
   const analytics = useMemo(() => {
    const totalReturned = allReturnedOrders.length;
    const totalRefundedAmount = allReturnedOrders
        .filter(o => o.refundStatus === 'Completed')
        .reduce((sum, o) => sum + o.total, 0);

    const productCounts = allReturnedOrders
        .flatMap(o => Array.isArray(o.items) ? o.items : [])
        .reduce((acc, item) => {
            acc[item.name] = (acc[item.name] || 0) + item.quantity;
            return acc;
        }, {});

    const topReturnedProduct = Object.entries(productCounts).sort(([,a],[,b]) => b-a)[0]?.[0] || 'N/A';
    
    const totalOrdersCount = JSON.parse(localStorage.getItem("orders") || "[]").length;
    const returnRate = totalOrdersCount > 0 ? (totalReturned / totalOrdersCount) * 100 : 0;

    return { totalReturned, totalRefundedAmount, topReturnedProduct, returnRate };
  }, [allReturnedOrders]);
  
  const handleExport = (format) => {
      toast({
          title: "Exporting Data",
          description: `Your returned orders data is being exported as a ${format.toUpperCase()} file.`,
      });
      // In a real application, this would trigger a file download.
  }

  return (
    <>
      <DashboardHeader title="Returned Orders" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalReturned}</div>
                  <p className="text-xs text-muted-foreground">Total orders returned</p>
              </CardContent>
          </Card>
          <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Refunded</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">${analytics.totalRefundedAmount.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">From completed refunds</p>
              </CardContent>
          </Card>
          <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Top Returned Product</CardTitle>
                  <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold truncate">{analytics.topReturnedProduct}</div>
                  <p className="text-xs text-muted-foreground">Most frequently returned item</p>
              </CardContent>
          </Card>
           <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Return Rate</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">{analytics.returnRate.toFixed(2)}%</div>
                  <p className="text-xs text-muted-foreground">Of all orders are returned</p>
              </CardContent>
          </Card>
      </div>
       <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>All Returned Orders</CardTitle>
              <CardDescription>
                Review and manage all returned orders and their refund status.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                 <Input 
                    type="search" 
                    placeholder="Search orders..." 
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
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Return Reason</TableHead>
                <TableHead>Refund Method</TableHead>
                <TableHead>Refund Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                        <TableCell>
                            <div className="font-medium text-primary cursor-pointer hover:underline" onClick={() => router.push(`/dashboard/orders/${order.id}`)}>#{order.id}</div>
                            <div className="text-xs text-muted-foreground">{format(new Date(order.date), "PPP")}</div>
                        </TableCell>
                        <TableCell>
                            <div>{order.customer.name}</div>
                            <div className="text-xs text-muted-foreground">{order.customer.address}</div>
                        </TableCell>
                        <TableCell>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="link" className="p-0 h-auto text-primary">
                                {Array.isArray(order.items) ? `${order.items.length} item(s)` : 'View Items'}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                               <div className="space-y-2">
                                  <h4 className="font-medium leading-none">Product Details</h4>
                                  <div className="grid gap-2">
                                    {Array.isArray(order.items) ? order.items.map((item, index) => (
                                      <div key={index} className="grid grid-cols-[25px_1fr_auto] items-start gap-x-2">
                                        <span className="font-bold text-sm">{item.quantity}x</span>
                                        <span className="text-sm">{item.name}</span>
                                        <span className="text-sm text-right">${item.price.toFixed(2)}</span>
                                      </div>
                                    )) : <p>No items found.</p>}
                                  </div>
                               </div>
                            </PopoverContent>
                          </Popover>
                        </TableCell>
                        <TableCell>
                            <p className="max-w-[200px] truncate" title={order.returnReason}>{order.returnReason || 'N/A'}</p>
                        </TableCell>
                         <TableCell>
                            <Select value={order.refundMethod} disabled>
                                <SelectTrigger className="w-[120px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Card">Card</SelectItem>
                                    <SelectItem value="UPI">UPI</SelectItem>
                                </SelectContent>
                            </Select>
                        </TableCell>
                        <TableCell>
                            <Select value={order.refundStatus} onValueChange={(newStatus) => handleRefundStatusChange(order.id, newStatus)}>
                                <SelectTrigger className={cn("w-[120px] border-0 focus:ring-0", refundStatusVariantMap[order.refundStatus])}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Processing">Processing</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                    <SelectItem value="Rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </TableCell>
                        <TableCell>
                            <div className="flex gap-2">
                                {order.refundStatus === "Pending" && (
                                    <>
                                        <Button size="sm" variant="outline" onClick={() => handleRefundStatusChange(order.id, 'Completed')}>Approve</Button>
                                        <Button size="sm" variant="destructive" onClick={() => handleRefundStatusChange(order.id, 'Rejected')}>Reject</Button>
                                    </>
                                )}
                                {order.refundStatus === "Processing" && (
                                     <Button size="sm" variant="outline" onClick={() => handleRefundStatusChange(order.id, 'Completed')}>Mark as Completed</Button>
                                )}
                                {(order.refundStatus === "Completed" || order.refundStatus === "Rejected") && (
                                    <p className="text-xs text-muted-foreground">Action taken</p>
                                )}
                            </div>
                        </TableCell>
                    </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                    No returned orders found.
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
