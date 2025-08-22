
"use client";

import { PlusCircle, Calendar as CalendarIcon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard-header";
import { useEffect, useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { OrderCard } from "@/components/order-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, endOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";


export default function OrdersPage() {
  const [allOrdersState, setAllOrdersState] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  const [date, setDate] = useState(undefined);

  const updateOrders = () => {
    const storedOrders = localStorage.getItem("orders");
    if (storedOrders) {
      try {
        setAllOrdersState(JSON.parse(storedOrders));
      } catch (e) {
        console.error("Failed to parse orders from localStorage", e);
        setAllOrdersState([]);
      }
    } else {
      setAllOrdersState([]);
    }
  };

  useEffect(() => {
    updateOrders();
    
    const handleStorageChange = (e) => {
      if (e.key === 'orders') {
        updateOrders();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    const updatedOrders = allOrdersState.map(o =>
      o.id === orderId ? { ...o, status: newStatus } : o
    );
    setAllOrdersState(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    toast({
        title: "Order Status Updated",
        description: `Order #${orderId} is now ${newStatus}.`,
    });
  }
  
  const handleOrderDeleted = (orderId) => {
    setAllOrdersState(prevOrders => prevOrders.filter(order => order.id !== orderId));
  };


  const filteredOrders = useMemo(() => {
    return allOrdersState
      .filter(order => {
        if (statusFilter !== "all" && order.status !== statusFilter) {
          return false;
        }
        if (date?.from) {
            const orderDate = new Date(order.date);
            const fromDate = date.from;
            const toDate = date.to ? endOfDay(date.to) : fromDate;

            if (orderDate < fromDate || orderDate > toDate) {
                return false;
            }
        }
        return true;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [allOrdersState, statusFilter, date]);
  
  const handleClearFilters = () => {
    setStatusFilter("all");
    setDate(undefined);
  };
  


  return (
    <>
      <DashboardHeader title="Previous Order">
        <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                    <SelectItem value="Returned">Returned</SelectItem>
                </SelectContent>
            </Select>
            <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
            </Popover>
             <Button variant="ghost" onClick={handleClearFilters}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Clear Filters
            </Button>
            <Button size="sm" asChild>
              <Link href="/dashboard/orders/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Order
              </Link>
            </Button>
        </div>
      </DashboardHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} onStatusChange={handleStatusChange} onOrderDeleted={handleOrderDeleted} />
            ))
        ) : (
            <div className="col-span-full text-center text-muted-foreground py-10">
                <p>No orders found.</p>
                <p className="text-sm">Try adjusting your filters or adding a new order.</p>
            </div>
        )}
      </div>
    </>
  );
}
