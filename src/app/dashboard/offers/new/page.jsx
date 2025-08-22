

"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Gift, Tag, Utensils, ChevronLeft, ChevronsUpDown, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function NewOfferPage() {
  const { toast } = useToast();
  const router = useRouter();

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
  const [errors, setErrors] = useState({});

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

  useEffect(() => {
    const fetchDishes = () => {
        const storedDishes = localStorage.getItem("dishes");
        if (storedDishes) {
            setDishes(JSON.parse(storedDishes));
        }
    };
    fetchDishes();
  }, []);

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
      const updatedOffers = [newOffer, ...existingOffers];
      localStorage.setItem('offers', JSON.stringify(updatedOffers));
      window.dispatchEvent(new Event('storage'));


      toast({
        title: "Offer Created Successfully!",
        description: `The offer "${title}" has been saved.`,
      });
      router.push('/dashboard/offers');
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
      <DashboardHeader title="Create Offer">
        <Button variant="outline" asChild>
            <Link href="/dashboard/offers">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Offers
            </Link>
        </Button>
      </DashboardHeader>
      <Card>
        <CardHeader>
          <CardTitle>Offer Details</CardTitle>
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
                                    <Checkbox id={`dish-checkbox-new-${dish.id}`} checked={foodItemIds.includes(dish.id)} />
                                    <Label htmlFor={`dish-checkbox-new-${dish.id}`} className="font-normal flex-1 flex items-center gap-2 cursor-pointer text-left">
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
    </>
  );
}

    
