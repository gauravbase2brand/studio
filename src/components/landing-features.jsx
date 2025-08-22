
import { BarChart, Clock, MapPin, Package, Settings, Users } from "lucide-react";

export default function LandingFeatures() {
  const features = [
    {
      icon: <Package className="h-8 w-8 text-primary" />,
      title: "Order Management",
      description: "Seamlessly manage all incoming orders from a single, intuitive interface.",
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Real-time Updates",
      description: "Get live updates on order statuses and driver locations to stay ahead.",
    },
    {
      icon: <MapPin className="h-8 w-8 text-primary" />,
      title: "Driver Tracking",
      description: "Monitor your driver fleet in real-time on a live map for efficient dispatch.",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Restaurant Management",
      description: "Easily add, edit, and manage restaurant details and menus.",
    },
    {
      icon: <BarChart className="h-8 w-8 text-primary" />,
      title: "Analytics & Reports",
      description: "Gain valuable insights into your business performance with detailed analytics.",
    },
    {
      icon: <Settings className="h-8 w-8 text-primary" />,
      title: "Customizable Settings",
      description: "Configure pricing, delivery zones, and operational settings to fit your needs.",
    },
  ];

  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline text-foreground">
              Everything You Need to Succeed
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform is packed with features designed to streamline your operations, boost efficiency, and help
              your business grow.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-12">
          {features.map((feature, index) => (
            <div key={index} className="grid gap-1 text-center sm:text-left sm:flex sm:items-start sm:gap-4">
              <div className="flex justify-center mb-2 sm:mb-0">{feature.icon}</div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
