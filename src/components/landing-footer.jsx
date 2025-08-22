import Link from "next/link"
import { Logo } from "@/components/logo";

export default function LandingFooter() {
  return (
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
      <div className="flex items-center gap-2">
        <Logo />
      </div>
      <p className="text-xs text-muted-foreground sm:ml-4">&copy; {new Date().getFullYear()} AdminSlice. All rights reserved.</p>
      <nav className="sm:ml-auto flex gap-4 sm:gap-6">
        <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
          Terms of Service
        </Link>
        <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
          Privacy
        </Link>
      </nav>
    </footer>
  )
}
