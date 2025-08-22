
"use client";

import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Edit, Trash, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const router = useRouter();
    const { toast } = useToast();
    const { allUsers: authUsers, user: currentUser } = useAuth();
    const [selectedUser, setSelectedUser] = useState(null);
    const [isInitialDialogOpen, setIsInitialDialogOpen] = useState(false);
    const [isConfirmDeleteUserDialogOpen, setIsConfirmDeleteUserDialogOpen] = useState(false);
    const [isConfirmDeleteUserAndOrdersDialogOpen, setIsConfirmDeleteUserAndOrdersDialogOpen] = useState(false);


    useEffect(() => {
        const storedOrders = localStorage.getItem("orders");
        if (storedOrders) {
            try {
                setOrders(JSON.parse(storedOrders));
            } catch (error) {
                console.error("Failed to parse orders from localStorage", error);
                setOrders([]);
            }
        } else {
            setOrders([]);
        }
    }, []);

    const customerUsers = useMemo(() => {
        const customersFromOrders = orders.map(order => ({
            id: `customer_${order.customer.email}`,
            name: order.customer.name,
            email: order.customer.email,
            joiningDate: order.date,
            isCustomer: true
        }));

        const uniqueCustomers = customersFromOrders.reduce((acc, current) => {
            if (!acc.find(item => item.email === current.email)) {
                acc.push(current);
            }
            return acc;
        }, []);

        return uniqueCustomers.filter(u => u.name && u.email);
    }, [orders]);

    useEffect(() => {
        setUsers(customerUsers);
    }, [customerUsers]);
    
    useEffect(() => {
      const handleStorageChange = (e) => {
          if (e.detail?.key === 'orders' || !e.detail) {
              const storedOrders = localStorage.getItem("orders");
              if (storedOrders) {
                try {
                    setOrders(JSON.parse(storedOrders));
                } catch (error) {
                    console.error("Failed to parse orders from localStorage", error);
                    setOrders([]);
                }
              }
          }
        };

        window.addEventListener('storage-update', handleStorageChange);
        window.addEventListener('storage', handleStorageChange);
        return () => {
          window.removeEventListener('storage-update', handleStorageChange);
          window.removeEventListener('storage', handleStorageChange);
        };
    }, []);


    const getUserOrderCount = (userEmail) => {
        return orders.filter(order => order.customer.email === userEmail).length;
    }
    
    const handleDeleteUserAndOrders = () => {
        if (!selectedUser) return;
        const { email, name } = selectedUser;

        // Remove orders associated with the customer
        const currentOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        const updatedOrders = currentOrders.filter(order => order.customer.email !== email);
        localStorage.setItem("orders", JSON.stringify(updatedOrders));
        setOrders(updatedOrders);

        // Remove the user from the list
        const updatedUsers = users.filter(user => user.email !== email);
        setUsers(updatedUsers);

        window.dispatchEvent(new CustomEvent('storage-update', { detail: { key: 'orders' } }));
        window.dispatchEvent(new CustomEvent('storage-update', { detail: { key: 'notifications' } }));

        toast({
            title: `Customer and Orders Deleted`,
            description: `${name} and all their associated orders have been deleted.`,
        });
        setSelectedUser(null);
        setIsConfirmDeleteUserAndOrdersDialogOpen(false);
    };

    const handleDeleteOnlyUser = () => {
        if (!selectedUser) return;
        const { email, name } = selectedUser;
        
        // Remove only the user from the list
        const updatedUsers = users.filter(user => user.email !== email);
        setUsers(updatedUsers);
        
        // Note: We are not updating localStorage for users since this list is derived from orders.
        // The user will disappear from the UI. If they place a new order, they will reappear.
        // If users were stored independently, we would update that list here.

        toast({
            title: `Customer Deleted`,
            description: `${name} has been deleted. Their orders remain.`,
        });
        setSelectedUser(null);
        setIsConfirmDeleteUserDialogOpen(false);
    };


    const handleRowClick = (user) => {
        if (user.isCustomer) {
            router.push(`/dashboard/users/${encodeURIComponent(user.email)}`);
        }
    }
    
    const handleInitialDeleteClick = (u) => {
        setSelectedUser(u);
        setIsInitialDialogOpen(true);
    };

    return (
        <>
            <DashboardHeader title="Customers" />
            <Card>
                <CardHeader>
                    <CardTitle>All Customers</CardTitle>
                    <CardDescription>
                        Manage customer information and view their order history.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                {currentUser?.role !== 'RESTAURANT_OWNER' && <TableHead>Joining Date</TableHead>}
                                <TableHead>Total Orders</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((u) => (
                                <TableRow key={u.id} onClick={() => handleRowClick(u)} className={u.isCustomer ? "cursor-pointer" : ""}>
                                    <TableCell className="font-medium">{u.name}</TableCell>
                                    <TableCell>{u.email}</TableCell>
                                    {currentUser?.role !== 'RESTAURANT_OWNER' && <TableCell>{u.isCustomer && u.joiningDate ? new Date(u.joiningDate).toLocaleDateString() : 'N/A'}</TableCell>}
                                    <TableCell>{u.isCustomer ? getUserOrderCount(u.email) : 'N/A'}</TableCell>
                                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem className="text-destructive" onSelect={(e) => { e.preventDefault(); handleInitialDeleteClick(u); }}>
                                                    <Trash className="mr-2 h-4 w-4" />Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Initial Deletion Dialog */}
             <AlertDialog open={isInitialDialogOpen} onOpenChange={setIsInitialDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Customer: {selectedUser?.name}</AlertDialogTitle>
                        <AlertDialogDescription>
                            Choose an option to delete the customer. This action might not be reversible.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
                        <Button
                            onClick={() => {
                                setIsInitialDialogOpen(false);
                                setIsConfirmDeleteUserAndOrdersDialogOpen(true);
                            }}
                            variant="destructive"
                        >
                            <Trash2 className="mr-2 h-4 w-4"/>
                            Delete User & Orders
                        </Button>
                        <Button
                            onClick={() => {
                                setIsInitialDialogOpen(false);
                                setIsConfirmDeleteUserDialogOpen(true);
                            }}
                            variant="outline"
                        >
                            <Trash className="mr-2 h-4 w-4"/>
                            Delete Only User
                        </Button>
                        <AlertDialogCancel onClick={() => setSelectedUser(null)}>Cancel</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            
            {/* Confirm Delete User and Orders Dialog */}
            <AlertDialog open={isConfirmDeleteUserAndOrdersDialogOpen} onOpenChange={setIsConfirmDeleteUserAndOrdersDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete <strong>{selectedUser?.name}</strong> and all their orders. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => { setIsConfirmDeleteUserAndOrdersDialogOpen(false); setSelectedUser(null); }}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteUserAndOrders}>Yes, delete everything</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Confirm Delete Only User Dialog */}
            <AlertDialog open={isConfirmDeleteUserDialogOpen} onOpenChange={setIsConfirmDeleteUserDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete <strong>{selectedUser?.name}</strong>. Their past orders will remain. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => { setIsConfirmDeleteUserDialogOpen(false); setSelectedUser(null); }}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteOnlyUser}>Yes, delete user</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
