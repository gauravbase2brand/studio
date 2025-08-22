import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin } from "lucide-react";

export function RestaurantStep1() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Restaurant Information</h2>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Restaurant name</CardTitle>
          <CardDescription>Customers will see this name on AdminSlice</CardDescription>
        </CardHeader>
        <CardContent>
          <Label htmlFor="restaurant-name" className="sr-only">Restaurant name</Label>
          <Input id="restaurant-name" placeholder="Restaurant name" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Owner details</CardTitle>
          <CardDescription>
            AdminSlice will use these details for all business communications and updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="full-name">Full name</Label>
                <Input id="full-name" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" type="email" defaultValue="gauravbase2brand@gmail.com" />
            </div>
          </div>
          <div className="space-y-2">
             <Label htmlFor="phone-number">Phone number</Label>
            <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 bg-secondary text-muted-foreground text-sm">+91</span>
                <Input id="phone-number" type="tel" className="rounded-l-none" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="whatsapp-updates" />
            <Label htmlFor="whatsapp-updates" className="font-normal">Get restaurant updates via Whatsapp</Label>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Restaurant's primary contact number</CardTitle>
          <CardDescription>
            Customers, delivery partners and AdminSlice may call on this number for order support
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="space-y-2">
             <Label htmlFor="primary-contact">Primary Contact Number</Label>
             <Input id="primary-contact" type="tel" />
           </div>
           <div className="flex items-center space-x-2">
              <Checkbox id="same-as-owner" defaultChecked />
              <Label htmlFor="same-as-owner" className="font-normal">Same as owner mobile number</Label>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Add your restaurant's location for order pick-up</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="relative">
              <Input placeholder="Search for area, street name" className="pl-10" />
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            <div className="aspect-[2/1] bg-muted rounded-lg flex items-center justify-center">
              <img src="https://placehold.co/600x300.png" alt="Map placeholder" className="w-full h-full object-cover rounded-lg" data-ai-hint="map location" />
            </div>
             <div>
                <CardTitle className="text-lg">Restaurant address details</CardTitle>
                <CardDescription>Address details are basis the restaurant location mentioned above</CardDescription>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="shop-no">Shop no. / building no. (optional)</Label>
                    <Input id="shop-no" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="floor">Floor / tower (optional)</Label>
                    <Input id="floor" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="area">Area / Sector / Locality*</Label>
                    <Input id="area" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" defaultValue="Delhi NCR" />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="landmark">Add any nearby landmark (optional)</Label>
                <Input id="landmark" />
            </div>
            <div className="bg-green-50 border border-green-200 text-green-800 text-xs rounded-md p-3">
                Please ensure that this address is the same as mentioned on your FSSAI license.
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
