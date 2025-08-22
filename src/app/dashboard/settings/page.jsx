

"use client";

import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Download, HelpCircle, LogOut, Send, BellRing, Wallet, CreditCard, Banknote, Landmark, Upload, ChevronDown, Edit, Save } from "lucide-react";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";


function ProfileTab() {
    const { user, logout, updateUser } = useAuth();
    const { toast } = useToast();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [isEditing, setIsEditing] = useState(false);
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);
    
    const handleSaveProfile = () => {
        if (user && (name !== user.name || email !== user.email)) {
            updateUser({ ...user, name, email });
            toast({
                title: "Profile Updated",
                description: "Your profile details have been updated.",
            });
        }
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
        setIsEditing(false);
    }
    
    const capitalize = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    const handlePasswordChange = () => {
        if (newPassword !== confirmPassword) {
            toast({
                title: "Error",
                description: "New passwords do not match.",
                variant: "destructive",
            });
            return;
        }
        if (!newPassword || !oldPassword) {
             toast({
                title: "Error",
                description: "Password fields cannot be empty.",
                variant: "destructive",
            });
            return;
        }
        // In a real app, you'd have more complex logic here
        console.log("Password changed successfully (mock)");
        toast({
            title: "Password Updated",
            description: "Your password has been changed successfully.",
        });
        setIsPasswordDialogOpen(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between">
                <div>
                    <CardTitle>My Profile</CardTitle>
                    <CardDescription>Update your personal details and manage your account.</CardDescription>
                </div>
                {!isEditing ? (
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                        <Button onClick={handleSaveProfile}>
                            <Save className="mr-2 h-4 w-4" />
                            Save
                        </Button>
                    </div>
                )}
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={`https://placehold.co/80x80.png?text=${user?.name.charAt(0)}`} alt={user?.name} />
                        <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                        <h3 className="text-lg font-semibold">{capitalize(user?.name)}</h3>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={!isEditing} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} disabled />
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Security</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div>
                                <h4 className="font-semibold">Change Password</h4>
                                <p className="text-sm text-muted-foreground">Set a unique password to protect your account.</p>
                            </div>
                             <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline">Change</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Change Password</DialogTitle>
                                        <DialogDescription>
                                            Enter your old and new password to update it.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="old-password">Old Password</Label>
                                            <Input id="old-password" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="new-password">New Password</Label>
                                            <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                                            <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handlePasswordChange}>Save changes</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div>
                                <h4 className="font-semibold">Two-Step Verification</h4>
                                <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                            </div>
                            <Switch />
                        </div>
                    </CardContent>
                </Card>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full sm:w-auto">Logout</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader className="items-center text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                                <LogOut className="h-6 w-6 text-destructive" />
                            </div>
                            <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                            <AlertDialogDescription>
                                You will be returned to the login page and will need to sign in again.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="sm:justify-center">
                            <AlertDialogCancel asChild>
                                <Button variant="outline" className="group">
                                    <span className="group-hover:hidden">No, stay logged in</span>
                                    <span className="hidden group-hover:inline">Stay a little longer? 😊</span>
                                </Button>
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={logout} className="group">
                                <span className="group-hover:hidden">Yes, Logout</span>
                                <span className="hidden group-hover:inline">See you soon! 👋</span>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
    );
}

function NotificationsTab() {
    const { user } = useAuth();
    const canManageUsers = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'RESTAURANT_OWNER';

    return (
        <Card>
            <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Manage how you receive notifications from AdminSlice.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <h4 className="font-semibold">New Orders</h4>
                        <p className="text-sm text-muted-foreground">Notify when a new order is received.</p>
                    </div>
                    <Switch defaultChecked />
                </div>
                {canManageUsers && (
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <h4 className="font-semibold">User Activity</h4>
                            <p className="text-sm text-muted-foreground">Notify on new user registrations or role changes.</p>
                        </div>
                        <Switch />
                    </div>
                )}
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <h4 className="font-semibold">System Alerts</h4>
                        <p className="text-sm text-muted-foreground">Receive alerts for system maintenance or updates.</p>
                    </div>
                    <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <h4 className="font-semibold">Email Notifications</h4>
                        <p className="text-sm text-muted-foreground">Enable or disable email alerts.</p>
                    </div>
                    <Switch defaultChecked />
                </div>
            </CardContent>
        </Card>
    );
}

function NotificationsMarketingTab() {
    const { toast } = useToast();
    const handleSendNotification = (e) => {
        e.preventDefault();
        toast({
            title: "Notification Sent!",
            description: "Your message has been sent to the selected audience.",
        });
    };
    return (
        <Card>
            <CardHeader>
                <CardTitle>Notifications & Marketing</CardTitle>
                <CardDescription>Send promotional messages and announcements.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <form onSubmit={handleSendNotification}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><BellRing className="h-5 w-5 text-primary" /> Send Push Notification</CardTitle>
                            <CardDescription>Send a message to all customers or a specific group.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="notification-title">Title</Label>
                                <Input id="notification-title" placeholder="e.g. Weekend Special!" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="notification-message">Message</Label>
                                <Textarea id="notification-message" placeholder="Get 20% off on all pizzas this weekend." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="notification-audience">Audience</Label>
                                <Select defaultValue="all-customers">
                                    <SelectTrigger id="notification-audience">
                                        <SelectValue placeholder="Select audience" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all-customers">All Customers</SelectItem>
                                        <SelectItem value="new-customers">New Customers (Last 30 days)</SelectItem>
                                        <SelectItem value="delivery-staff">All Delivery Staff</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit">
                                <Send className="mr-2 h-4 w-4" />
                                Send Notification
                            </Button>
                        </CardContent>
                    </Card>
                </form>
            </CardContent>
        </Card>
    );
}

function StoreSettingsTab() {
    const { toast } = useToast();
    const handleSaveChanges = () => {
        toast({
            title: "Settings Saved",
            description: "Your store settings have been updated.",
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Store Settings</CardTitle>
                <CardDescription>Manage general store settings and information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Operational Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="delivery-charge">Delivery Charge</Label>
                                <Input id="delivery-charge" type="number" placeholder="e.g. 5.00" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="tax-gst">Tax / GST (%)</Label>
                                <Input id="tax-gst" type="number" placeholder="e.g. 18" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="opening-time">Opening Time</Label>
                                <Input id="opening-time" type="time" defaultValue="09:00" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="closing-time">Closing Time</Label>
                                <Input id="closing-time" type="time" defaultValue="22:00" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Legal & Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="space-y-2">
                            <Label htmlFor="terms-conditions">Terms & Conditions</Label>
                            <Textarea id="terms-conditions" rows={5} placeholder="Enter your terms and conditions." />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="privacy-policy">Privacy Policy</Label>
                            <Textarea id="privacy-policy" rows={5} placeholder="Enter your privacy policy." />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="about-us">About Us</Label>
                            <Textarea id="about-us" rows={5} placeholder="Tell customers about your store." />
                        </div>
                    </CardContent>
                </Card>
                <Button onClick={handleSaveChanges}>Save Changes</Button>
            </CardContent>
        </Card>
    )
}


function PaymentMethodsTab() {
    const { toast } = useToast();
    const [razorpayEnabled, setRazorpayEnabled] = useState(false);
    const [cardsEnabled, setCardsEnabled] = useState(true);
    const [upiEnabled, setUpiEnabled] = useState(true);
    const [isDirectOptionsOpen, setIsDirectOptionsOpen] = useState(true);
    
    // Card fields state
    const [cardholderName, setCardholderName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    
    // Validation errors state
    const [errors, setErrors] = useState({});

    const [upiId, setUpiId] = useState('');
    const [upiIdError, setUpiIdError] = useState('');

    useEffect(() => {
        const savedSettings = localStorage.getItem('paymentSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            setCardholderName(settings.cardholderName || '');
            setCardNumber(settings.cardNumber || '');
            setExpiryDate(settings.expiryDate || '');
            setCvv(settings.cvv || '');
            setUpiId(settings.upiId || '');
            setRazorpayEnabled(settings.razorpayEnabled ?? false);
            setCardsEnabled(settings.cardsEnabled ?? true);
            setUpiEnabled(settings.upiEnabled ?? true);
        }
    }, []);


    const handleUpiIdChange = (e) => {
        const value = e.target.value;
        setUpiId(value);
        if (value && !/^[a-zA-Z0-9.\-_]+@[a-zA-Z0-9]+$/.test(value)) {
            setUpiIdError('Please enter a valid UPI ID (e.g., yourname@upi).');
        } else {
            setUpiIdError('');
        }
    };
    
    const validateCardDetails = () => {
        const newErrors = {};
        if (!cardholderName.trim()) newErrors.cardholderName = 'Cardholder name is required.';
        if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) newErrors.cardNumber = 'Card number must be 16 digits.';
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) newErrors.expiryDate = 'Expiry date must be in MM/YY format.';
        if (!/^\d{3,4}$/.test(cvv)) newErrors.cvv = 'CVV must be 3 or 4 digits.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSaveChanges = () => {
        let isValid = true;
        if (cardsEnabled) {
            isValid = validateCardDetails();
        }

        if (upiEnabled && upiIdError) {
             toast({
                title: "Invalid UPI ID",
                description: upiIdError,
                variant: "destructive",
            });
            return;
        }

        if(isValid) {
            const settingsToSave = {
                razorpayEnabled,
                cardsEnabled,
                upiEnabled,
                cardholderName,
                cardNumber,
                expiryDate,
                cvv,
                upiId,
            };
            localStorage.setItem('paymentSettings', JSON.stringify(settingsToSave));
            toast({
                title: "Payment Settings Saved",
                description: "Your payment method configurations have been updated.",
            });
        } else {
            toast({
                title: "Validation Failed",
                description: "Please correct the errors before saving.",
                variant: "destructive",
            });
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Configure the payment methods available to your customers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Gateway Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                           <div className="flex items-center gap-4">
                               <Banknote className="h-8 w-8 text-primary" />
                               <div>
                                   <h4 className="font-semibold">UPI</h4>
                                   <p className="text-sm text-muted-foreground">Accept payments through UPI apps.</p>
                               </div>
                           </div>
                           <Switch checked={upiEnabled} onCheckedChange={setUpiEnabled} />
                        </div>
                        {upiEnabled && (
                           <div className="space-y-2 pt-4 border-t">
                               <Label htmlFor="upi-id">Your UPI ID</Label>
                               <Input 
                                   id="upi-id" 
                                   placeholder="yourname@upi" 
                                   value={upiId}
                                   onChange={handleUpiIdChange}
                               />
                               {upiIdError && <p className="text-sm text-destructive">{upiIdError}</p>}
                           </div>
                        )}
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="flex items-center gap-4">
                                <CreditCard className="h-8 w-8 text-primary" />
                                <div>
                                    <h4 className="font-semibold">Razorpay</h4>
                                    <p className="text-sm text-muted-foreground">Accept cards, UPI, and more.</p>
                                </div>
                            </div>
                            <Switch checked={razorpayEnabled} onCheckedChange={setRazorpayEnabled} />
                        </div>
                        {razorpayEnabled && (
                            <div className="space-y-4 pt-4 border-t">
                                <div className="space-y-2">
                                    <Label htmlFor="razorpay-key-id">Razorpay Key ID</Label>
                                    <Input id="razorpay-key-id" placeholder="rzp_test_..." />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="razorpay-key-secret">Razorpay Key Secret</Label>
                                    <Input id="razorpay-key-secret" type="password" placeholder="••••••••••••••••" />
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Collapsible open={isDirectOptionsOpen} onOpenChange={setIsDirectOptionsOpen}>
                    <Card>
                        <CollapsibleTrigger asChild>
                            <div className="flex items-center justify-between p-4 cursor-pointer">
                                <div>
                                    <CardTitle>Direct Payment Options</CardTitle>
                                    <CardDescription>Enable or disable specific payment types.</CardDescription>
                                </div>
                                <ChevronDown className={cn("h-5 w-5 transition-transform", isDirectOptionsOpen && "rotate-180")} />
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                             <CardContent className="space-y-4 pt-0">
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="flex items-center gap-4">
                                        <CreditCard className="h-8 w-8 text-primary" />
                                        <div>
                                            <h4 className="font-semibold">Credit/Debit Cards</h4>
                                            <p className="text-sm text-muted-foreground">Accept all major credit and debit cards.</p>
                                        </div>
                                    </div>
                                    <Switch checked={cardsEnabled} onCheckedChange={setCardsEnabled} />
                                </div>
                                {cardsEnabled && (
                                    <div className="space-y-4 pt-4 border-t">
                                        <h4 className="font-semibold">Choose your payment method</h4>
                                        <RadioGroup defaultValue="card" className="flex gap-4">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="card" id="card-payment" />
                                                <Label htmlFor="card-payment" className="flex items-center gap-2 font-normal">
                                                    <Image src="https://placehold.co/40x25.png?text=VISA" width={40} height={25} alt="Visa" />
                                                    <Image src="https://placehold.co/40x25.png?text=AMEX" width={40} height={25} alt="American Express" />
                                                    <Image src="https://placehold.co/40x25.png?text=MC" width={40} height={25} alt="Mastercard" />
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                 <RadioGroupItem value="paypal" id="paypal-payment" />
                                                 <Label htmlFor="paypal-payment" className="flex items-center gap-2 font-normal">
                                                     <Image src="https://placehold.co/70x25.png?text=PayPal" width={70} height={25} alt="PayPal" />
                                                 </Label>
                                            </div>
                                        </RadioGroup>
                                        <div className="space-y-2">
                                            <Label htmlFor="cardholder-name">Cardholder's Name</Label>
                                            <Input id="cardholder-name" placeholder="Cardholder's Name" value={cardholderName} onChange={(e) => setCardholderName(e.target.value)} />
                                            {errors.cardholderName && <p className="text-sm text-destructive">{errors.cardholderName}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="card-number">Card Number</Label>
                                            <div className="relative">
                                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input id="card-number" placeholder="Card Number" className="pl-10" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
                                            </div>
                                            {errors.cardNumber && <p className="text-sm text-destructive">{errors.cardNumber}</p>}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="expiry-date">EXP.</Label>
                                                <Input id="expiry-date" placeholder="MM/YY" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
                                                 {errors.expiryDate && <p className="text-sm text-destructive">{errors.expiryDate}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="cvv">CVV</Label>
                                                <Input id="cvv" placeholder="CVV" value={cvv} onChange={(e) => setCvv(e.target.value)} />
                                                {errors.cvv && <p className="text-sm text-destructive">{errors.cvv}</p>}
                                            </div>
                                        </div>
                                        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">save button</Button>
                                    </div>
                                )}
                            </CardContent>
                        </CollapsibleContent>
                    </Card>
                </Collapsible>

                <Button onClick={handleSaveChanges}>Save Changes</Button>
            </CardContent>
        </Card>
    );
}

export default function SettingsPage() {
    const { user } = useAuth();

    const allTabs = [
        { value: "profile", label: "My Profile", component: ProfileTab, roles: ["SUPER_ADMIN", "ADMIN", "RESTAURANT_OWNER", "DRIVER", "SUPPORT"] },
        { value: "account_notifications", label: "Account Notifications", component: NotificationsTab, roles: ["SUPER_ADMIN", "ADMIN", "RESTAURANT_OWNER", "DRIVER", "SUPPORT"] },
        { value: "marketing_notifications", label: "Notifications", component: NotificationsMarketingTab, roles: ["SUPER_ADMIN", "ADMIN", "RESTAURANT_OWNER"] },
        { value: "store_settings", label: "Store Settings", component: StoreSettingsTab, roles: ["SUPER_ADMIN", "ADMIN", "RESTAURANT_OWNER"] },
        { value: "payment_methods", label: "Payment Methods", component: PaymentMethodsTab, roles: ["SUPER_ADMIN", "ADMIN", "RESTAURANT_OWNER"] },
    ];

    const availableTabs = useMemo(() => {
        if (!user) return [];
        return allTabs.filter(tab => tab.roles.includes(user.role));
    }, [user, allTabs]);

    if (!user) {
        return (
            <div className="flex items-center justify-center h-full">
                <Card>
                    <CardHeader>
                        <CardTitle>Loading...</CardTitle>
                        <CardDescription>
                            Please wait while we load your settings.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <>
            <DashboardHeader title="Settings" />
            <Tabs defaultValue={availableTabs[0]?.value} className="w-full">
                <TabsList className="grid w-full sm:grid-flow-col sm:w-auto sm:grid-rows-1">
                    {availableTabs.map((tab) => (
                        <TabsTrigger key={tab.value} value={tab.value}>
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {availableTabs.map((tab) => (
                    <TabsContent key={tab.value} value={tab.value}>
                        <tab.component />
                    </TabsContent>
                ))}
            </Tabs>
        </>
    );
}


    
