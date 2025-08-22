

"use client";

import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Edit, ShoppingBag, Gift, TrendingUp, TrendingDown, Utensils, Tag, Calendar, Save, UtensilsCrossed, ChevronsUpDown, Check, X } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

const newMenuItems = []

export default function ManagePage() {
    const { toast } = useToast();
    const [title, setTitle] = useState('');
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [discountType, setDiscountType] = useState(undefined);
    const [discountValue, setDiscountValue] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [foodItemIds, setFoodItemIds] = useState([]);
    const [dishes, setDishes] = useState([]);
    const [open, setOpen] = useState(false);
    const [upcomingMenuItems, setUpcomingMenuItems] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchDishes = () => {
            const storedDishes = localStorage.getItem("dishes");
            if (storedDishes) {
                const parsedDishes = JSON.parse(storedDishes);
                setDishes(parsedDishes);
                setUpcomingMenuItems(parsedDishes.slice(0,5));
            }
        };
        fetchDishes();

        const handleStorageChange = (e) => {
            if (e.key === 'dishes') {
                fetchDishes();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);
    
    const handleInputChange = (setter, field) => (e) => {
        setter(e.target.value);
        if (errors[field]) {
            setErrors(prev => ({...prev, [field]: false}));
        }
    }
     const handleSelectChange = (setter, field) => (value) => {
        setter(value);
        if (errors[field]) {
            setErrors(prev => ({...prev, [field]: false}));
        }
    }

    const clearForm = () => {
        setTitle('');
        setCode('');
        setDescription('');
        setDiscountType(undefined);
        setDiscountValue('');
        setStartDate('');
        setEndDate('');
        setFoodItemIds([]);
        setErrors({});
    }

    const handleSaveOffer = () => {
        const newErrors = {};
        if (!title) newErrors.title = true;
        if (!code) newErrors.code = true;
        if (!discountType) newErrors.discountType = true;
        if (!discountValue) newErrors.discountValue = true;
        if (!startDate) newErrors.startDate = true;
        if (!endDate) newErrors.endDate = true;

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            toast({
                title: "Error Creating Offer",
                description: "Please fill in all the required fields to create an offer.",
                variant: "destructive",
            });
            return;
        }

    const newOffer = {
      id: `offer_${new Date().getTime()}`,
      title,
      code,
      description,
      discountType,
      discountValue: parseFloat(discountValue),
      startDate,
      endDate,
      foodItemIds,
    };

    try {
      const existingOffersString = localStorage.getItem('offers');
      const existingOffers = existingOffersString ? JSON.parse(existingOffersString) : [];
      const updatedOffers = [...existingOffers, newOffer];
      localStorage.setItem('offers', JSON.stringify(updatedOffers));
      window.dispatchEvent(new Event('storage'));


      toast({
        title: "Offer Created Successfully!",
        description: `The offer "${title}" has been saved.`,
      });
      clearForm();
    } catch (error) {
       toast({
        title: "Failed to Save Offer",
        description: "There was an error saving the offer to local storage.",
        variant: "destructive",
      });
    }
  };
  
    const handleFoodItemSelect = (id) => {
        setFoodItemIds(prev => {
            const isSelected = prev.includes(id);
            if (isSelected) {
                return prev.filter(itemId => itemId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const getToday = () => {
        return new Date().toISOString().split('T')[0];
    }


  return (
    <>
      <DashboardHeader title="Manage" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Upcoming New Menu</CardTitle>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/restaurants/1/food-items">
                    View All
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingMenuItems.length > 0 ? (
                upcomingMenuItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50">
                    <Image src={item.image} alt={item.name} width={80} height={80} className="rounded-md" data-ai-hint={item.category} />
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/restaurants/1/add-dish?id=${item.id}`}>
                          <Edit className="mr-2 h-3 w-3" />
                          Edit
                      </Link>
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center">No upcoming menu items.</p>
              )}
            </CardContent>
          </Card>
           <Card>
                <CardHeader>
                <CardTitle>Create an Offer</CardTitle>
                <CardDescription>Fill out the form to create a new promotional offer.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="offer-title">Offer Title <span className="text-destructive">*</span></Label>
                            <Input id="offer-title" placeholder="e.g. Summer Sale" value={title} onChange={handleInputChange(setTitle, 'title')} className={cn(errors.title && 'border-destructive')} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="offer-code">Offer Code <span className="text-destructive">*</span></Label>
                            <Input id="offer-code" placeholder="e.g. SUMMER50" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} className={cn(errors.code && 'border-destructive')} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="offer-description">Description</Label>
                        <Textarea id="offer-description" placeholder="Describe the offer" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Food Items</Label>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-full justify-between font-normal"
                                >
                                    <span className="truncate">
                                        {foodItemIds.length > 0
                                            ? foodItemIds.map(id => dishes.find(d => d.id === id)?.name || id).join(', ')
                                            : "Select food items..."}
                                    </span>
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                <ScrollArea className="h-72">
                                  <div className="p-2">
                                    {dishes.map((dish) => (
                                        <button
                                            key={dish.id}
                                            onClick={() => handleFoodItemSelect(dish.id)}
                                            className="w-full flex items-center gap-2 p-2 rounded-md text-sm text-foreground hover:bg-accent"
                                        >
                                            <Checkbox id={`dish-checkbox-${dish.id}`} checked={foodItemIds.includes(dish.id)} />
                                            <Label htmlFor={`dish-checkbox-${dish.id}`} className="font-normal flex-1 flex items-center gap-2 cursor-pointer text-left">
                                                <Image src={dish.image} width={20} height={20} alt={dish.name} className="rounded-sm" />
                                                {dish.name}
                                            </Label>
                                        </button>
                                    ))}
                                    </div>
                                </ScrollArea>
                            </PopoverContent>
                        </Popover>
                         <div className="flex flex-wrap gap-1 mt-2">
                            {foodItemIds.length > 0 && foodItemIds.map(id => {
                                const dish = dishes.find(d => d.id === id);
                                if (!dish) return null;
                                
                                return (
                                    <Badge key={id} variant="secondary">
                                        {dish.name}
                                        <button
                                            onClick={() => setFoodItemIds(foodItemIds.filter(fid => fid !== id))}
                                            className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                        >
                                            <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                        </button>
                                    </Badge>
                                )
                            })}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="discount-type">Discount Type <span className="text-destructive">*</span></Label>
                            <Select onValueChange={handleSelectChange(setDiscountType, 'discountType')} value={discountType}>
                                <SelectTrigger id="discount-type" className={cn(errors.discountType && 'border-destructive')}>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="percentage"><Tag className="mr-2 h-4 w-4" />Percentage</SelectItem>
                                    <SelectItem value="fixed"><Gift className="mr-2 h-4 w-4" />Fixed Amount</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="discount-value">Discount Value <span className="text-destructive">*</span></Label>
                            <Input id="discount-value" type="number" placeholder="e.g. 50 or 10" value={discountValue} onChange={handleInputChange(setDiscountValue, 'discountValue')} className={cn(errors.discountValue && 'border-destructive')} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="start-date">Start Date <span className="text-destructive">*</span></Label>
                            <Input id="start-date" type="date" value={startDate} min={getToday()} onChange={handleInputChange(setStartDate, 'startDate')} className={cn(errors.startDate && 'border-destructive')} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="end-date">End Date <span className="text-destructive">*</span></Label>
                            <Input id="end-date" type="date" value={endDate} min={startDate || getToday()} onChange={handleInputChange(setEndDate, 'endDate')} className={cn(errors.endDate && 'border-destructive')} />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={handleSaveOffer}>
                            <Save className="mr-2 h-4 w-4" />
                            Save Offer
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Right column */}
        <div className="lg:col-span-1 space-y-6">
           <div className="grid grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">New Order</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TrendingUp className="text-green-500 h-8 w-8 mb-2" />
                        <p className="text-xs text-muted-foreground">34% Payment</p>
                        <p className="font-semibold">Increase Orders</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Cancelled Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TrendingDown className="text-red-500 h-8 w-8 mb-2" />
                        <p className="text-xs text-muted-foreground">45% Payment</p>
                        <p className="font-semibold">Decrease Order</p>
                    </CardContent>
                </Card>
           </div>
           
           <Card className="text-center">
                <CardContent className="p-4">
                    <Utensils className="h-10 w-10 text-primary mx-auto mb-2" />
                    <p className="font-semibold mb-2">Add new Best food now</p>
                    <Button asChild>
                      <Link href="/dashboard/restaurants/1/add-dish">Add Food</Link>
                    </Button>
                </CardContent>
            </Card>

           <Card className="relative overflow-hidden">
                <Image src="https://placehold.co/400x300.png" width={400} height={300} alt="Special Menu" className="w-full" data-ai-hint="pasta dish" />
                <div className="absolute inset-0 bg-black/40" />
                <CardContent className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4">
                    <p className="font-bold text-lg">Today's Special Menu</p>
                     <div className="my-2 inline-block bg-white text-primary rounded-full px-3 py-1 text-sm font-bold">50% OFF</div>
                </CardContent>
           </Card>

        </div>
      </div>
    </>
  );
}
