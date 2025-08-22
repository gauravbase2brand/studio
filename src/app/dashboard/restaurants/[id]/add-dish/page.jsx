
"use client"

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon, Upload, PlusCircle, X, Save, ChevronsUpDown, Check } from "lucide-react";
import Image from "next/image";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { DashboardHeader } from "@/components/dashboard-header";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { AddCategoryDialog } from "@/components/add-category-dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AddDishPage({ params }) {
    const { toast } = useToast();
    const [saleStartDate, setSaleStartDate] = useState();
    const [saleEndDate, setSaleEndDate] = useState();
    const searchParams = useSearchParams();
    const router = useRouter();

    const [dishId, setDishId] = useState(null);
    const [productName, setProductName] = useState('');
    const [productCategories, setProductCategories] = useState([]);
    const [sellingPrice, setSellingPrice] = useState('');
    const [description, setDescription] = useState('');
    const [longDescription, setLongDescription] = useState('');
    const [images, setImages] = useState([]);
    const [status, setStatus] = useState("Active");
    const [categories, setCategories] = useState([]);
    const [open, setOpen] = useState(false);
    const [pageTitle, setPageTitle] = useState("Add Dish");
    const [stockQuantity, setStockQuantity] = useState('');
    const [stockStatus, setStockStatus] = useState();
    const [deliveryType, setDeliveryType] = useState();
    const [errors, setErrors] = useState({});
    

    useEffect(() => {
        const id = searchParams.get('id');
        if (id) {
            setDishId(id);
            setPageTitle("Edit Dish");
            const storedDishes = JSON.parse(localStorage.getItem("dishes") || "[]");
            const dish = storedDishes.find(d => d.id === id);
            if (dish) {
                setProductName(dish.name || '');
                setProductCategories(dish.category ? dish.category.split(',').map(c => c.trim()).filter(Boolean) : []);
                setDescription(dish.description || '');
                setLongDescription(dish.longDescription || '');
                setSellingPrice(dish.price ? String(dish.price) : '');
                setImages(dish.image ? [dish.image] : []);
                setStatus(dish.status || 'Active');
                setStockQuantity(dish.stockQuantity || '');
                setStockStatus(dish.stockStatus);
                setDeliveryType(dish.deliveryType);
                if (dish.saleStartDate) setSaleStartDate(new Date(dish.saleStartDate));
                if (dish.saleEndDate) setSaleEndDate(new Date(dish.saleEndDate));
            }
        } else {
            const name = searchParams.get('name');
            const category = searchParams.get('category');
            const desc = searchParams.get('description');

            if (name) setProductName(decodeURIComponent(name));
            if (category) setProductCategories(decodeURIComponent(category).split(',').map(c => c.trim()).filter(Boolean));
            if (desc) setDescription(decodeURIComponent(desc));
        }
    }, [searchParams]);

    const fetchCategories = () => {
        const storedCategories = localStorage.getItem("categories");
        if (storedCategories) {
            setCategories(JSON.parse(storedCategories));
        }
    };

    useEffect(() => {
        fetchCategories();
        
        const handleStorageChange = (e) => {
            if (e.key === 'categories') {
                fetchCategories();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        const newImages = files.map(file => URL.createObjectURL(file));
        setImages(prev => [...prev, ...newImages]);
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    }
    
    const validateFields = () => {
        const newErrors = {};
        if (!productName) newErrors.productName = true;
        if (productCategories.length === 0) newErrors.productCategories = true;
        if (!sellingPrice) newErrors.sellingPrice = true;
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleAddDish = () => {
        if (!validateFields()) {
            toast({
                title: "Error saving dish",
                description: "Please fill in all required fields.",
                variant: "destructive",
            });
            return;
        }

        const dishData = {
            id: dishId || `dish_${new Date().getTime()}`,
            name: productName,
            category: productCategories.join(', '),
            price: parseFloat(sellingPrice),
            description,
            longDescription,
            status,
            image: images[0] || "https://placehold.co/40x40.png",
            stockQuantity: stockQuantity,
            stockStatus: stockStatus,
            deliveryType,
            saleStartDate: saleStartDate ? saleStartDate.toISOString() : null,
            saleEndDate: saleEndDate ? saleEndDate.toISOString() : null,
        };

        try {
            const storedDishes = JSON.parse(localStorage.getItem("dishes") || "[]");
            if (dishId) {
                // Update existing dish
                const dishIndex = storedDishes.findIndex(d => d.id === dishId);
                storedDishes[dishIndex] = dishData;
                toast({
                    title: "Dish Updated Successfully!",
                    description: `The dish "${productName}" has been updated.`,
                });
            } else {
                // Add new dish
                storedDishes.unshift(dishData);
                toast({
                    title: "Dish Added Successfully!",
                    description: `The dish "${productName}" has been added.`,
                });
            }
            localStorage.setItem("dishes", JSON.stringify(storedDishes));
            window.dispatchEvent(new Event('storage'));
            router.push(`/dashboard/restaurants/${params.id}/food-items`);
        } catch (error) {
            console.error("Error saving to localStorage: ", error);
            toast({
                title: "Failed to Save Dish",
                description: "There was an error saving the dish.",
                variant: "destructive",
            });
        }
    };
    
    const handleCategorySelect = (categoryName) => {
        setProductCategories(prev => {
            const isAlreadySelected = prev.includes(categoryName);
            if (isAlreadySelected) {
              return prev.filter(c => c !== categoryName);
            } else {
              return [...prev, categoryName];
            }
        });
        if (errors.productCategories) {
            setErrors(prev => ({...prev, productCategories: false}));
        }
    };
    
    const handleInputChange = (setter, field) => (e) => {
        setter(e.target.value);
        if (errors[field]) {
            setErrors(prev => ({...prev, [field]: false}));
        }
    }
    
    const clearForm = () => {
        setProductName('');
        setProductCategories([]);
        setSellingPrice('');
        setDescription('');
        setLongDescription('');
        setImages([]);
        setStatus("Active");
        setStockQuantity('');
        setStockStatus(undefined);
        setDeliveryType(undefined);
        setSaleStartDate(undefined);
        setSaleEndDate(undefined);
        setErrors({});
        toast({
            title: "Form Cleared",
            description: "All fields have been reset.",
        });
    }

  return (
    <div className="space-y-6">
      <DashboardHeader title={pageTitle} />
       <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/restaurants">Restaurants</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/dashboard/restaurants/${params.id}`}>Restaurant Details</BreadcrumbLink>
            </BreadcrumbItem>
             <BreadcrumbSeparator />
             <BreadcrumbItem>
              <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <CardHeader>
          <CardTitle>Add a New Dish</CardTitle>
          <CardDescription>Fill out the form below to add a new dish to your menu.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label>Dish Images</Label>
                    <Label
                      htmlFor="image-upload"
                      className="w-full h-32 border-2 border-dashed border-muted-foreground/50 rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <div className="text-center text-muted-foreground">
                        <Upload className="mx-auto h-8 w-8 mb-2" />
                        <p className="text-sm">Click or drag to upload</p>
                      </div>
                      <Input id="image-upload" type="file" multiple className="sr-only" onChange={handleImageUpload} accept="image/*" />
                    </Label>
                    {images.length > 0 && (
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4 mt-4">
                            {images.map((src, index) => (
                                <div key={index} className="relative">
                                    <Image src={src} alt={`Dish image ${index + 1}`} width={100} height={100} className="rounded-md object-cover w-full aspect-square" />
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-1 right-1 h-6 w-6"
                                        onClick={() => removeImage(index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="product-name">Product Name <span className="text-destructive">*</span></Label>
                        <Input id="product-name" placeholder="Product Name" value={productName} onChange={handleInputChange(setProductName, 'productName')} className={cn(errors.productName && "border-destructive")} />
                    </div>
                    <div className="space-y-2">
                        <Label>Product Category <span className="text-destructive">*</span></Label>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className={cn("w-full justify-between font-normal", errors.productCategories && "border-destructive")}
                                >
                                    <span className="truncate">
                                      {productCategories.length > 0
                                        ? productCategories.join(", ")
                                        : "Select categories..."}
                                    </span>
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                <ScrollArea className="h-72">
                                  <div className="p-2">
                                    {categories.map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={() => handleCategorySelect(category.name)}
                                            className="w-full flex items-center gap-2 p-2 rounded-md text-sm text-foreground hover:bg-accent"
                                        >
                                            <Checkbox id={`category-checkbox-${category.id}`} checked={productCategories.includes(category.name)} />
                                            <Label htmlFor={`category-checkbox-${category.id}`} className="font-normal flex-1 cursor-pointer text-left">
                                                {category.name}
                                            </Label>
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => {
                                            document.getElementById('add-category-dialog-trigger')?.click();
                                            setOpen(false);
                                        }}
                                        className="w-full flex items-center gap-2 p-2 rounded-md text-sm text-foreground hover:bg-accent"
                                    >
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Create New
                                    </button>
                                    </div>
                                </ScrollArea>
                            </PopoverContent>
                        </Popover>
                         <div className="flex flex-wrap gap-1 mt-2">
                            {productCategories.map(category => (
                                <Badge key={category} variant="secondary">
                                    {category}
                                    <button
                                        onClick={() => setProductCategories(productCategories.filter(c => c !== category))}
                                        className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    >
                                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                        <AddCategoryDialog onCategoryAdded={fetchCategories}>
                           <button id="add-category-dialog-trigger" className="hidden"></button>
                        </AddCategoryDialog>
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="selling-price">Selling Price <span className="text-destructive">*</span></Label>
                        <Input id="selling-price" placeholder="Selling Price" type="number" value={sellingPrice} onChange={handleInputChange(setSellingPrice, 'sellingPrice')} className={cn(errors.sellingPrice && "border-destructive")} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="cost-price">Cost Price</Label>
                        <Input id="cost-price" placeholder="Cost Price" type="number" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="stock-quantity">Stock Quantity</Label>
                        <Input id="stock-quantity" placeholder="Quantity in Stock" type="number" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="delivery-type">Delivery Type</Label>
                        <Select onValueChange={setDeliveryType} value={deliveryType}>
                            <SelectTrigger id="delivery-type">
                                <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pickup">Pickup</SelectItem>
                                <SelectItem value="delivery">Delivery</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="short Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="long-description">Product Long Description</Label>
                    <Textarea id="long-description" placeholder="Add a long description for your product" rows={6} value={longDescription} onChange={(e) => setLongDescription(e.target.value)} />
                </div>
                <div className="flex justify-end gap-2 mt-6">
                    <Button variant="ghost" onClick={clearForm}>Clear</Button>
                    <Button onClick={handleAddDish}>
                        <Save className="mr-2 h-4 w-4" />
                        Save
                    </Button>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
