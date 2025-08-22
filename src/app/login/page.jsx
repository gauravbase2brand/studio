
"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/logo"
import { useAuth } from "@/lib/auth";
import Image from "next/image";
import { useState } from "react";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = (e) => {
    e.preventDefault();
    // In a real app, you'd validate the password. Here, we just need the email.
    login(email);
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[400px] gap-6">
            <div className="grid gap-2 text-center">
                <Logo className="justify-center"/>
                <h1 className="text-3xl font-bold">Sign In</h1>
                <p className="text-balance text-muted-foreground">
                    Sign in to access your dashboard
                </p>
            </div>
            <form onSubmit={handleLogin}>
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
                  <div className="grid gap-2">
                      <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      </div>
                      <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                      <div className="text-right">
                         <Link
                          href="/forgot-password"
                          className="inline-block text-sm underline"
                         >
                          Forgot your password?
                         </Link>
                      </div>
                  </div>
                  <Button type="submit" className="w-full">
                      Sign In
                  </Button>
              </div>
            </form>
            <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="underline">
                    Sign up
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
          data-ai-hint="burgers and fries"
        />
      </div>
    </div>
  )
}
