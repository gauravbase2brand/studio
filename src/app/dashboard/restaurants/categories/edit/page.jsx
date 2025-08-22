
"use client"

import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Save, X, ChevronsUpDown } from "lucide-react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";


export default function EditCategoryPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { toast } = useToast();

    const [categoryId, setCategoryId] = useState(null);
    const [categoryName, setCategoryName] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const [images, setImages] = useState([]);
    const [type, setType] = useState("veg");
    const [dishes, setDishes] = useState([]);
    const [selectedDishes, setSelectedDishes] = useState([]);
    const [openDishSelect, setOpenDishSelect] = useState(false);


    useEffect(() => {
        const storedDishes = JSON.parse(localStorage.getItem("dishes") || "[]");
        setDishes(storedDishes);

        const id = searchParams.get('id');
        if (id) {
            setCategoryId(id);
            const storedCategories = JSON.parse(localStorage.getItem("categories") || "[]");
            const category = storedCategories.find(c => c.id === id);
            if (category) {
                setCategoryName(category.name || '');
                setDescription(category.description || '');
                setStatus(category.status || 'Active');
                setImages(category.image ? [category.image] : []);
                setType(category.type || 'veg');

                // Find dishes that belong to this category
                const dishesInCategory = storedDishes.filter(dish => {
                    const dishCategories = dish.category ? dish.category.split(',').map(c => c.trim()) : [];
                    return dishCategories.includes(category.name);
                }).map(dish => dish.id);
                setSelectedDishes(dishesInCategory);
            }
        }
    }, [searchParams]);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages([reader.result]);
            };
            reader.readAsDataURL(file);
        }
    }

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    }
    
    const handleUpdateCategory = () => {
        if (!categoryName) {
            toast({
                title: "Error updating category",
                description: "Category name cannot be empty.",
                variant: "destructive",
            });
            return;
        }

        try {
            const storedCategories = JSON.parse(localStorage.getItem("categories") || "[]");
            const categoryIndex = storedCategories.findIndex(c => c.id === categoryId);

            if (categoryIndex > -1) {
                const oldCategoryName = storedCategories[categoryIndex].name;
                const updatedCategory = {
                    ...storedCategories[categoryIndex],
                    name: categoryName,
                    description: description,
                    status: status,
                    image: images[0] || 'https://placehold.co/100x100.png',
                    type: type,
                };
                storedCategories[categoryIndex] = updatedCategory;
                localStorage.setItem("categories", JSON.stringify(storedCategories));

                // Update dishes
                const storedDishes = JSON.parse(localStorage.getItem("dishes") || "[]");
                const updatedDishes = storedDishes.map(dish => {
                    let dishCategories = dish.category ? dish.category.split(',').map(c => c.trim()) : [];
                    
                    // Was this dish selected?
                    const isSelected = selectedDishes.includes(dish.id);
                    // Did this dish previously have this category?
                    const hadCategory = dishCategories.includes(oldCategoryName) || dishCategories.includes(categoryName);

                    if (isSelected && !hadCategory) {
                        // Add new category name (if it's not the same as old)
                        if(categoryName !== oldCategoryName) dishCategories = dishCategories.filter(c => c !== oldCategoryName);
                        dishCategories.push(categoryName);
                    } else if (!isSelected && hadCategory) {
                        // Remove category name
                        dishCategories = dishCategories.filter(c => c !== oldCategoryName && c !== categoryName);
                    } else if (isSelected && hadCategory && oldCategoryName !== categoryName) {
                        // Rename category
                         dishCategories = dishCategories.filter(c => c !== oldCategoryName);
                         if (!dishCategories.includes(categoryName)) {
                            dishCategories.push(categoryName);
                         }
                    }

                    return { ...dish, category: dishCategories.join(', ') };
                });
                localStorage.setItem("dishes", JSON.stringify(updatedDishes));

                window.dispatchEvent(new Event('storage'));

                toast({
                    title: "Category Updated",
                    description: `Category "${categoryName}" has been successfully updated.`,
                });
                router.push('/dashboard/restaurants/categories');
            } else {
                 toast({
                    title: "Error",
                    description: "Category not found.",
                    variant: "destructive",
                });
            }
        } catch (error) {
             toast({
                title: "Failed to Update Category",
                description: "There was an error saving the category.",
                variant: "destructive",
            });
        }
    };
    
    const handleDishSelect = (dishId) => {
        setSelectedDishes(prev => {
            const isSelected = prev.includes(dishId);
            if (isSelected) {
                return prev.filter(id => id !== dishId);
            } else {
                return [...prev, dishId];
            }
        });
    };


  return (
    <>
      <DashboardHeader title="Edit Category" />
      <div className="mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/restaurants">Restaurants</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/restaurants/categories">Categories</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit Category</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Edit Category</CardTitle>
          <CardDescription>Update the details for this dish category.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Category Images</Label>
             <Label htmlFor="image-upload"
              className="w-full h-32 border-2 border-dashed border-muted-foreground/50 rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <div className="text-center text-muted-foreground">
                <Upload className="mx-auto h-8 w-8 mb-2" />
                <p className="text-xs">Click or drag to upload</p>
              </div>
               <Input id="image-upload" type="file" className="sr-only" onChange={handleImageUpload} accept="image/*" />
            </Label>
            {images.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4 mt-4">
                    {images.map((src, index) => (
                        <div key={index} className="relative">
                            <Image src={src} alt={`Category image ${index + 1}`} width={100} height={100} className="rounded-md object-cover w-full aspect-square" />
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
          <div className="space-y-2">
            <Label htmlFor="category-name">Category Name</Label>
            <Input id="category-name" placeholder="e.g. Appetizers" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="A short description of the category." value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
           <div className="space-y-2">
                <Label>Assign Dishes</Label>
                <Popover open={openDishSelect} onOpenChange={setOpenDishSelect}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openDishSelect}
                            className="w-full justify-between font-normal"
                        >
                            <span className="truncate">
                                {selectedDishes.length > 0
                                    ? `${selectedDishes.length} dish(es) selected`
                                    : "Select dishes..."}
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
                                        onClick={() => handleDishSelect(dish.id)}
                                        className="w-full flex items-center gap-2 p-2 rounded-md text-sm text-foreground hover:bg-accent"
                                    >
                                        <Checkbox id={`dish-checkbox-${dish.id}`} checked={selectedDishes.includes(dish.id)} />
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
                    {selectedDishes.map(id => {
                        const dish = dishes.find(d => d.id === id);
                        if (!dish) return null;
                        
                        return (
                            <Badge key={id} variant="secondary">
                                {dish.name}
                                <button
                                    onClick={() => handleDishSelect(id)}
                                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                >
                                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                </button>
                            </Badge>
                        )
                    })}
                </div>
            </div>
          <div className="space-y-2">
            <Label>Type</Label>
             <RadioGroup value={type} onValueChange={setType} className="flex gap-4">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="veg" id="veg" />
                    <Label htmlFor="veg" className="font-normal">Veg</Label>
                </div>
                 <div className="flex items-center space-x-2">
                    <RadioGroupItem value="non-veg" id="non-veg" />
                    <Label htmlFor="non-veg" className="font-normal">Non-Veg</Label>
                </div>
                 <div className="flex items-center space-x-2">
                    <RadioGroupItem value="egg" id="egg" />
                    <Label htmlFor="egg" className="font-normal">Contains Egg</Label>
                </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleUpdateCategory}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
