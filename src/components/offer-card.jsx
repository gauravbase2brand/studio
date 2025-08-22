
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash, Tag, Gift, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export function OfferCard({ offer, dishes, onOfferDeleted }) {
  const { toast } = useToast();
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState("");
  const [isOfferActive, setIsOfferActive] = useState(false);
  const [offerStatus, setOfferStatus] = useState(""); // Can be "Upcoming", "Active", "Expired"

  useEffect(() => {
    const calculateTimeLeft = () => {
        const now = new Date();
        const startDate = new Date(offer.startDate);
        const endDate = new Date(offer.endDate);
        
        if (now < startDate) {
            setIsOfferActive(false);
            setOfferStatus("Upcoming");
            const days = Math.ceil((startDate - now) / (1000 * 60 * 60 * 24));
            setTimeLeft(`Starts in ${days} day${days > 1 ? 's' : ''}`);
            return;
        }

        if (now > endDate) {
            setIsOfferActive(false);
            setOfferStatus("Expired");
            setTimeLeft("Expired");
            return;
        }

        setIsOfferActive(true);
        setOfferStatus("Active");
        const difference = endDate.getTime() - now.getTime();

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        
        let timeLeftString = "";
        if (days > 0) timeLeftString += `${days}d `;
        if (hours > 0) timeLeftString += `${hours}h `;
        if (minutes > 0) timeLeftString += `${minutes}m `;
        
        setTimeLeft(timeLeftString.trim() ? `${timeLeftString.trim()} left` : 'Expires soon');
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [offer.startDate, offer.endDate]);


  const getOfferValue = (offer) => {
    if (offer.discountType === 'percentage') {
        return `${offer.discountValue}% OFF`;
    }
    return `$${offer.discountValue.toFixed(2)} OFF`;
  }
  
  const getDishName = (foodItemIds) => {
    if (!foodItemIds || foodItemIds.length === 0) return 'N/A';
    if (foodItemIds.includes('all')) return 'All Items';
    
    const names = foodItemIds.map(id => {
        const dish = dishes.find(d => d.id === id);
        return dish ? dish.name : null;
    }).filter(Boolean);

    if (names.length === 0) return 'Selected Items';
    return names.join(', ');
  }

  const handleDelete = () => {
    const allOffers = JSON.parse(localStorage.getItem('offers') || '[]');
    const updatedOffers = allOffers.filter(o => o.id !== offer.id);
    localStorage.setItem("offers", JSON.stringify(updatedOffers));
    if (onOfferDeleted) {
      onOfferDeleted(offer.id);
    } else {
      window.dispatchEvent(new Event('storage'));
    }
    toast({
      title: "Offer Deleted",
      description: `Offer "${offer.title}" has been deleted.`,
    });
  }
  
  const handleCardClick = (e) => {
    // Don't navigate if the user clicks on the dropdown menu trigger or its children
    if (e.target.closest('[data-radix-dropdown-menu-trigger]') || e.target.closest('[data-radix-dropdown-menu-content]')) {
        e.stopPropagation();
        return;
    }
    router.push(`/dashboard/offers/edit/${offer.id}`);
  };

  const foodIds = offer.foodItemIds || (offer.foodItemId ? [offer.foodItemId] : []);
  
  const statusColor = {
      Active: "text-green-600",
      Upcoming: "text-blue-600",
      Expired: "text-red-600"
  }

  return (
    <Card 
        className="hover:shadow-md transition-shadow cursor-pointer"
        onClick={handleCardClick}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start">
             <div className="space-y-1 block group">
                <h3 className="font-semibold text-base group-hover:text-primary">{offer.title}</h3>
                <p className="text-xs text-muted-foreground">Code: <span className="font-mono text-primary">{offer.code}</span></p>
             </div>
            <AlertDialog>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuItem onClick={(e) => {e.stopPropagation(); router.push(`/dashboard/offers/edit/${offer.id}`)}}>
                            <Edit className="mr-2 h-4 w-4"/>Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="text-destructive" onSelect={(e) => e.stopPropagation()}><Trash className="mr-2 h-4 w-4"/>Delete</DropdownMenuItem>
                        </AlertDialogTrigger>
                    </DropdownMenuContent>
                </DropdownMenu>
                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the offer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={(e) => { e.stopPropagation(); handleDelete(); }}>Yes, delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
        
        <div className="flex items-center gap-2">
            {offer.discountType === 'percentage' ? <Tag className="h-4 w-4 text-primary" /> : <Gift className="h-4 w-4 text-primary" />}
            <span className="font-semibold">{getOfferValue(offer)}</span>
        </div>

        <div className="text-xs text-muted-foreground">
            <p className="truncate">Applies to: <span className="font-medium text-foreground">{getDishName(foodIds)}</span></p>
            <div className={cn("flex items-center gap-1.5 font-medium mt-1", statusColor[offerStatus])}>
                <Clock className="h-3.5 w-3.5" />
                <span>{timeLeft}</span>
            </div>
        </div>
      
      </CardContent>
    </Card>
  );
}
