
"use client"

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const initialCategories = []

export default function DishCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const { toast } = useToast();

  const updateData = () => {
    try {
      const storedCategories = localStorage.getItem("categories");
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      } else {
        setCategories(initialCategories);
        localStorage.setItem("categories", JSON.stringify(initialCategories));
      }
       const storedDishes = localStorage.getItem("dishes");
        if (storedDishes) {
            setDishes(JSON.parse(storedDishes));
        }
    } catch (error) {
      console.error("Failed to parse data from localStorage", error);
      setCategories(initialCategories);
    }
  };

  useEffect(() => {
    updateData();
    const handleStorageChange = (e) => {
      if (e.key === 'categories' || e.key === 'dishes') {
        updateData();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleDelete = (categoryId) => {
    const updatedCategories = categories.filter(cat => cat.id !== categoryId);
    setCategories(updatedCategories);
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
  };
  
  const handleStatusChange = (categoryId, newStatus) => {
    const updatedCategories = categories.map(cat => 
        cat.id === categoryId ? { ...cat, status: newStatus } : cat
    );
    setCategories(updatedCategories);
    localStorage.setItem("categories", JSON.stringify(updatedCategories));
    toast({
        title: "Category Status Updated",
        description: `The category status has been updated to "${newStatus}".`
    });
  };

  
  const getProductCount = (categoryName) => {
    if (!dishes) return 0;
    return dishes.filter(dish => {
        const dishCategories = dish.category ? dish.category.split(',').map(c => c.trim()) : [];
        return dishCategories.includes(categoryName);
    }).length;
  }
  
  const typeVariantMap = {
    "veg": "bg-green-100 text-green-800 border-green-200",
    "non-veg": "bg-red-100 text-red-800 border-red-200",
    "egg": "bg-yellow-100 text-yellow-800 border-yellow-200",
  };

  return (
    <>
      <DashboardHeader title="Dish Categories">
        <Button asChild>
          <Link href="/dashboard/restaurants/categories/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Category
          </Link>
        </Button>
      </DashboardHeader>
      <Card>
        <CardHeader>
        <CardTitle>All Categories</CardTitle>
        <CardDescription>Manage your existing dish categories.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Category Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Total Products</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.length > 0 ? (
                        categories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell className="font-medium">{category.name}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={typeVariantMap[category.type]}>
                                        {category.type === 'non-veg' ? 'Non-Veg' : category.type === 'egg' ? 'Egg' : 'Veg'}
                                    </Badge>
                                </TableCell>
                                <TableCell>{getProductCount(category.name)}</TableCell>
                                <TableCell>
                                  <Select value={category.status} onValueChange={(newStatus) => handleStatusChange(category.id, newStatus)}>
                                      <SelectTrigger className="w-[120px]">
                                          <SelectValue placeholder="Select status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                          <SelectItem value="Active">Active</SelectItem>
                                          <SelectItem value="Inactive">Inactive</SelectItem>
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
                                            <Link href={`/dashboard/restaurants/categories/edit?id=${category.id}&name=${encodeURIComponent(category.name)}`}>Edit</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDelete(category.id)}>Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground">
                                No categories created yet.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </>
  );
}
