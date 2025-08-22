
"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/logo"
import Image from "next/image";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!email) {
        toast({
            title: "Email Required",
            description: "Please enter your email address.",
            variant: "destructive",
        });
        return;
    }
    // In a real app, you would handle the password reset logic here.
    toast({
        title: "Password Reset Link Sent",
        description: `If an account exists for ${email}, a password reset link has been sent.`,
    });
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[400px] gap-6">
            <div className="grid gap-2 text-center">
                <Logo className="justify-center"/>
                <h1 className="text-3xl font-bold">Forgot Password</h1>
                <p className="text-balance text-muted-foreground">
                    Enter your email to receive a reset link.
                </p>
            </div>
            <form onSubmit={handleResetPassword}>
              <div className="grid gap-4">
                  <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      />
                  </div>
                  <Button type="submit" className="w-full">
                      Send Reset Link
                  </Button>
              </div>
            </form>
            <div className="mt-4 text-center text-sm">
                <Link href="/login" className="underline flex items-center justify-center">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back to Sign In
                </Link>
            </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:flex lg:items-center lg:justify-center p-12">
        <Image
          src="https://placehold.co/1080x1920.png"
          alt="Image"
          width="1080"
          height="1920"
          className="h-[39.875rem] w-auto object-cover rounded-md dark:brightness-[0.2] dark:grayscale"
          data-ai-hint="healthy food"
        />
      </div>
    </div>
  )
}
