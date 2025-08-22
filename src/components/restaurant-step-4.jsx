import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export function RestaurantStep4() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Partner Contract</CardTitle>
        <CardDescription>
          Please review and accept the partner contract to proceed.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border rounded-md p-4 max-h-60 overflow-y-auto space-y-2 text-sm text-muted-foreground">
          <p>This Partner Agreement ("Agreement") is made and entered into by and between AdminSlice ("Company") and you ("Partner").</p>
          <p>1. **Scope of Partnership**. Partner agrees to list their restaurant on the Company's platform for food ordering and delivery services.</p>
          <p>2. **Responsibilities**. Partner is responsible for maintaining menu accuracy, preparing orders promptly, and ensuring food quality. Company is responsible for providing the ordering platform, processing payments, and facilitating delivery.</p>
          <p>3. **Commission**. Company will charge a commission fee of X% on all orders processed through the platform. This fee will be deducted from the payout to the Partner.</p>
          <p>4. **Term and Termination**. This Agreement shall commence on the date of acceptance and continue until terminated by either party with 30 days written notice.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" />
          <Label htmlFor="terms">
            I have read and agree to the Partner Contract.
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
