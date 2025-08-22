
"use client"

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Save, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function EditUserPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const { allUsers, updateUser } = useAuth();
    
    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");


    useEffect(() => {
        const userEmail = decodeURIComponent(params.id);
        if (userEmail) {
            const currentUser = allUsers.find(u => u.email === userEmail);
            if (currentUser) {
                setUser(currentUser);
                setName(currentUser.name);
                setEmail(currentUser.email);
            } else {
                toast({ title: "User not found", variant: "destructive" });
                router.push('/dashboard/users');
            }
        }
    }, [params.id, allUsers, router, toast]);

    const handleUpdateUser = () => {
        if (!name || !email) {
            toast({
                title: "Missing Information",
                description: "Please fill out all fields.",
                variant: "destructive",
            });
            return;
        }
        
        // In a real app, you would likely have a more robust way to update users.
        // This is a simplified example using the Auth context.
        updateUser({ ...user, name, email });

        toast({
            title: "Customer Updated",
            description: `${name}'s profile has been successfully updated.`
        });

        router.push('/dashboard/users');
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <DashboardHeader title="Edit Customer">
                 <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/users">
                            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Customers
                        </Link>
                    </Button>
                </div>
            </DashboardHeader>
            <Card>
                <CardHeader>
                    <CardTitle>Customer Profile</CardTitle>
                    <CardDescription>Update the customer's details below.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-lg font-semibold">{name}</h3>
                            <p className="text-sm text-muted-foreground">{email}</p>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={handleUpdateUser}>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
