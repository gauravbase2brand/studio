
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function LandingHero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-secondary/50">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline text-primary">
                The Ultimate Command Center for Your Food Business
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                AdminSlice provides a powerful, all-in-one dashboard to manage orders, track drivers, and optimize your
                restaurant operations with ease.
              </p>
            </div>
          </div>
          <Image
            src="https://placehold.co/600x400.png"
            width="600"
            height="400"
            alt="Admin Dashboard"
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
            data-ai-hint="dashboard food"
            priority
          />
        </div>
      </div>
    </section>
  );
}
