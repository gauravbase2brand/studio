
"use client";

import { recentOrders, categories } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import Image from "next/image";
import { Heart, Star, TrendingDown, TrendingUp, ShoppingBag, Gift, Tag, ChevronRight, User, PlusCircle } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useEffect, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { OrderCard } from "@/components/order-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const plugin = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
  const [offers, setOffers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);


  const updateData = () => {
    const storedOffers = localStorage.getItem("offers");
    if (storedOffers) {
      setOffers(JSON.parse(storedOffers));
    }

    const storedOrders = localStorage.getItem("orders");
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    } else {
      setOrders([]);
    }

    const storedDrivers = localStorage.getItem("drivers");
    if (storedDrivers) {
      setDrivers(JSON.parse(storedDrivers));
    }
  }

  useEffect(() => {
    updateData();

    const handleStorageChange = (e) => {
        if (e.key === 'offers' || e.key === 'orders' || e.key === 'drivers') {
            updateData()
        }
    }
    window.addEventListener('storage', handleStorageChange);
    return () => {
        window.removeEventListener('storage', handleStorageChange);
    }

  }, []);

  const getDriverName = (driverId) => {
    const driver = drivers.find(d => d.id === driverId);
    return driver ? driver.name : "Unassigned";
  }
  
  const handleStatusChange = (orderId, newStatus) => {
    const updatedOrders = orders.map(o =>
      o.id === orderId ? { ...o, status: newStatus } : o
    );
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    toast({
        title: "Order Status Updated",
        description: `Order #${orderId} is now ${newStatus}.`,
    });
  }

  const handleOrderDeleted = (orderId) => {
    setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
  };

  const displayedOrders = orders.slice(0, 5);

  return (
    <>
      <DashboardHeader title="Dashboard" />

      <div className="mb-8">
        <Carousel
          opts={{
              align: "start",
              loop: true,
          }}
          plugins={[
              Autoplay({
                  delay: 5000,
                  stopOnInteraction: false,
              }),
          ]}
          className="w-full"
          >
          <CarouselContent>
              <CarouselItem>
                  <Card className="overflow-hidden">
                      <div className="grid md:grid-cols-2">
                          <div className="p-8 bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center relative aspect-square md:aspect-auto">
                              <div className="absolute inset-0 bg-black/20"></div>
                              <Image src="https://placehold.co/400x400.png" alt="Burger" width={400} height={400} className="relative z-10" data-ai-hint="burger" />
                          </div>
                          <div className="p-8 bg-amber-800 text-white flex flex-col justify-center items-start">
                              <div className="flex items-center gap-2 mb-4">
                                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>
                                  <h3 className="font-semibold">INDIAN DISHES</h3>
                              </div>
                              <p className="text-lg bg-white/20 px-2 py-1 rounded-md inline-block mb-2">Delicious</p>
                              <h2 className="text-4xl md:text-5xl font-bold font-headline mb-4">Indian Cuisine</h2>
                              <div className="bg-black/20 rounded-full px-4 py-2 text-sm">
                                  Opening Hours: Everyday 8AM - 6PM
                              </div>
                          </div>
                      </div>
                  </Card>
              </CarouselItem>
               <CarouselItem>
                  <Card className="overflow-hidden">
                      <div className="grid md:grid-cols-2">
                           <div className="p-8 bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center relative aspect-square md:aspect-auto">
                              <div className="absolute inset-0 bg-black/20"></div>
                              <Image src="https://placehold.co/400x400.png" alt="Pizza" width={400} height={400} className="relative z-10" data-ai-hint="pizza" />
                          </div>
                          <div className="p-8 bg-sky-800 text-white flex flex-col justify-center items-start">
                              <div className="flex items-center gap-2 mb-4">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>
                                  <h3 className="font-semibold">ITALIAN DISHES</h3>
                              </div>
                              <p className="text-lg bg-white/20 px-2 py-1 rounded-md inline-block mb-2">Cheesy</p>
                              <h2 className="text-4xl md:text-5xl font-bold font-headline mb-4">Italian Cuisine</h2>
                              <div className="bg-black/20 rounded-full px-4 py-2 text-sm">
                                  Opening Hours: Everyday 10AM - 10PM
                              </div>
                          </div>
                      </div>
                  </Card>
              </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-6">
        
      </div>

      <div className="mt-8 space-y-8">
         <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Your Active Offers</CardTitle>
               <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/offers">
                    View All
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {offers.length > 0 ? (
                <div className="relative">
                  <Carousel
                    opts={{ align: "start", loop: offers.length > 3 }}
                    className="w-full"
                  >
                    <CarouselContent>
                      {offers.map((offer) => (
                        <CarouselItem key={offer.id} className="basis-full md:basis-1/2 lg:basis-1/3 cursor-pointer" onClick={() => router.push('/dashboard/offers')}>
                          <Card className="h-full">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                {offer.discountType === 'percentage' ? <Tag className="h-5 w-5 text-primary" /> : <Gift className="h-5 w-5 text-primary" />}
                                {offer.title}
                              </CardTitle>
                              <CardDescription>
                                Use code <span className="font-semibold text-primary">{offer.code}</span>
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm">{offer.description}</p>
                              <p className="text-lg font-bold mt-2">
                                {offer.discountType === 'percentage'
                                  ? `${offer.discountValue}% OFF`
                                  : `$${offer.discountValue.toFixed(2)} OFF`}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Valid from {offer.startDate} to {offer.endDate}
                              </p>
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {offers.length > 3 && (
                      <>
                        <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 z-10" />
                        <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 z-10" />
                      </>
                    )}
                  </Carousel>
                </div>
              ) : (
                <div className="text-center text-muted-foreground p-8">
                  <p className="mb-4">You have no active offers.</p>
                  <Button asChild>
                    <Link href="/dashboard/offers/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Offer
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Your Rider</CardTitle>
             <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/drivers">
                    View All
                </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-6 overflow-x-auto pb-4">
              {drivers.map((driver) => (
                <Link key={driver.id} href={`/dashboard/drivers/${driver.id}`} className="flex flex-col items-center flex-shrink-0 group">
                  <Avatar className="h-16 w-16 border-2 border-primary group-hover:ring-2 group-hover:ring-primary group-hover:ring-offset-2 transition-all">
                    <AvatarImage src={driver.avatar} alt={driver.name} />
                    <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="mt-2 text-sm text-muted-foreground group-hover:text-primary transition-colors">{driver.name.split(' ')[0]}</span>
                </Link>
              ))}
              {drivers.length === 0 && (
                <div className="flex flex-col items-center w-full">
                   <User className="h-12 w-12 text-muted-foreground mb-2" />
                   <p className="text-muted-foreground">No riders added yet.</p>
                   <Button variant="link" asChild>
                       <Link href="/dashboard/drivers/new">Add a Rider</Link>
                   </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold inline-flex items-center">
                    <Badge className="bg-primary/20 text-primary py-1 px-3 rounded-md mr-2">Recent Orders</Badge>
                </h3>
                <Link href="/dashboard/orders" className="text-sm text-primary hover:underline">View all &gt;</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedOrders.length > 0 ? (
                    displayedOrders.map((order) => (
                        <OrderCard key={order.id} order={order} onStatusChange={handleStatusChange} onOrderDeleted={handleOrderDeleted} />
                    ))
                ) : (
                    <div className="col-span-full text-center text-muted-foreground py-10">
                        <p>No recent orders.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </>
  );
}
