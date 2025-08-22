
"use client"

import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Map, Phone, Star, PlusCircle, Eye, MoreHorizontal, Edit, Trash, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";


export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const { toast } = useToast();
  const [selectedDriver, setSelectedDriver] = useState(null);
  const router = useRouter();

  const updateDrivers = () => {
    const storedDrivers = localStorage.getItem("drivers");
    if (storedDrivers) {
      setDrivers(JSON.parse(storedDrivers));
    }
  }

  useEffect(() => {
    updateDrivers();
    window.addEventListener('storage', updateDrivers);
    return () => {
        window.removeEventListener('storage', updateDrivers);
    }
  }, []);

  const handleDeleteDriver = (e, driverId) => {
    e.stopPropagation();
    const currentDrivers = JSON.parse(localStorage.getItem("drivers") || "[]");
    const updatedDrivers = currentDrivers.filter(driver => driver.id !== driverId);
    localStorage.setItem("drivers", JSON.stringify(updatedDrivers));
    window.dispatchEvent(new Event('storage'));
    toast({
        title: "Driver Deleted",
        description: "The driver has been removed from your list."
    });
  };
  
  const handleDriverSelect = (driver) => {
    if ((driver.status === 'On-route' || driver.status === 'Delivering')) {
      setSelectedDriver(driver);
    } else {
      setSelectedDriver(null);
    }
  };
  
  const handleCardClick = (e, driverId) => {
    if (e.target.closest('[data-radix-dropdown-menu-trigger]') || e.target.closest('[data-radix-alert-dialog-trigger]') || e.target.closest('a')) {
        e.stopPropagation();
        return;
    }
    router.push(`/dashboard/drivers/${driverId}`);
  };


  return (
    <>
      <DashboardHeader title="Drivers">
        <Button asChild>
            <Link href="/dashboard/drivers/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Driver
            </Link>
        </Button>
      </DashboardHeader>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
             <Card>
                <CardHeader>
                <CardTitle>Live Driver Tracking</CardTitle>
                <CardDescription>
                    This feature is currently under development. Click on an active driver to see their location.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <div className="w-full bg-muted/50 rounded-lg aspect-video flex items-center justify-center border-dashed border-2 relative overflow-hidden">
                    <Image src="https://placehold.co/800x600.png" layout="fill" objectFit="cover" alt="Live map with route" data-ai-hint="route map" />
                    <div className="absolute inset-0 bg-black/10" />
                    {selectedDriver ? (
                         <div className="text-center text-white bg-primary/80 p-4 rounded-lg shadow-lg animate-pulse">
                            <MapPin className="mx-auto h-12 w-12 mb-2" />
                            <p className="font-semibold">{selectedDriver.name} is here</p>
                            <p className="text-sm">Status: {selectedDriver.status}</p>
                        </div>
                    ) : (
                        <div className="text-center text-white bg-black/50 p-4 rounded-lg">
                            <Map className="mx-auto h-12 w-12 mb-2" />
                            <p className="font-semibold">Live Map</p>
                            <p className="text-sm">Select an active driver to view location</p>
                        </div>
                    )}
                </div>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle>Active Drivers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {drivers.length > 0 ? drivers.map((driver) => {
                        const isTrackable = (driver.status === 'On-route' || driver.status === 'Delivering');
                        
                        return (
                             <div 
                                key={driver.id} 
                                className={cn("flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 cursor-pointer")}
                                onClick={(e) => handleCardClick(e, driver.id)}
                             >
                                <Avatar onClick={() => handleDriverSelect(driver)} className={cn(isTrackable && "cursor-pointer", selectedDriver?.id === driver.id && "ring-2 ring-primary")}>
                                    <AvatarImage src={driver.avatar} alt={driver.name} />
                                    <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 block">
                                    <p className="font-semibold">{driver.name}</p>
                                    <p className="text-sm text-muted-foreground">Vehicle Number: {driver.vehicle}</p>
                                    <div className="flex items-center gap-1 text-sm">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        <span>{driver.rating}</span>
                                        <span className={`ml-2 text-xs font-semibold ${driver.status === 'Available' ? 'text-blue-500' : (isTrackable ? 'text-green-600' : 'text-orange-500')}`}>{driver.status}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                    <AlertDialog>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/dashboard/drivers/edit/${driver.id}`}><Edit className="mr-2 h-4 w-4" />Edit</Link>
                                                </DropdownMenuItem>
                                                <AlertDialogTrigger asChild>
                                                    <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                                                        <Trash className="mr-2 h-4 w-4" />Delete
                                                    </DropdownMenuItem>
                                                </AlertDialogTrigger>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete the driver
                                                    and remove their data from our servers.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={(e) => handleDeleteDriver(e, driver.id)}>Yes, delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>

                                    <Button variant="outline" size="icon" asChild>
                                        <a href={`tel:${driver.phone}`}><Phone className="h-4 w-4" /></a>
                                    </Button>

                                    {isTrackable && driver.orderId && (
                                        <Button variant="outline" size="icon" asChild>
                                            <Link href={`/dashboard/orders/${driver.orderId}`}><Eye className="h-4 w-4" /></Link>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )
                    }) : <p className="text-center text-muted-foreground">No drivers added yet.</p>}
                </CardContent>
            </Card>
        </div>
      </div>
    </>
  );
}
