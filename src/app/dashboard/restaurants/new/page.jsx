import { RestaurantRegistrationForm } from "@/components/restaurant-registration-form";
import { DashboardHeader } from "@/components/dashboard-header";

export default function NewRestaurantPage() {
  return (
    <>
      <DashboardHeader title="Register a new Restaurant" />
      <RestaurantRegistrationForm />
    </>
  );
}
