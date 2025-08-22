
"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, MoreHorizontal, Tag } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FoodItemsPage({ params }) {
  const [dishes, setDishes] = useState([]);
  const [offers, setOffers] = useState([]);
  const { toast } = useToast();

  const updateData = () => {
    try {
      const storedDishes = localStorage.getItem("dishes");
      if(storedDishes) {
        setDishes(JSON.parse(storedDishes));
      }
      
      const storedOffers = localStorage.getItem("offers");
      if(storedOffers) {
        setOffers(JSON.parse(storedOffers));
      }

    } catch (error) {
      console.error("Failed to parse data from localStorage", error);
      setDishes([]);
      setOffers([]);
    }
  };

  useEffect(() => {
    updateData();
    const handleStorageChange = (e) => {
        if (e.key === 'dishes' || e.key === 'offers') {
            updateData();
        }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleDelete = (dishId) => {
    const updatedDishes = dishes.filter(dish => dish.id !== dishId);
    setDishes(updatedDishes);
    localStorage.setItem("dishes", JSON.stringify(updatedDishes));
  };
  
  const handleStockStatusChange = (dishId, newStatus) => {
    const updatedDishes = dishes.map(dish => 
        dish.id === dishId ? { ...dish, stockStatus: newStatus } : dish
    );
    setDishes(updatedDishes);
    localStorage.setItem("dishes", JSON.stringify(updatedDishes));
    toast({
        title: "Stock Status Updated",
        description: `The stock status for the dish has been updated to "${newStatus}".`
    });
  };

  const getOfferForDish = (dishId) => {
    return offers.find(offer => offer.foodItemIds?.includes(dishId) || offer.foodItemIds?.includes('all'));
  }

  return (
    <>
      <DashboardHeader title="Food Items">
        <Button asChild>
          <Link href={`/dashboard/restaurants/${params.id}/add-dish`}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Dish
          </Link>
        </Button>
      </DashboardHeader>
      <Card>
        <CardHeader>
        <CardTitle>All Food Items</CardTitle>
        <CardDescription>Manage your existing food items and keep your stocks full.</CardDescription>
        </CardHeader>
        <CardContent>
            <TooltipProvider>
              <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead>Dish Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Stock Quantity</TableHead>
                          <TableHead>Stock Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {dishes.map((dish) => {
                          const offer = getOfferForDish(dish.id);
                          const stock = parseInt(dish.stockQuantity, 10);
                          const stockColor = isNaN(stock) ? '' : stock > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
                          return (
                          <TableRow key={dish.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <Image src={dish.image || "https://placehold.co/40x40.png"} width={40} height={40} alt={dish.name} className="rounded-md" />
                                  <div>
                                    <span>{dish.name}</span>
                                    {!isNaN(stock) && stock < 10 && (
                                        <p className="text-xs text-red-500">Please fill your inventory</p>
                                    )}
                                  </div>
                                  {offer && (
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                                                <Tag className="h-3 w-3" />
                                            </Badge>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="font-semibold">{offer.title}</p>
                                            <p className="text-sm">{offer.description}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                  )}
                                  </div>
                              </TableCell>
                              <TableCell>{dish.category}</TableCell>
                              <TableCell>${dish.price.toFixed(2)}</TableCell>
                              <TableCell>
                                  {dish.stockQuantity ? (
                                      <Badge variant="outline" className={stockColor}>{dish.stockQuantity}</Badge>
                                  ) : 'N/A'}
                              </TableCell>
                              <TableCell>
                                <Select value={dish.stockStatus || ''} onValueChange={(newStatus) => handleStockStatusChange(dish.id, newStatus)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="in-stock">In Stock</SelectItem>
                                        <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                                    </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell className="text-right">
                                  <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="icon">
                                              <MoreHorizontal className="h-4 w-4" />
                                          </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent>
                                          <DropdownMenuItem asChild>
                                            <Link href={`/dashboard/restaurants/${params.id}/add-dish?id=${dish.id}`}>Edit</Link>
                                          </DropdownMenuItem>
                                          <DropdownMenuItem onClick={() => handleDelete(dish.id)}>Delete</DropdownMenuItem>
                                      </DropdownMenuContent>
                                  </DropdownMenu>
                              </TableCell>
                          </TableRow>
                      )})}
                  </TableBody>
              </Table>
            </TooltipProvider>
        </CardContent>
      </Card>
    </>
  );
}
