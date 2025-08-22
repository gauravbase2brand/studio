import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UploadCloud, CalendarIcon } from "lucide-react";
import Link from "next/link";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Alert, AlertDescription } from "./ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";

export function RestaurantStep3() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Restaurant documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold">PAN details</h3>
                <p className="text-sm text-muted-foreground">Enter the PAN details of the person or company who legally owns the restaurant</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="pan-number">PAN number*</Label>
                    <Input id="pan-number" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="pan-name">Full name as per PAN*</Label>
                    <Input id="pan-name" />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="registered-address">Full address of your registered business*</Label>
                <Input id="registered-address" />
            </div>
            <div className="border-2 border-dashed rounded-lg p-6 text-center bg-accent/20 border-primary/50">
                <div className="flex justify-center items-center h-16 w-16 rounded-lg bg-white shadow-sm mx-auto">
                    <UploadCloud className="mx-auto h-8 w-8 text-primary" />
                </div>
                <p className="mt-4 text-primary font-medium">Upload your PAN</p>
                <p className="text-xs text-muted-foreground">jpeg, png or pdf formats up-to 5MB</p>
                <Link href="#" className="text-sm text-primary mt-2 block">Guidelines to upload PAN</Link>
            </div>
            <p className="text-xs text-muted-foreground">Note: Please first enter and verify all the PAN details above.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
            <h3 className="text-lg font-semibold">GST details (if applicable)</h3>
            <p className="text-sm text-muted-foreground">This should be linked to the PAN provided earlier for tax calculations</p>
        </CardHeader>
        <CardContent>
            <div className="space-y-2">
                <Label>Are you GST registered?</Label>
                <RadioGroup defaultValue="no" className="flex gap-4">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="gst-yes" />
                        <Label htmlFor="gst-yes" className="font-normal">Yes</Label>
                    </div>
                     <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="gst-no" />
                        <Label htmlFor="gst-no" className="font-normal">No</Label>
                    </div>
                </RadioGroup>
            </div>
        </CardContent>
      </Card>
      <Card>
          <CardHeader>
              <h3 className="text-lg font-semibold">FSSAI details</h3>
              <p className="text-sm text-muted-foreground">This is required to comply with regulations on food safety</p>
          </CardHeader>
          <CardContent className="space-y-6">
              <Alert className="bg-green-50 border-green-200 text-green-800">
                  <AlertDescription>
                      <p className="font-semibold mb-2">FSSAI requirements</p>
                      <ul className="list-disc pl-5 space-y-1 text-xs">
                          <li>The name on the FSSAI certificate should match either the restaurant's name or the name on the PAN card.</li>
                          <li>The address on the FSSAI certificate should match the restaurant's address.</li>
                      </ul>
                  </AlertDescription>
              </Alert>
              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label htmlFor="fssai-number">FSSAI number*</Label>
                      <Input id="fssai-number" />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="expiry-date">Expiry date*</Label>
                      <div className="relative">
                        <Input id="expiry-date" type="text" placeholder="Select date" />
                        <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                  </div>
              </div>
              <div className="border-2 border-dashed rounded-lg p-6 text-center bg-accent/20 border-primary/50">
                  <div className="flex justify-center items-center h-16 w-16 rounded-lg bg-white shadow-sm mx-auto">
                      <UploadCloud className="mx-auto h-8 w-8 text-primary" />
                  </div>
                  <p className="mt-4 text-primary font-medium">Upload your FSSAI license</p>
                  <p className="text-xs text-muted-foreground">jpeg, png or pdf formats up-to 5MB</p>
                  <Link href="#" className="text-sm text-primary mt-2 block">FSSAI guidelines to upload</Link>
              </div>
          </CardContent>
      </Card>
      <Card>
          <CardHeader>
              <h3 className="text-lg font-semibold">Bank account details</h3>
              <p className="text-sm text-muted-foreground">This is where Zomato will deposit your earnings</p>
          </CardHeader>
          <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label htmlFor="bank-account">Bank account number*</Label>
                      <Input id="bank-account" />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="re-bank-account">Re-enter bank account number*</Label>
                      <Input id="re-bank-account" />
                  </div>
              </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label htmlFor="ifsc-code">Enter IFSC code*</Label>
                      <Input id="ifsc-code" />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="account-type">Account Type</Label>
                      <Select>
                          <SelectTrigger id="account-type">
                              <SelectValue placeholder="Select account type" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="savings">Savings</SelectItem>
                              <SelectItem value="current">Current</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
              </div>
              <Button className="w-full" variant="outline">Verify bank account details</Button>
          </CardContent>
      </Card>
    </div>
  );
}
