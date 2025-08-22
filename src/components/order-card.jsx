
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash, Printer, Download, Clock, Truck, CheckCircle, Ban, CornerUpLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useRouter } from "next/navigation";

const statusVariantMap = {
  "Delivered": "bg-green-100 text-green-800 border-green-200",
  "Cancelled": "bg-red-100 text-red-800 border-red-200",
  "Returned": "bg-orange-100 text-orange-800 border-orange-200",
  "Pending": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Processing": "bg-blue-100 text-blue-800 border-blue-200",
  "Out for Delivery": "bg-indigo-100 text-indigo-800 border-indigo-200",
};

const refundStatusVariantMap = {
    "Pending": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Processing": "bg-blue-100 text-blue-800 border-blue-200",
    "Completed": "bg-green-100 text-green-800 border-green-200",
    "Rejected": "bg-red-100 text-red-800 border-red-200",
};


export function OrderCard({ order, onStatusChange, onOrderDeleted }) {
  const { toast } = useToast();
  const router = useRouter();
  const statusLabel = order.status === "Delivered" ? "Completed" : order.status === "Cancelled" ? "Canceled" : order.status;

  const handleStatusChange = (e, newStatus) => {
    e.stopPropagation();
    if (onStatusChange) {
        onStatusChange(order.id, newStatus);
    }
  }


  const handleDelete = () => {
    // Delete order
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const updatedOrders = allOrders.filter(o => o.id !== order.id);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    // Delete associated notification
    const allNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const updatedNotifications = allNotifications.filter(n => n.orderId !== order.id);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
    
    // Dispatch storage event to trigger UI updates across components
    window.dispatchEvent(new CustomEvent('storage-update', { detail: { key: 'orders' } }));
    window.dispatchEvent(new CustomEvent('storage-update', { detail: { key: 'notifications' } }));

    if (onOrderDeleted) {
        onOrderDeleted(order.id);
    }

    toast({
      title: "Order Deleted",
      description: `Order #${order.id} has been deleted.`,
    });
  }

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('');
  }
  
  const handleCardClick = (e) => {
    if (e.target.closest('[data-radix-dropdown-menu-trigger]') || e.target.closest('.alert-dialog-footer') || e.target.closest('[data-radix-dropdown-menu-content]')) {
        e.stopPropagation();
        return;
    }
    router.push(`/dashboard/orders/${order.id}`);
  };


  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleCardClick}>
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-start">
             <div className="block group">
                <h3 className="font-semibold text-base group-hover:text-primary">Order #{order.id}</h3>
                <p className="text-xs text-muted-foreground">{new Date(order.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}, {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
             </div>
            <AlertDialog>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuItem asChild>
                            <Link href={`/dashboard/orders/${order.id}`}><Eye className="mr-2 h-4 w-4"/>View Order</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Change Status</DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem onClick={(e) => handleStatusChange(e, 'Pending')}><Clock className="mr-2 h-4 w-4" />Pending</DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => handleStatusChange(e, 'Processing')}><Clock className="mr-2 h-4 w-4" />Processing</DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => handleStatusChange(e, 'Out for Delivery')}><Truck className="mr-2 h-4 w-4" />Out for Delivery</DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => handleStatusChange(e, 'Delivered')}><CheckCircle className="mr-2 h-4 w-4" />Delivered</DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={`/dashboard/orders/${order.id}/invoice`}><Printer className="mr-2 h-4 w-4" />Print Invoice</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                         <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}><Trash className="mr-2 h-4 w-4"/>Delete</DropdownMenuItem>
                        </AlertDialogTrigger>
                    </DropdownMenuContent>
                </DropdownMenu>
                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the order and its notification.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="alert-dialog-footer">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Yes, delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
        <div className="flex justify-between items-center">
            <Avatar className="h-8 w-8">
                <AvatarFallback>{getInitials(order.customer.name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-end gap-1">
              <Badge variant="outline" className={cn("capitalize text-xs font-semibold", statusVariantMap[order.status])}>
                  {statusLabel}
              </Badge>
              {order.status === 'Returned' && order.refundStatus && (
                <Badge variant="outline" className={cn("capitalize text-xs font-semibold", refundStatusVariantMap[order.refundStatus])}>
                  Refund: {order.refundStatus}
                </Badge>
              )}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
