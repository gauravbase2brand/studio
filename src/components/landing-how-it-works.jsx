export default function LandingHowItWorks() {
  const steps = [
    {
      step: 1,
      title: "Register Your Business",
      description: "Sign up and create your restaurant profile in minutes. Add your menu, and set your operational hours.",
    },
    {
      step: 2,
      title: "Receive Orders",
      description: "Your customers place orders through your platform, and they appear instantly on your dashboard.",
    },
    {
      step: 3,
      title: "Manage & Dispatch",
      description: "Accept orders, assign drivers, and track the entire delivery process from kitchen to customer.",
    },
    {
        step: 4,
        title: "Analyze & Grow",
        description: "Use our powerful analytics to understand your sales, customer behavior, and optimize for growth.",
    },
  ];

  return (
    <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline text-foreground">
            Get Started in 4 Easy Steps
          </h2>
          <p className="mt-4 text-muted-foreground md:text-xl/relaxed">
            Our platform is designed to be simple and intuitive. Here's how you can get up and running.
          </p>
        </div>
        <div className="relative mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          
          {steps.map((step) => (
            <div key={step.step} className="relative grid gap-4 text-center">
              <div className="relative z-10 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xl">
                {step.step}
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
