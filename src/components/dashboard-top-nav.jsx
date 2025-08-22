

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";
import { Bell, Menu, Search, User, Settings, CreditCard, LogOut, ChevronDown, MapPin, ShoppingBag, CheckCircle } from "lucide-react";
import { useSidebar } from "./ui/sidebar";
import Link from "next/link";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "./ui/badge";
import { useEffect, useState } from "react";
import { formatDistanceToNowStrict } from 'date-fns';
import { ScrollArea } from "./ui/scroll-area";
 

export function DashboardTopNav() {
  const { user, logout } = useAuth();
  const { toggleSidebar } = useSidebar();
  const [notifications, setNotifications] = useState([]);
  const [, setTime] = useState(Date.now());


  useEffect(() => {
    const fetchNotifications = () => {
      try {
        const storedNotifications = localStorage.getItem("notifications");
        if (storedNotifications) {
          setNotifications(JSON.parse(storedNotifications));
        }
      } catch (error) {
        console.error("Failed to parse notifications from localStorage", error);
        setNotifications([]);
      }
    };

    fetchNotifications();

    const handleStorageChange = (e) => {
      if (e.detail?.key === 'notifications' || !e.detail) {
        fetchNotifications();
      }
    };

    window.addEventListener('storage-update', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    const interval = setInterval(() => setTime(Date.now()), 30000); // Update time every 30 seconds

    return () => {
      window.removeEventListener('storage-update', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const handleMarkAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };


  const formatRelativeTime = (dateString) => {
    try {
        const date = new Date(dateString);
        if(isNaN(date.getTime())) {
            return 'Invalid date';
        }

        const distance = formatDistanceToNowStrict(date, { addSuffix: true });

        // date-fns formatDistanceToNowStrict is quite good, but let's shorten it
        return distance
        .replace('about ', '')
        .replace(' seconds', 's')
        .replace(' second', 's')
        .replace(' minutes', 'm')
        .replace(' minute', 'm')
        .replace(' hours', 'h')
        .replace(' hour', 'h')
        .replace(' days', 'd')
        .replace(' day', 'd');
    } catch (e) {
        console.error("Error formatting date", e);
        return "a while ago";
    }
  };


  const formatRole = (role) => {
    if (!role) return '';
    return role
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };
  
  const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6 sticky top-0 z-30">
        <div className="flex items-center gap-4">
            <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={toggleSidebar}
            >
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle Sidebar</span>
            </Button>
            <h1 className="text-lg font-semibold md:text-xl hidden sm:block">
                Welcome, {capitalize(user?.name.split(' ')[0])}
            </h1>
        </div>

        <div className="flex-1" />
      
        <div className="flex items-center gap-4">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full relative bg-accent border-0 text-accent-foreground hover:bg-accent/80 hover:text-accent-foreground">
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 justify-center bg-primary text-primary-foreground">{unreadCount}</Badge>
                        )}
                        <span className="sr-only">Notifications</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                    <div className="flex justify-between items-center pr-2">
                      <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                      {unreadCount > 0 && (
                        <button onClick={handleMarkAllAsRead} className="text-xs text-primary hover:underline font-medium">Mark all as read</button>
                      )}
                    </div>
                    <DropdownMenuSeparator />
                    <ScrollArea className="h-[300px]">
                    {notifications.length > 0 ? notifications.map((n) => (
                        <DropdownMenuItem key={n.id} className="p-2" onSelect={() => handleMarkAsRead(n.id)}>
                           <Link href={`/dashboard/orders/${n.orderId}`} className="flex items-center gap-3 w-full">
                                <Avatar className="h-9 w-9">
                                    <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-background flex items-center justify-center bg-green-500">
                                        <ShoppingBag className="h-2 w-2 text-white" />
                                    </div>
                                    <AvatarImage src={`https://placehold.co/40x40.png?text=${n.avatar}`} alt={n.customer} />
                                    <AvatarFallback>{n.avatar}</AvatarFallback>
                                </Avatar>
                                <div className="grid gap-0.5 text-xs">
                                    <p className="font-medium text-foreground">
                                        {n.type === 'new_order' ? `New order #${n.orderId}` : `Order #${n.orderId} updated`}
                                    </p>
                                    <p className="text-muted-foreground">
                                        {n.type === 'new_order' ? `From ${n.customer}` : `Status changed to ${n.status}`}
                                    </p>
                                </div>
                                <span className="ml-auto text-xs text-muted-foreground">{formatRelativeTime(n.time)}</span>
                           </Link>
                        </DropdownMenuItem>
                    )) : (
                        <p className="p-4 text-sm text-center text-muted-foreground">No new notifications.</p>
                    )}
                    </ScrollArea>
                    <DropdownMenuSeparator />
                     <DropdownMenuItem asChild>
                        <Link href="/dashboard/orders" className="text-center justify-center py-2 text-primary">View all notifications</Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 p-1 rounded-full h-auto">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={`https://placehold.co/40x40.png?text=${user?.name.charAt(0)}`} alt={user?.name} />
                            <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="hidden md:flex flex-col items-start">
                            <span className="text-sm font-medium">{capitalize(user?.name)}</span>
                            <span className="text-xs text-muted-foreground">{formatRole(user?.role)}</span>
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="/dashboard/settings"><Settings className="mr-2 h-4 w-4" />Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                          <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                              <AlertDialogDescription>
                                  You will be returned to the login page.
                              </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={logout}>Logout</AlertDialogAction>
                          </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </header>
  );
}
