
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Save, PlusCircle, X, MapPin, Phone, ChevronLeft, CheckCircle, CreditCard } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';


export default function NewOrderPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [status, setStatus] = useState('Pending');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [items, setItems] = useState([{ name: '', quantity: 1, price: 0, dishId: '' }]);
    const [dishes, setDishes] = useState([]);
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
    const [newOrderId, setNewOrderId] = useState(null);
    const [errors, setErrors] = useState({});
    const [couponCode, setCouponCode] = useState('');


    useEffect(() => {
        const storedDishes = localStorage.getItem("dishes");
        if (storedDishes) {
            setDishes(JSON.parse(storedDishes));
        }
    }, []);

    const handleAddItem = () => {
        setItems([...items, { name: '', quantity: 1, price: 0, dishId: '' }]);
    };
    
    const handleRemoveItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };
    
    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        const newErrors = { ...errors };
        
        if (field === 'dish') {
            const selectedDish = dishes.find(d => d.id === value);
            if (selectedDish) {
                newItems[index]['name'] = selectedDish.name;
                newItems[index]['price'] = selectedDish.price;
                newItems[index]['dishId'] = selectedDish.id;
                
                if (newErrors.items && newErrors.items[index]) {
                    newErrors.items[index].dishId = false;
                    newErrors.items[index].name = false;
                }
            }
        } else {
            if (field === 'quantity' && value < 1) {
                newItems[index][field] = 1;
            } else if (field === 'price' && value < 0) {
                 newItems[index][field] = 0;
            } else {
                newItems[index][field] = value;
            }
             if (newErrors.items && newErrors.items[index]) {
                if (field === 'quantity' && value > 0) newItems[index].quantity = false;
                if (field === 'price' && value >= 0) newItems[index].price = false;
            }
        }
        
        setItems(newItems);
        setErrors(newErrors);
    };

    const calculateTotal = () => {
        return items.reduce((total, item) => total + (item.quantity * item.price), 0);
    };
    
    const handleInputChange = (setter, fieldName) => (e) => {
        setter(e.target.value);
        if (errors[fieldName]) {
            setErrors(prev => ({ ...prev, [fieldName]: false }));
        }
    };
    
     const handleSelectChange = (setter, fieldName) => (value) => {
        setter(value);
        if (errors[fieldName]) {
            setErrors(prev => ({ ...prev, [fieldName]: false }));
        }
    };

    const handleAddOrder = () => {
        const newErrors = {};
        if (!customerName.trim()) newErrors.customerName = true;
        if (!customerEmail.trim()) newErrors.customerEmail = true;
        if (!customerPhone.trim()) newErrors.customerPhone = true;
        if (!customerAddress.trim()) newErrors.customerAddress = true;
        if (!paymentMethod) newErrors.paymentMethod = true;

        const itemErrors = items.map(item => ({
            dishId: !item.dishId,
            name: !item.name,
            quantity: item.quantity <= 0,
            price: item.price < 0,
        }));

        if (itemErrors.some(e => e.dishId || e.name || e.quantity || e.price)) {
            newErrors.items = itemErrors;
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            toast({
                title: "Missing Information",
                description: "Please fill out all required customer and item details.",
                variant: "destructive"
            });
            return;
        }
        
        const totalAmount = calculateTotal();

        const newOrder = {
            id: `ORD${String(new Date().getTime()).slice(-4)}`,
            customer: {
                name: customerName,
                email: customerEmail,
                phone: customerPhone,
                address: customerAddress,
            },
            date: new Date().toISOString(),
            status,
            paymentMethod,
            couponCode,
            total: totalAmount,
            items: items.map(item => ({...item, subtotal: item.quantity * item.price})),
        };

        const existingOrders = JSON.parse(localStorage.getItem('orders') || "[]");
        const updatedOrders = [newOrder, ...existingOrders];
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        
        const existingNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        const newNotification = {
            id: `notif_${new Date().getTime()}`,
            type: 'new_order',
            orderId: newOrder.id,
            customer: newOrder.customer.name,
            time: new Date(),
            avatar: newOrder.customer.name.split(' ').map(n => n[0]).join(''),
            isRead: false
        };
        const updatedNotifications = [newNotification, ...existingNotifications];
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));

        window.dispatchEvent(new CustomEvent('storage-update', { detail: { key: 'orders' } }));
        window.dispatchEvent(new CustomEvent('storage-update', { detail: { key: 'notifications' } }));

        setNewOrderId(newOrder.id);
        setIsSuccessDialogOpen(true);
    };

    return (
        <>
            <DashboardHeader title="Add New Order">
                <Button variant="outline" asChild>
                    <Link href="/dashboard/orders">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back to Orders
                    </Link>
                </Button>
            </DashboardHeader>
            <Card>
                <CardHeader>
                    <CardTitle>Order Details</CardTitle>
                    <CardDescription>Enter the details for the new order.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Customer Name <span className="text-destructive">*</span></Label>
                                    <Input id="name" placeholder="e.g. John Doe" value={customerName} onChange={handleInputChange(setCustomerName, 'customerName')} className={cn(errors.customerName && 'border-destructive')} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Customer Email <span className="text-destructive">*</span></Label>
                                    <Input id="email" type="email" placeholder="e.g. john@example.com" value={customerEmail} onChange={handleInputChange(setCustomerEmail, 'customerEmail')} className={cn(errors.customerEmail && 'border-destructive')} />
                                </div>
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number <span className="text-destructive">*</span></Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="phone" type="tel" placeholder="e.g. 123-456-7890" value={customerPhone} onChange={handleInputChange(setCustomerPhone, 'customerPhone')} className={cn("pl-10", errors.customerPhone && 'border-destructive')} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Location / Address <span className="text-destructive">*</span></Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="address" placeholder="e.g. 123 Main St, Anytown" value={customerAddress} onChange={handleInputChange(setCustomerAddress, 'customerAddress')} className={cn("pl-10", errors.customerAddress && 'border-destructive')} />
                                    </div>
                                </div>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="payment-method">Payment Method <span className="text-destructive">*</span></Label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Select onValueChange={handleSelectChange(setPaymentMethod, 'paymentMethod')} value={paymentMethod}>
                                        <SelectTrigger id="payment-method" className={cn("pl-10", errors.paymentMethod && 'border-destructive')}>
                                            <SelectValue placeholder="Select a payment method" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Card">Card</SelectItem>
                                            <SelectItem value="UPI">UPI</SelectItem>
                                            <SelectItem value="Net Banking">Net Banking</SelectItem>
                                            <SelectItem value="Cash on Delivery">Cash on Delivery</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Order Items</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {items.map((item, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor={`item-name-${index}`}>Item Name <span className="text-destructive">*</span></Label>
                                        <Select onValueChange={(value) => handleItemChange(index, 'dish', value)} value={item.dishId}>
                                            <SelectTrigger id={`item-name-${index}`} className={cn(errors.items?.[index]?.dishId && 'border-destructive')}>
                                                <SelectValue placeholder="Select an item" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {dishes.map((dish) => (
                                                    <SelectItem key={dish.id} value={dish.id}>{dish.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`item-quantity-${index}`}>Quantity <span className="text-destructive">*</span></Label>
                                        <Input id={`item-quantity-${index}`} type="number" min="1" placeholder="1" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', parseInt(e.target.value, 10))} className={cn(errors.items?.[index]?.quantity && 'border-destructive')} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`item-price-${index}`}>Price <span className="text-destructive">*</span></Label>
                                        <Input id={`item-price-${index}`} type="number" min="0" placeholder="0.00" value={item.price} onChange={e => handleItemChange(index, 'price', parseFloat(e.target.value))} className={cn(errors.items?.[index]?.price && 'border-destructive')} />
                                    </div>
                                    {items.length > 1 && (
                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(index)} className="text-destructive">
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button variant="outline" onClick={handleAddItem}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Item
                            </Button>
                             <Separator />
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="coupon-code">Discount / Coupon Code</Label>
                                    <Input id="coupon-code" placeholder="e.g. SUMMER50" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                                </div>
                                <div className="text-right font-semibold text-lg self-end">
                                    Total: ${calculateTotal().toFixed(2)}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-2">
                        <Label htmlFor="status">Order Status</Label>
                        <Select onValueChange={setStatus} value={status}>
                            <SelectTrigger id="status">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Processing">Processing</SelectItem>
                                <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                                <SelectItem value="Delivered">Delivered</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={handleAddOrder}>
                            <Save className="mr-2 h-4 w-4" />
                            Save Order
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <AlertDialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader className="items-center text-center">
                         <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <AlertDialogTitle>Order Created Successfully!</AlertDialogTitle>
                        <AlertDialogDescription>
                            The new order #{newOrderId} has been added to the list.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:justify-center gap-2">
                        <AlertDialogAction asChild>
                            <Button onClick={() => router.push(`/dashboard/orders/${newOrderId}`)}>View Order</Button>
                        </AlertDialogAction>
                        <AlertDialogAction asChild>
                           <Button variant="outline" onClick={() => router.push('/dashboard/orders')}>
                                Back to Orders
                            </Button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
