
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Printer } from "lucide-react";
import { Logo } from "@/components/logo";

export default function InvoicePage() {
    const params = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        if (params.id) {
            const storedOrders = localStorage.getItem("orders");
            const orders = storedOrders ? JSON.parse(storedOrders) : [];
            const currentOrder = orders.find((o) => o.id === params.id);
            setOrder(currentOrder);
        }
    }, [params.id]);

    if (!order) {
        return <div>Loading invoice...</div>;
    }
    
    const orderItems = [
        { name: 'Italian Pizza', price: 79, quantity: 2, subtotal: 158, size: 'Medium' },
        { name: 'Veg Burger', price: 88, quantity: 1, subtotal: 88, size: 'Large' },
    ];
    
    const subtotal = orderItems.reduce((acc, item) => acc + item.subtotal, 0);
    const taxRate = 0.05; // 5%
    const taxAmount = subtotal * taxRate;
    const discountAmount = 20;
    const total = subtotal + taxAmount - discountAmount;


    const handlePrint = () => {
        window.print();
    }

    return (
        <div className="bg-muted/40 p-4 sm:p-8 rounded-lg">
             <div className="max-w-4xl mx-auto bg-background p-8 rounded-lg shadow-sm print:shadow-none">
                <header className="flex justify-between items-start mb-8">
                    <div>
                        <Logo />
                        <p className="text-muted-foreground text-sm mt-2">
                           123 Tastytreat St.<br/>
                           Foodville, FL 12345
                        </p>
                    </div>
                    <div className="text-right">
                        <h1 className="text-2xl font-bold text-primary">INVOICE</h1>
                        <p className="text-muted-foreground">#INV-{order.id}</p>
                    </div>
                </header>
                <section className="grid grid-cols-2 gap-8 mb-8">
                     <div>
                        <h2 className="font-semibold mb-2">Billed To:</h2>
                        <p className="font-bold">{order.customer.name}</p>
                        <p className="text-muted-foreground">2123 Parker st.<br/>Allentown, New Mexico 123456</p>
                        <p className="text-muted-foreground">{order.customer.email}</p>
                    </div>
                     <div className="text-right">
                        <h2 className="font-semibold mb-2">Invoice Details:</h2>
                        <p><span className="font-semibold">Invoice Date:</span> {new Date().toLocaleDateString()}</p>
                        <p><span className="font-semibold">Order Date:</span> {new Date(order.date).toLocaleDateString()}</p>
                        <p><span className="font-semibold">Order ID:</span> #{order.id}</p>
                        <p><span className="font-semibold">Payment Method:</span> {order.paymentMethod}</p>
                    </div>
                </section>
                <section>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-1/2">Item</TableHead>
                                <TableHead>Size</TableHead>
                                <TableHead className="text-center">Quantity</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orderItems.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>{item.size}</TableCell>
                                    <TableCell className="text-center">{item.quantity}</TableCell>
                                    <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">${item.subtotal.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </section>
                <section className="mt-8 flex justify-end">
                    <div className="w-full max-w-xs space-y-2">
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Discount</span>
                            <span>-${discountAmount.toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Tax ({(taxRate * 100).toFixed(0)}%)</span>
                            <span>${taxAmount.toFixed(2)}</span>
                        </div>
                        <Separator />
                         <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                </section>
                 <footer className="mt-12 text-center text-muted-foreground text-sm">
                    <p>Thank you for your business!</p>
                    <p>If you have any questions, please contact us at support@adminslice.com.</p>
                </footer>

                <div className="mt-8 flex justify-center gap-4 print:hidden">
                    <Button onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print Invoice</Button>
                </div>
            </div>
        </div>
    );
}
