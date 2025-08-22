
"use client"

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, Mail, ChevronLeft, ShoppingBag, DollarSign, ListOrdered } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function CustomerDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [totalSpent, setTotalSpent] = useState(0);

    useEffect(() => {
        const userEmail = decodeURIComponent(params.id);
        if (userEmail) {
            const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
            const userOrders = storedOrders.filter(o => o.customer.email === userEmail);
            
            if (userOrders.length > 0) {
                setUser(userOrders[0].customer);
                setOrders(userOrders);
                const total = userOrders.reduce((sum, order) => sum + order.total, 0);
                setTotalSpent(total);
            }
        }
    }, [params.id]);

    if (!user) {
        return <div>Loading...</div>;
    }

    const statusVariantMap = {
        "Delivered": "bg-green-100 text-green-800 border-green-200",
        "Cancelled": "bg-red-100 text-red-800 border-red-200",
        "Pending": "bg-yellow-100 text-yellow-800 border-yellow-200",
        "Processing": "bg-blue-100 text-blue-800 border-blue-200",
        "Out for Delivery": "bg-indigo-100 text-indigo-800 border-indigo-200",
    };

    return (
        <>
            <DashboardHeader title="Customer Details">
                 <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/users">
                            <ChevronLeft className="mr-2 h-4 w-4" /> Back
                        </Link>
                    </Button>
                </div>
            </DashboardHeader>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardContent className="pt-6 flex flex-col items-center text-center">
                            <Avatar className="h-24 w-24 mb-4">
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <h2 className="text-xl font-bold">{user.name}</h2>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">Contact Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <span>{user.phone || 'N/A'}</span>
                            </div>
                             <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                <span>{user.email || 'N/A'}</span>
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">Address</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                           <p>{user.address || 'No address provided'}</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{orders.length}</div>
                                <p className="text-xs text-muted-foreground">All-time orders</p>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
                                <p className="text-xs text-muted-foreground">Total amount spent</p>
                            </CardContent>
                        </Card>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><ListOrdered className="w-5 h-5" /> Order History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.length > 0 ? (
                                        orders.slice(0, 10).map(order => (
                                            <TableRow key={order.id} className="cursor-pointer" onClick={() => router.push(`/dashboard/orders/${order.id}`)}>
                                                <TableCell className="font-medium text-primary">#{order.id}</TableCell>
                                                <TableCell>{order.date}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={statusVariantMap[order.status]}>{order.status}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-muted-foreground">
                                                No orders found for this user.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
