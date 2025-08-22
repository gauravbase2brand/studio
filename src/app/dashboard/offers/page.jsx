
"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { OfferCard } from "@/components/offer-card";

export default function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [dishes, setDishes] = useState([]);
  const { toast } = useToast();
  const router = useRouter();

  const updateOffers = () => {
    try {
      const storedOffers = localStorage.getItem("offers");
      if (storedOffers) {
        setOffers(JSON.parse(storedOffers));
      }
      const storedDishes = localStorage.getItem("dishes");
      if(storedDishes) {
        setDishes(JSON.parse(storedDishes));
      }
    } catch (error) {
      console.error("Failed to parse data from localStorage", error);
      setOffers([]);
      setDishes([]);
    }
  };

  useEffect(() => {
    updateOffers();
    const handleStorageChange = (e) => {
      if (e.key === 'offers' || e.key === 'dishes') {
        updateOffers();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleOfferDeleted = (offerId) => {
    setOffers(prevOffers => prevOffers.filter(offer => offer.id !== offerId));
  }

  return (
    <>
      <DashboardHeader title="Offers">
        <Button asChild>
          <Link href="/dashboard/offers/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Offer
          </Link>
        </Button>
      </DashboardHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.length > 0 ? (
          offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} dishes={dishes} onOfferDeleted={handleOfferDeleted} />
          ))
        ) : (
          <div className="col-span-full text-center text-muted-foreground py-10">
            <p>No offers created yet.</p>
            <p className="text-sm">Click "Add Offer" to get started.</p>
          </div>
        )}
      </div>
    </>
  );
}
