
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { Separator } from "./ui/separator";
import Link from "next/link";

export function RestaurantCard({ restaurant }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col items-center text-center">
            <Image
                src={restaurant.logo}
                alt={`${restaurant.name} logo`}
                width={64}
                height={64}
                className="rounded-full mb-4"
            />
            <h3 className="text-lg font-bold">{restaurant.name}</h3>
            <p className="text-sm text-muted-foreground">{restaurant.owner}</p>
        </div>

        <div className="flex justify-around my-4 text-center">
            <div>
                <p className="text-lg font-bold text-primary">{restaurant.totalProducts}</p>
                <p className="text-xs text-muted-foreground">Total Product</p>
            </div>
             <div>
                <p className="text-lg font-bold text-primary">{restaurant.totalSales}</p>
                <p className="text-xs text-muted-foreground">Total Sales</p>
            </div>
        </div>

        <Separator className="my-4" />
        
        <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{restaurant.address}</span>
            </div>
            <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <span>{restaurant.email}</span>
            </div>
             <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <span>{restaurant.phone}</span>
            </div>
        </div>

        <Button className="w-full mt-4" asChild>
            <Link href={`/dashboard/restaurants/${restaurant.id}`}>View Details</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
