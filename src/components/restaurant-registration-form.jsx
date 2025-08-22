
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RestaurantStep1 } from "@/components/restaurant-step-1";
import { RestaurantStep2 } from "@/components/restaurant-step-2";
import { RestaurantStep3 } from "@/components/restaurant-step-3";
import { RestaurantStep4 } from "@/components/restaurant-step-4";
import { Utensils, FileText, FileSignature, Building, Check, Circle, ShieldCheck } from 'lucide-react';

const steps = [
  { id: "01", name: "Restaurant Information", component: RestaurantStep1, icon: Building },
  { id: "02", name: "Menu and operational details", component: RestaurantStep2, icon: Utensils },
  { id: "03", name: "Restaurant documents", component: RestaurantStep3, icon: FileText },
  { id: "04", name: "Partner contract", component: RestaurantStep4, icon: FileSignature },
];

export function RestaurantRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const CurrentStepComponent = steps[currentStep].component;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="lg:grid lg:grid-cols-12 gap-8">
      <aside className="lg:col-span-3 mb-8 lg:mb-0">
        <Card className="p-4 sticky top-4">
            <h2 className="text-lg font-semibold mb-4 px-2">Complete your registration</h2>
            <nav className="space-y-1">
                {steps.map((step, index) => {
                    const isActive = index === currentStep;
                    const isCompleted = index < currentStep;

                    return (
                        <div key={step.id} className="flex items-start">
                            <div className="flex flex-col items-center mr-4">
                                <div
                                    className={cn(
                                    "flex h-8 w-8 items-center justify-center rounded-full text-white",
                                     isCompleted ? "bg-green-500" : isActive ? "bg-primary" : "bg-muted text-muted-foreground"
                                    )}
                                >
                                    {isCompleted ? <Check className="h-5 w-5" /> : <span className="text-sm font-bold">{step.id}</span>}
                                </div>
                                {index < steps.length - 1 && <div className="mt-1 h-10 w-px bg-border" />}
                            </div>
                            <div className={cn("pt-1.5", isActive ? "text-primary font-semibold" : isCompleted ? "text-foreground" : "text-muted-foreground")}>
                                <h3 className="text-sm">{step.name}</h3>
                                {isActive && <p className="text-xs font-normal text-muted-foreground">Continue</p>}
                            </div>
                        </div>
                    );
                })}
            </nav>
            <div className="mt-6 border-t pt-4 px-2">
                 <div className="flex items-center space-x-2">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                    <p className="text-xs text-muted-foreground">Documents required for registration</p>
                </div>
            </div>
             <div className="mt-4 border-t pt-4 px-2">
                 <p className="text-xs text-muted-foreground mb-2">Did someone refer you to this platform?</p>
                 <Button size="sm" variant="outline">Yes</Button>
            </div>
        </Card>
      </aside>
      <div className="lg:col-span-9">
        <CurrentStepComponent />
        <div className="mt-8 flex justify-end gap-4">
          {currentStep > 0 && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button>Submit</Button>
          )}
        </div>
      </div>
    </div>
  );
}
