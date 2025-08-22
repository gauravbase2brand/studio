
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, CheckCircle, Circle, Truck, Utensils, ShoppingBag, Box, UserCheck, Phone, CreditCard, UserPlus, FileText, Send, UserCog, PlusCircle, Minus, Plus, MoreHorizontal, Edit, Trash, Ban, CornerUpLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter, useParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";


const statusMap = {
  "Pending": "Pending",
  "Processing": "Confirmed",
  "Preparing": "Preparing",
  "Out for Delivery": "Ready for Pickup",
  "Delivered": "Delivered",
  "Cancelled": "Cancelled",
  "Returned": "Returned"
};

const OrderStatusIndicator = ({ status, icon: Icon, current, completed, isFinalState, finalState }) => {
  
  let iconToShow;
  if(isFinalState && finalState === 'Cancelled') {
    iconToShow = <Ban className="h-7 w-7" />;
  } else if (isFinalState && finalState === 'Returned') {
    iconToShow = <CornerUpLeft className="h-7 w-7" />;
  }
  else if (completed) {
    iconToShow = <CheckCircle className="h-7 w-7" />;
  } else {
    iconToShow = <Icon className="h-7 w-7" />;
  }

  return (
    <div className="relative z-10 flex flex-col items-center text-center w-24">
      <div className={cn(
          "relative flex h-12 w-12 items-center justify-center rounded-full",
          isFinalState ? "bg-destructive text-destructive-foreground" :
          completed ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
      )}>
        {iconToShow}
      </div>
      <p className={`mt-2 text-xs font-medium ${current || completed ? 'text-foreground' : 'text-muted-foreground'}`}>
        {isFinalState ? finalState : status}
      </p>
    </div>
  );
};

const cancellationReasons = [
    { id: "reason1", label: "Customer request" },
    { id: "reason2", label: "Item out of stock" },
    { id: "reason3", label: "Payment issue" },
    { id: "reason4", label: "Delivery address unavailable" },
    { id: "reason5", label: "Restaurant closed" },
];

const returnReasons = [
    { id: "return1", label: "Customer dissatisfaction" },
    { id: "return2", label: "Wrong item delivered" },
    { id: "return3", label: "Damaged item" },
    { id: "return4", label: "Late delivery" },
];


export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [order, setOrder] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [note, setNote] = useState('');
  const [dishes, setDishes] = useState([]);
  const [isAddItemsDialogOpen, setIsAddItemsDialogOpen] = useState(false);
  const [isEditItemDialogOpen, setIsEditItemDialogOpen] = useState(false);
  const [itemQuantities, setItemQuantities] = useState({});
  const [editingItem, setEditingItem] = useState(null);
  const [editingQuantity, setEditingQuantity] = useState(1);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [otherReturnReason, setOtherReturnReason] = useState("");


  
  useEffect(() => {
    const id = params.id;
    if (!id) return;

    try {
        const storedOrders = localStorage.getItem("orders");
        const orders = storedOrders ? JSON.parse(storedOrders) : [];
        setAllOrders(orders);
        const currentOrder = orders.find((o) => o.id === id);
        if(currentOrder) {
          setOrder(currentOrder);
          setSelectedDriver(currentOrder.driverId || '');
          setNote(currentOrder.note || '');
        }

        const storedDishes = localStorage.getItem("dishes");
        if (storedDishes) {
            setDishes(JSON.parse(storedDishes));
        }
    } catch(e) {
        console.error("Failed to parse data from localStorage", e);
    }
  }, [params.id]);

  useEffect(() => {
    try {
        const storedDrivers = localStorage.getItem("drivers");
        if (storedDrivers) {
          setDrivers(JSON.parse(storedDrivers));
        }
    } catch(e) {
        console.error("Failed to parse drivers from localStorage", e);
    }
  }, []);

  if (!order) {
    // We could show a loading state here, but for now we'll just wait.
    // If it persists, it might mean the order is not found.
    // We're avoiding notFound() to prevent flashes on load.
    return <div>Loading order details...</div>;
  }
  
  const handleAssignDriver = (driverId) => {
    if (!driverId) {
      toast({ title: "Please select a driver.", variant: "destructive" });
      return;
    }
    const updatedOrders = allOrders.map(o => 
        o.id === order.id ? { ...o, driverId: driverId, status: "Processing" } : o
    );
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    setOrder({...order, driverId: driverId, status: "Processing"});
    setSelectedDriver(driverId);

    const driver = drivers.find(d => d.id === driverId);
    toast({ title: "Driver Assigned!", description: `${driver.name} has been assigned to order #${order.id}`});
  };

    const handleStatusChange = (newStatus) => {
        if (newStatus === "Cancelled") {
            setIsCancelDialogOpen(true);
        } else if (newStatus === "Returned") {
            if (order.status !== 'Delivered') {
                 toast({
                    title: "Cannot Return Order",
                    description: "An order must be delivered before it can be returned.",
                    variant: "destructive"
                });
                return;
            }
            setIsReturnDialogOpen(true);
        } else {
            updateOrderStatus(newStatus);
        }
    };
    
    const updateOrderStatus = (newStatus, reason, note) => {
        const updatedOrders = allOrders.map(o =>
          o.id === order.id ? { ...o, status: newStatus, cancellationReason: reason, returnReason: note } : o
        );
        localStorage.setItem("orders", JSON.stringify(updatedOrders));
        setOrder({ ...order, status: newStatus, cancellationReason: reason, returnReason: note });
        toast({
          title: "Order Status Updated",
          description: `Order #${order.id} is now ${newStatus}.`,
        });
        setIsCancelDialogOpen(false);
        setCancellationReason("");
        setOtherReason("");
        setIsReturnDialogOpen(false);
        setReturnReason("");
        setOtherReturnReason("");
    };

    const handleConfirmCancellation = () => {
        const reason = cancellationReason === 'other' ? otherReason : cancellationReason;
        if (!reason) {
            toast({
                title: "Reason required",
                description: "Please select or provide a reason for cancellation.",
                variant: "destructive"
            });
            return;
        }
        updateOrderStatus("Cancelled", reason);
    };

    const handleConfirmReturn = () => {
        const reason = returnReason === 'other' ? otherReturnReason : returnReason;
        if (!reason) {
            toast({
                title: "Reason required",
                description: "Please select or provide a reason for the return.",
                variant: "destructive"
            });
            return;
        }
        updateOrderStatus("Returned", undefined, reason);
    };

    const handleAddItemToOrder = (dish, quantity) => {
        const existingItemIndex = order.items.findIndex(item => item.dishId === dish.id);
        
        let updatedOrder;

        if (existingItemIndex > -1) {
            // Update quantity of existing item
            const updatedItems = [...order.items];
            updatedItems[existingItemIndex].quantity += quantity;
            updatedItems[existingItemIndex].subtotal = updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].price;
            
            updatedOrder = {
                ...order,
                items: updatedItems,
            };

        } else {
            // Add new item
            const newItem = {
                dishId: dish.id,
                name: dish.name,
                quantity: quantity,
                price: dish.price,
                subtotal: dish.price * quantity,
            };

            updatedOrder = {
                ...order,
                items: [...order.items, newItem],
            };
        }
        
        updatedOrder.total = updatedOrder.items.reduce((sum, item) => sum + item.subtotal, 0);

        const updatedOrders = allOrders.map(o =>
            o.id === order.id ? updatedOrder : o
        );

        setOrder(updatedOrder);
        setAllOrders(updatedOrders);
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        toast({ title: "Item Added", description: `${quantity} x ${dish.name} has been added to the order.` });
    };

     const handleEditItem = (item) => {
        setEditingItem(item);
        setEditingQuantity(item.quantity);
        setIsEditItemDialogOpen(true);
    };

    const handleUpdateItemQuantity = () => {
        if (!editingItem) return;

        const updatedItems = order.items.map(item =>
            item.dishId === editingItem.dishId
                ? { ...item, quantity: editingQuantity, subtotal: editingQuantity * item.price }
                : item
        );
        
        const updatedOrder = {
            ...order,
            items: updatedItems,
            total: updatedItems.reduce((sum, item) => sum + item.subtotal, 0),
        };

        const updatedOrders = allOrders.map(o =>
            o.id === order.id ? updatedOrder : o
        );

        setOrder(updatedOrder);
        setAllOrders(updatedOrders);
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        toast({ title: "Item Updated", description: `Quantity for ${editingItem.name} has been updated.` });
        setIsEditItemDialogOpen(false);
        setEditingItem(null);
    };


    const handleDeleteItem = (itemToDelete) => {
        const updatedItems = order.items.filter(item => item.dishId !== itemToDelete.dishId);
        
        const updatedOrder = {
            ...order,
            items: updatedItems,
            total: updatedItems.reduce((sum, item) => sum + item.subtotal, 0),
        };

        const updatedOrders = allOrders.map(o =>
            o.id === order.id ? updatedOrder : o
        );

        setOrder(updatedOrder);
        setAllOrders(updatedOrders);
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        toast({ title: "Item Removed", description: `${itemToDelete.name} has been removed from the order.`, variant: "destructive" });
    };



  const handleSaveNote = () => {
    const updatedOrders = allOrders.map(o => 
        o.id === order.id ? { ...o, note: note } : o
    );
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    setOrder({...order, note: note});
    toast({ title: "Note Sent!", description: `Your note for order #${order.id} has been sent to the driver.`});
  }

  const orderItems = Array.isArray(order.items) ? order.items : [];
  
  const getDishImage = (dishId) => {
      const dish = dishes.find(d => d.id === dishId);
      return dish ? dish.image : 'https://placehold.co/40x40.png';
  }

  const subtotal = orderItems.reduce((acc, item) => acc + item.subtotal, 0);
  const discountPercentage = order.couponCode ? 20 : 0;
  const discountAmount = (subtotal * discountPercentage) / 100;
  const shipping = 0; // Free shipping
  const total = subtotal - discountAmount + shipping;

  const statusSteps = [
    { status: "Pending", icon: ShoppingBag, value: "Pending" },
    { status: "Confirmed", icon: CheckCircle, value: "Processing" },
    { status: "Preparing", icon: Utensils, value: "Preparing" },
    { status: "Ready for Pickup", icon: Box, value: "Out for Delivery" },
    { status: "Delivered", icon: UserCheck, value: "Delivered" }
  ];
  
  if (order.status === 'Returned') {
    statusSteps.push({ status: "Returned", icon: CornerUpLeft, value: "Returned" });
  }

  const mappedStatus = statusMap[order.status] || "Pending";
  const currentStatusIndex = statusSteps.findIndex(step => step.status === mappedStatus);
  const assignedDriver = order.driverId ? drivers.find(d => d.id === order.driverId) : null;
  const isFinalState = order.status === "Cancelled" || order.status === "Returned";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-headline text-foreground sm:text-3xl">Order Details</h1>
          <p className="text-sm text-muted-foreground">
            Order <span className="text-primary">#{order.id}</span> &middot; {new Date(order.date).toLocaleDateString()} &middot; {orderItems.reduce((acc, item) => acc + item.quantity, 0)} Products
          </p>
        </div>
        <div className="flex items-center gap-2">
            <Select value={order.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Change status" />
                </SelectTrigger>
                <SelectContent>
                    {statusSteps.filter(s => s.value !== 'Returned').map(step => (
                        <SelectItem key={step.value} value={step.value}>{step.status}</SelectItem>
                    ))}
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                    <SelectItem value="Returned">Returned</SelectItem>
                </SelectContent>
            </Select>
            <Button variant="outline" asChild>
                <Link href={`/dashboard/orders/${order.id}/invoice`}>
                    <FileText className="mr-2 h-4 w-4" />
                    View Invoice
                </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/orders">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to List
              </Link>
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Billing Address</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{order.customer.name}</p>
            <p className="text-muted-foreground">{order.customer.address}</p>
            <p className="mt-2 text-muted-foreground">Email: {order.customer.email}</p>
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">Phone: {order.customer.phone}</p>
              <Button asChild variant="outline" size="sm">
                <a href={`tel:${order.customer.phone}`}>
                  <Phone className="mr-2 h-4 w-4" /> Call
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
         <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Total Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Discount:</span>
              <span>-{discountPercentage}%</span>
            </div>
            <div className="flex justify-between">
                <span className="text-muted-foreground">Coupon Code:</span>
                <span className="font-mono text-primary">{order.couponCode || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping:</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
             <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
          <CardContent className="p-6">
              <div className="relative pt-6">
                  <div className="absolute top-12 left-0 w-full h-0.5 bg-muted">
                      <div className={cn("h-full", isFinalState ? "bg-destructive" : "bg-primary")} style={{ width: isFinalState ? '100%' : `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%` }}></div>
                  </div>
                  <div className="relative flex justify-between">
                      {statusSteps.map((step, index) => (
                           <OrderStatusIndicator 
                                key={step.status}
                                status={step.status} 
                                icon={step.icon}
                                completed={isFinalState ? index < statusSteps.length : currentStatusIndex >= index}
                                current={currentStatusIndex === index}
                                isFinalState={isFinalState && index === statusSteps.length -1}
                                finalState={order.status}
                            />
                      ))}
                  </div>
              </div>
          </CardContent>
      </Card>


      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Order Items</CardTitle>
                    <Dialog open={isAddItemsDialogOpen} onOpenChange={setIsAddItemsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Items
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Add Items to Order</DialogTitle>
                                <DialogDescription>
                                    Select from the available dishes to add to this order.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                                {dishes.map(dish => (
                                    <div key={dish.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <Image src={getDishImage(dish.id)} alt={dish.name} width={40} height={40} className="rounded-md"/>
                                            <div>
                                                <p className="font-medium">{dish.name}</p>
                                                <p className="text-sm text-muted-foreground">${dish.price.toFixed(2)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1">
                                                <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => setItemQuantities(prev => ({...prev, [dish.id]: Math.max(1, (prev[dish.id] || 1) - 1)}))}>
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <Input 
                                                    type="number" 
                                                    className="w-12 h-6 text-center" 
                                                    value={itemQuantities[dish.id] || 1}
                                                    onChange={(e) => setItemQuantities(prev => ({...prev, [dish.id]: parseInt(e.target.value, 10) || 1}))}
                                                />
                                                <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => setItemQuantities(prev => ({...prev, [dish.id]: (prev[dish.id] || 1) + 1}))}>
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            <Button size="sm" onClick={() => handleAddItemToOrder(dish, itemQuantities[dish.id] || 1)}>Add</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Dish</TableHead>
                                <TableHead>Size</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead className="text-right">Quantity</TableHead>
                                <TableHead className="text-right">Sub Total</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orderItems.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            <Image src={getDishImage(item.dishId)} alt={item.name} width={40} height={40} className="rounded-md" data-ai-hint="pizza burger" />
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{item.size || 'Regular'}</TableCell>
                                    <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">x{item.quantity}</TableCell>
                                    <TableCell className="text-right">${item.subtotal.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">
                                        <AlertDialog>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem onClick={() => handleEditItem(item)}>
                                                        <Edit className="mr-2 h-4 w-4" />Edit
                                                    </DropdownMenuItem>
                                                    <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem className="text-destructive">
                                                            <Trash className="mr-2 h-4 w-4" />Delete
                                                        </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently remove the item from the order.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteItem(item)}>Yes, delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Driver Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label>Assigned Driver</Label>
                        {assignedDriver ? (
                            <div className="flex items-center gap-4 mt-2">
                                <Avatar>
                                    <AvatarImage src={assignedDriver.avatar} alt={assignedDriver.name} />
                                    <AvatarFallback>{assignedDriver.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{assignedDriver.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {assignedDriver.phone.length > 10 ? `${assignedDriver.phone.substring(0, 10)}...` : assignedDriver.phone}
                                    </p>
                                    <Badge variant={assignedDriver.status === 'Available' ? 'default' : 'secondary'} className={assignedDriver.status === 'Available' ? 'bg-green-100 text-green-800' : ''}>{assignedDriver.status}</Badge>
                                </div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm" className="ml-auto">
                                            <UserCog className="mr-2 h-4 w-4"/> Change
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Change Driver</DialogTitle>
                                            <DialogDescription>Select a new driver for this order.</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-2">
                                            {drivers.filter(d => d.status === 'Available').map(driver => (
                                                <div key={driver.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50">
                                                    <Avatar>
                                                        <AvatarImage src={driver.avatar} alt={driver.name} />
                                                        <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <p className="font-semibold">{driver.name}</p>
                                                        <p className="text-sm text-muted-foreground">{driver.vehicle}</p>
                                                    </div>
                                                    <Button onClick={() => handleAssignDriver(driver.id)}>Assign</Button>
                                                </div>
                                            ))}
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        ) : (
                            <div className="mt-2 space-y-2">
                                <Select onValueChange={(driverId) => handleAssignDriver(driverId)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a driver" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {drivers.filter(d => d.status === 'Available').map(driver => (
                                            <SelectItem key={driver.id} value={driver.id}>{driver.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" className="w-full" asChild>
                                    <Link href="/dashboard/drivers/new">
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Add New Driver
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>
                    <Separator />
                    <div>
                        <Label htmlFor="order-note">Driver Note</Label>
                        <Textarea id="order-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a specific instruction for the driver..." className="mt-2" />
                    </div>
                    <Button onClick={handleSaveNote} size="lg" className="w-full">
                        <Send className="mr-2 h-4 w-4" />
                        Send Note to Driver
                    </Button>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Payment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                   <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment Method:</span>
                        <span>{order.paymentMethod || 'N/A'}</span>
                    </div>
                    {order.paymentMethod !== 'Cash on Delivery' && (
                        <>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Transaction ID:</span>
                                <span className="font-mono">#20234567213</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Card Holder Name:</span>
                                <span>{order.customer.name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Card Number:</span>
                                <div className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                <span className="font-mono">**** **** **** 4564</span>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>

       <Dialog open={isEditItemDialogOpen} onOpenChange={setIsEditItemDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Item: {editingItem?.name}</DialogTitle>
                    <DialogDescription>
                        Update the quantity for this item.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Label htmlFor="edit-quantity">Quantity</Label>
                    <Input
                        id="edit-quantity"
                        type="number"
                        value={editingQuantity}
                        onChange={(e) => setEditingQuantity(Number(e.target.value))}
                        className="mt-2"
                    />
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsEditItemDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdateItemQuantity}>Save Changes</Button>
                </div>
            </DialogContent>
        </Dialog>

         <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cancel Order #{order.id}</DialogTitle>
                    <DialogDescription>
                        Please select a reason for cancelling this order. This cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="space-y-2">
                        {cancellationReasons.map((reason) => (
                            <div key={reason.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={reason.id}
                                    checked={cancellationReason === reason.label}
                                    onCheckedChange={() => setCancellationReason(reason.label)}
                                />
                                <Label htmlFor={reason.id} className="font-normal">{reason.label}</Label>
                            </div>
                        ))}
                         <div className="flex items-center space-x-2">
                            <Checkbox
                                id="reason-other"
                                checked={cancellationReason === 'other'}
                                onCheckedChange={() => setCancellationReason('other')}
                            />
                            <Label htmlFor="reason-other" className="font-normal">Other</Label>
                        </div>
                    </div>
                    {cancellationReason === 'other' && (
                         <div className="space-y-2">
                            <Label htmlFor="other-reason-text">Please specify:</Label>
                            <Textarea 
                                id="other-reason-text" 
                                value={otherReason} 
                                onChange={(e) => setOtherReason(e.target.value)}
                                placeholder="Enter reason for cancellation"
                            />
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Back</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={handleConfirmCancellation}>Confirm Cancellation</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <Dialog open={isReturnDialogOpen} onOpenChange={setIsReturnDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Process Return for Order #{order.id}</DialogTitle>
                    <DialogDescription>
                        Please select a reason for returning this order.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="space-y-2">
                        {returnReasons.map((reason) => (
                            <div key={reason.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={reason.id}
                                    checked={returnReason === reason.label}
                                    onCheckedChange={() => setReturnReason(reason.label)}
                                />
                                <Label htmlFor={reason.id} className="font-normal">{reason.label}</Label>
                            </div>
                        ))}
                         <div className="flex items-center space-x-2">
                            <Checkbox
                                id="return-reason-other"
                                checked={returnReason === 'other'}
                                onCheckedChange={() => setReturnReason('other')}
                            />
                            <Label htmlFor="return-reason-other" className="font-normal">Other</Label>
                        </div>
                    </div>
                    {returnReason === 'other' && (
                         <div className="space-y-2">
                            <Label htmlFor="other-return-reason-text">Please specify:</Label>
                            <Textarea 
                                id="other-return-reason-text" 
                                value={otherReturnReason} 
                                onChange={(e) => setOtherReturnReason(e.target.value)}
                                placeholder="Enter reason for return"
                            />
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Back</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={handleConfirmReturn}>Confirm Return</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>


      <Button asChild className="fixed bottom-8 right-8 rounded-full h-16 w-16 shadow-lg">
        <a href={`tel:${order.customer.phone}`}>
            <Phone className="h-6 w-6" />
            <span className="sr-only">Call Customer</span>
        </a>
      </Button>
    </div>
  );
}
