

"use client"

import { allRestaurants } from "@/lib/restaurants";
import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { BarChart, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Line, ResponsiveContainer } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, PlusCircle, Star, Utensils } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";

const costUsageData = [
  { month: "Jan", orders: 186, earnings: 80 },
  { month: "Feb", orders: 305, earnings: 138 },
  { month: "Mar", orders: 237, earnings: 98 },
  { month: "Apr", orders: 73, earnings: 38 },
  { month: "May", orders: 209, earnings: 90 },
  { month: "Jun", orders: 214, earnings: 110 },
];

const customerReviews = [
    {
        name: "Olivia Martin",
        comment: "The food was absolutely delicious! Best pizza I've had in a long time. Will definitely be ordering again.",
        rating: 5,
        verified: true,
    },
    {
        name: "Liam Garcia",
        comment: "Good food, but the delivery took a bit longer than expected. Overall, a decent experience.",
        rating: 4,
        verified: false,
    }
]


export default function RestaurantDetailsPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
     const storedRestaurants = JSON.parse(localStorage.getItem("restaurants") || JSON.stringify(allRestaurants));
     const currentRestaurant = storedRestaurants.find((r) => r.id === params.id);
     
     if (currentRestaurant) {
        setRestaurant(currentRestaurant);
     } else {
        const staticRestaurant = allRestaurants.find((r) => r.id === params.id);
        if(staticRestaurant) setRestaurant(staticRestaurant);
        else notFound();
     }

     const storedDishes = JSON.parse(localStorage.getItem("dishes") || "[]");
     setMenuItems(storedDishes);
     
     const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
     setOrders(storedOrders);


  }, [params.id])


  if (!restaurant) {
    return <div>Loading...</div>;
  }

  const handleAddDishClick = () => {
    router.push(`/dashboard/restaurants/${params.id}/add-dish`);
  };

  return (
    <div className="space-y-6">
       <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/restaurants">Restaurants</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{restaurant.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card className="overflow-hidden">
            <div className="relative h-48 w-full">
                <Image src="https://placehold.co/1200x300.png" layout="fill" objectFit="cover" alt="Restaurant cover" data-ai-hint="food ingredients" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                 <div className="absolute bottom-4 left-4 flex items-center gap-4">
                    <Image src={restaurant.logo} width={80} height={80} alt="logo" className="rounded-full border-4 border-background" />
                    <div>
                        <h1 className="text-3xl font-bold text-white">{restaurant.name}</h1>
                        <p className="text-sm text-white/80">Since 2013</p>
                    </div>
                </div>
            </div>
            <CardContent className="p-4 border-t flex justify-end gap-2">
                <Button variant="outline" asChild>
                    <Link href={`/dashboard/restaurants/${params.id}/food-items`}>
                        <Utensils className="mr-2 h-4 w-4" />
                        Manage Menu
                    </Link>
                </Button>
                 <Button asChild>
                    <Link href={`/dashboard/restaurants/${params.id}/add-dish`}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Dish
                    </Link>
                </Button>
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Cost & Usage by instance type</CardTitle>
                        <Button variant="outline" size="sm">Last Day</Button>
                    </CardHeader>
                    <CardContent>
                        {costUsageData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={costUsageData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: 'hsl(var(--background))', 
                                            border: '1px solid hsl(var(--border))'
                                        }} 
                                    />
                                    <Legend iconType="circle" />
                                    <Bar dataKey="orders" fill="hsl(var(--primary))" name="Orders" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="earnings" fill="hsl(var(--chart-2))" name="Earnings" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                                No data available.
                            </div>
                        )}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent Menu Items</CardTitle>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/restaurants/${params.id}/food-items`}>
                            View All
                          </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                       <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Dish</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {menuItems.length > 0 ? menuItems.slice(0, 5).map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Image src={item.image} width={40} height={40} alt={item.name} className="rounded-md" data-ai-hint="pizza burger noodles dessert salad coffee" />
                                                <span>{item.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>${item.price.toFixed(2)}</TableCell>
                                        <TableCell>
                                             <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                                    <DropdownMenuItem>Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                             </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-muted-foreground">No menu items found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                       </Table>
                    </CardContent>
                </Card>
            </div>
             <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Seller Personal Detail</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Owner Name:</span>
                            <span>{user?.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Status:</span>
                            <Badge variant="outline" className="text-green-600 border-green-600">active</Badge>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Email:</span>
                            <span>{user?.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Contact No:</span>
                            <span>{restaurant.phone}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Orders:</span>
                            <span>{orders.length}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Location:</span>
                            <span>{restaurant.address.split(',').slice(-2).join(', ')}</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Customer Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {customerReviews.length > 0 ? (
                            <>
                                <div className="flex items-center gap-4 mb-4">
                                    <h3 className="text-4xl font-bold">4.5</h3>
                                    <div className="flex-1">
                                        <div className="flex items-center mb-1">
                                            {[...Array(5)].map((_,i) => <Star key={i} className={`h-5 w-5 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}/>)}
                                        </div>
                                        <p className="text-sm text-muted-foreground">452 Reviews</p>
                                    </div>
                                    <div>
                                        <p className="text-3xl font-bold">91%</p>
                                        <p className="text-sm text-muted-foreground">Recommended</p>
                                    </div>
                                </div>
                                <div className="space-y-2 mb-6">
                                    {[5, 4, 3, 2, 1].map(rating => (
                                        <div key={rating} className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground">{rating}</span>
                                            <div className="w-full bg-muted rounded-full h-2">
                                                <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${(rating / 5) * 80 + Math.random()*20}%`}}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-4">
                                    {customerReviews.map((review, index) => (
                                        <div key={index}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={`https://placehold.co/32x32.png?text=${review.name.charAt(0)}`} />
                                                    <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold text-sm">{review.name}</p>
                                                    {review.verified && <Badge variant="outline" className="text-xs">Verified Buyer</Badge>}
                                                </div>
                                                 <div className="flex items-center gap-1 ml-auto">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                             <div className="text-center text-muted-foreground py-8">No reviews yet.</div>
                        )}
                    </CardContent>
                </Card>
             </div>
        </div>
    </div>
  )
}

    
