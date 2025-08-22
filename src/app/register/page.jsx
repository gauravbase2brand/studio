
"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/logo"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    if (register) {
      register({ name: fullName, email, role: role || 'RESTAURANT_OWNER' });
      router.push('/dashboard');
    }
  };


  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
       <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[400px] gap-6">
            <div className="grid gap-2 text-center">
                <Logo className="justify-center"/>
                <h1 className="text-3xl font-bold">Create an account</h1>
                <p className="text-balance text-muted-foreground">
                    Enter your information to create an account
                </p>
            </div>
            <form onSubmit={handleRegister}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="full-name">Full name</Label>
                  <Input id="full-name" placeholder="Max" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
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
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                   <Select onValueChange={setRole} value={role}>
                      <SelectTrigger id="role">
                          <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="RESTAURANT_OWNER">Restaurant Owner</SelectItem>
                          <SelectItem value="DRIVER">Driver</SelectItem>
                          <SelectItem value="SUPPORT">Support</SelectItem>
                      </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">
                  Create an account
                </Button>
              </div>
            </form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Sign in
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
            data-ai-hint="dessert spread"
          />
        </div>
    </div>
  )
}
