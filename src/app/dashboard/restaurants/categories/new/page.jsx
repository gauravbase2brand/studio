
"use client"

import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Upload, X, CheckCircle } from "lucide-react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { useState } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";


export default function NewCategoryPage() {
  const [images, setImages] = useState([]);
  const { toast } = useToast();
  const router = useRouter();
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState("Active");
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [newCategoryCount, setNewCategoryCount] = useState(0);
  const [type, setType] = useState("veg");
  const [error, setError] = useState(false);


  const handleImageUpload = (e) => {
      const files = Array.from(e.target.files);
      const newImages = files.map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages]);
  }

  const removeImage = (index) => {
      setImages(prev => prev.filter((_, i) => i !== index));
  }

  const handleAddCategory = () => {
    if (!categoryName) {
      setError(true);
      toast({
        title: "Error adding category",
        description: "Please enter at least one category name.",
        variant: "destructive",
      });
      return;
    }

    const categoryNames = categoryName.split(',').map(name => name.trim()).filter(name => name);
    
    if(categoryNames.length === 0) {
       setError(true);
       toast({
        title: "Error adding category",
        description: "Please enter a valid category name.",
        variant: "destructive",
      });
      return;
    }

    const newCategories = categoryNames.map(name => ({
      id: `cat_${new Date().getTime()}_${Math.random()}`,
      name: name,
      products: 0,
      status: status,
      image: images[0] || 'https://placehold.co/100x100.png',
      description: description,
      type: type,
    }));

    try {
      const existingCategoriesString = localStorage.getItem('categories');
      const existingCategories = existingCategoriesString ? JSON.parse(existingCategoriesString) : [];
      const updatedCategories = [...newCategories, ...existingCategories];
      localStorage.setItem('categories', JSON.stringify(updatedCategories));
      window.dispatchEvent(new Event('storage'));
      
      setNewCategoryCount(newCategories.length);
      setIsSuccessDialogOpen(true);

    } catch (error) {
      toast({
        title: "Failed to Save Categories",
        description: "There was an error saving the categories to local storage.",
        variant: "destructive",
      });
    }
  };

  const handleNameChange = (e) => {
    setCategoryName(e.target.value);
    if(error) {
        setError(false);
    }
  }


  return (
    <>
      <DashboardHeader title="Add New Category" />
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
              <BreadcrumbPage>Add New Category</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Add New Category</CardTitle>
          <CardDescription>Fill in the details to create a new dish category. You can add multiple categories by separating them with a comma.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Category Images</Label>
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
            <Label htmlFor="category-name">Category Name(s) <span className="text-destructive">*</span></Label>
            <Input id="category-name" placeholder="e.g. Appetizers, Desserts, Drinks" value={categoryName} onChange={handleNameChange} className={cn(error && 'border-destructive')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="A short description for the categories." value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
             <RadioGroup defaultValue="veg" onValueChange={setType} className="flex gap-4">
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
            <Select onValueChange={setStatus} value={status}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAddCategory}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Categories
          </Button>
        </CardContent>
      </Card>
      <AlertDialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
          <AlertDialogContent>
              <AlertDialogHeader className="items-center text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <AlertDialogTitle>Categories Created Successfully!</AlertDialogTitle>
                  <AlertDialogDescription>
                      {newCategoryCount} new categor{newCategoryCount > 1 ? 'ies have' : 'y has'} been added to the list.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="sm:justify-center">
                  <AlertDialogAction asChild>
                      <Button onClick={() => router.push('/dashboard/restaurants/categories')}>View Categories</Button>
                  </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
