
"use client"

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, Phone, Mail, Edit, Trash, ChevronLeft, Briefcase, User, Info, Truck, CheckCircle, Clock, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { allOrders } from "@/lib/data";

export default function DriverDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [driver, setDriver] = useState(null);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (params.id) {
            const storedDrivers = JSON.parse(localStorage.getItem('drivers') || '[]');
            const currentDriver = storedDrivers.find(d => d.id === params.id);
            setDriver(currentDriver);

            const storedOrders = JSON.parse(localStorage.getItem("orders") || JSON.stringify(allOrders));
            const driverOrders = storedOrders.filter(o => o.driverId === params.id);
            setOrders(driverOrders);
        }
    }, [params.id]);

    if (!driver) {
        return <div>Loading...</div>;
    }

    const statusVariantMap = {
        "Delivered": "bg-green-100 text-green-800 border-green-200",
        "Cancelled": "bg-red-100 text-red-800 border-red-200",
        "Pending": "bg-yellow-100 text-yellow-800 border-yellow-200",
        "Processing": "bg-blue-100 text-blue-800 border-blue-200",
        "Out for Delivery": "bg-indigo-100 text-indigo-800 border-indigo-200",
        "Available": "bg-blue-100 text-blue-800 border-blue-200",
        "On-route": "bg-purple-100 text-purple-800 border-purple-200",
        "Offline": "bg-gray-100 text-gray-800 border-gray-200",
    };
    
    const completedOrders = orders.filter(o => o.status === 'Delivered').length;
    const pendingOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;

    return (
        <>
            <DashboardHeader title="Driver Details">
                 <div className="flex gap-2">
                     <Button variant="outline" asChild>
                        <Link href={`/dashboard/drivers/edit/${driver.id}`}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/drivers">
                            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Drivers
                        </Link>
                    </Button>
                </div>
            </DashboardHeader>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardContent className="pt-6 flex flex-col items-center text-center">
                            <Avatar className="h-24 w-24 mb-4">
                                <AvatarImage src={driver.avatar} alt={driver.name} />
                                <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <h2 className="text-xl font-bold">{driver.name}</h2>
                             <Badge className={`mt-2 ${statusVariantMap[driver.status] || 'bg-gray-100 text-gray-800'}`}>
                                {driver.status}
                            </Badge>
                             <div className="flex items-center gap-1 text-lg text-yellow-500 mt-2">
                                <Star className="w-5 h-5 fill-current" />
                                <span>{driver.rating}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><User className="w-5 h-5" /> Contact Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <span>{driver.phone}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Truck className="w-5 h-5" /> Vehicle & Legal</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">Vehicle:</span>
                                <span className="font-medium">{driver.vehicle}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">Vehicle Number:</span>
                                <span className="font-medium">{driver.vehicle}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">License No:</span>
                                <span className="font-medium">{driver.licenseNumber}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">PAN Card:</span>
                                <span className="font-medium">{driver.panCardNumber}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Assigned</CardTitle>
                                <Package className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{orders.length}</div>
                                <p className="text-xs text-muted-foreground">All-time assigned orders</p>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{completedOrders}</div>
                                <p className="text-xs text-muted-foreground">Successfully delivered orders</p>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{pendingOrders}</div>
                                <p className="text-xs text-muted-foreground">Orders currently in progress</p>
                            </CardContent>
                        </Card>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Briefcase className="w-5 h-5" /> Recent Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>Customer</TableHead>
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
                                                <TableCell>{order.customer.name}</TableCell>
                                                <TableCell>{order.date}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={statusVariantMap[order.status]}>{order.status}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center text-muted-foreground">
                                                No orders assigned to this driver yet.
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
