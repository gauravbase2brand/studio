import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "./ui/button";
import Link from "next/link";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function RestaurantStep2() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Restaurant delivery timings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="open-time">Open time</Label>
              <Select defaultValue="09:30 AM">
                <SelectTrigger id="open-time">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:30 AM">09:30 AM</SelectItem>
                  <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                  <SelectItem value="10:30 AM">10:30 AM</SelectItem>
                  <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="close-time">Close time</Label>
              <Select defaultValue="06:45 PM">
                <SelectTrigger id="close-time">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="06:45 PM">06:45 PM</SelectItem>
                  <SelectItem value="09:30 PM">09:30 PM</SelectItem>
                  <SelectItem value="10:00 PM">10:00 PM</SelectItem>
                  <SelectItem value="10:30 PM">10:30 PM</SelectItem>
                  <SelectItem value="11:00 PM">11:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Mark open days</Label>
            <p className="text-sm text-muted-foreground">
              Don&apos;t forget to uncheck your off-day
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              {days.map((day) => (
                <div key={day} className="flex items-center space-x-2">
                  <Checkbox id={day.toLowerCase()} defaultChecked />
                  <Label htmlFor={day.toLowerCase()} className="font-normal">
                    {day}
                  </Label>
                </div>
              ))}
            </div>
            <div className="text-right mt-2">
                <p className="text-sm text-muted-foreground">Have separate day wise timings? <Link href="#" className="text-primary">Add day wise slots</Link></p>
            </div>
          </div>
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
          <CardTitle>Restaurant dining timings</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="flex items-center space-x-2">
              <Checkbox id="same-timings" defaultChecked />
              <Label htmlFor="same-timings" className="font-normal">
                My dining timings are same as delivery timings
              </Label>
            </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Select the device type you will use for online ordering</CardTitle>
        </CardHeader>
        <CardContent>
            <RadioGroup defaultValue="mobile-app">
                <div className="border rounded-lg p-4 flex items-center justify-between">
                    <Label htmlFor="mobile-app" className="flex items-center gap-4 cursor-pointer">
                        <RadioGroupItem value="mobile-app" id="mobile-app" />
                        <span>Zomato restaurant partner mobile app [Android Only]</span>
                    </Label>
                    <div className="w-20 h-16 bg-muted rounded-md" data-ai-hint="mobile app"></div>
                </div>
            </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
}
