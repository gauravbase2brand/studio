
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Logo } from "@/components/logo";

export default function LandingHeader() {
  const navLinks = [];

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <Link href="#" className="flex items-center justify-center" prefetch={false}>
        <Logo />
        <span className="sr-only">AdminSlice</span>
      </Link>
      <nav className="ml-auto hidden gap-4 sm:gap-6 lg:flex">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-medium hover:underline underline-offset-4 text-foreground"
            prefetch={false}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-2">
        <Button asChild className="hidden lg:inline-flex">
            <Link href="/login">Get Started</Link>
        </Button>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="grid gap-4 p-4">
                <Logo />
                <nav className="grid gap-2">
                    {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="text-sm font-medium hover:underline underline-offset-4 text-foreground"
                        prefetch={false}
                    >
                        {link.label}
                    </Link>
                    ))}
                </nav>
                <Button asChild className="w-full">
                    <Link href="/login">Get Started</Link>
                </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
