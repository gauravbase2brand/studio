
"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "./ui/textarea";

export function AddCategoryDialog({ onCategoryAdded, children, triggerAsChild = false }) {
  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const handleAddCategory = () => {
    if (!categoryName) {
      toast({
        title: "Error",
        description: "Please enter at least one category name.",
        variant: "destructive",
      });
      return;
    }

    const categoryNames = categoryName.split(',').map(name => name.trim()).filter(name => name);
    
    if(categoryNames.length === 0) {
       toast({
        title: "Error",
        description: "Please enter a valid category name.",
        variant: "destructive",
      });
      return;
    }

    const newCategories = categoryNames.map(name => ({
      id: `cat_${new Date().getTime()}_${Math.random()}`,
      name: name,
      products: 0,
      status: "Active",
      description: description,
    }));


    try {
      const existingCategoriesString = localStorage.getItem('categories');
      const existingCategories = existingCategoriesString ? JSON.parse(existingCategoriesString) : [];
      const updatedCategories = [...newCategories, ...existingCategories];
      localStorage.setItem('categories', JSON.stringify(updatedCategories));
      window.dispatchEvent(new Event('storage')); 

      toast({
        title: "Success",
        description: `${newCategories.length} new categor${newCategories.length > 1 ? 'ies have' : 'y has'} been added.`,
      });
      
      onCategoryAdded?.();
      setOpen(false);
      setCategoryName("");
      setDescription("");

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save categories.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild={triggerAsChild}>
        {children || (
          <Button variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>
            Create one or more new categories for your dishes. Separate multiple category names with a comma.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category-name" className="text-right">
              Name(s)
            </Label>
            <Input
              id="category-name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="col-span-3"
              placeholder="e.g. Appetizers, Desserts"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category-description" className="text-right">
              Description
            </Label>
            <Textarea
              id="category-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="A short description for the categories."
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAddCategory}>Save Categories</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
