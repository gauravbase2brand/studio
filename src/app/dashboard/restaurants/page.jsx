
"use client";

import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { allRestaurants } from "@/lib/restaurants";
import { RestaurantCard } from "@/components/restaurant-card";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useEffect, useState } from "react";

export default function RestaurantsPage() {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const storedRestaurants = localStorage.getItem("restaurants");
    if(storedRestaurants) {
      setRestaurants(JSON.parse(storedRestaurants));
    }
  }, []);

  if (user?.role !== 'SUPER_ADMIN') {
    return (
      <div className="flex items-center justify-center h-full">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You do not have permission to view this page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <>
      <DashboardHeader title="Restaurants List">
        <Button size="sm" asChild>
          <Link href="/dashboard/restaurants/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Restaurant
          </Link>
        </Button>
      </DashboardHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
        {restaurants.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-10">
            <p>No restaurants found.</p>
            <p className="text-sm">Click "Add Restaurant" to get started.</p>
          </div>
        )}
      </div>

      <div className="mt-8">
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                 <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext href="#" />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
      </div>
    </>
  );
}
