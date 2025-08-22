
"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Save, Upload } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export default function NewDriverPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [vehicle, setVehicle] = useState('');
    const [status, setStatus] = useState('Available');
    const [panCardNumber, setPanCardNumber] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const fileInputRef = useRef(null);
    const [errors, setErrors] = useState({});

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (setter, field) => (e) => {
        setter(e.target.value);
        if (errors[field]) {
            setErrors(prev => ({...prev, [field]: false}));
        }
    }
    
    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 10) {
            setPhone(value);
            if (errors.phone) {
                setErrors(prev => ({...prev, phone: false}));
            }
        }
    };
    
    const handlePanCardChange = (e) => {
        const value = e.target.value.toUpperCase();
        if (value.length <= 10) {
            setPanCardNumber(value);
            if (errors.panCardNumber) {
                setErrors(prev => ({...prev, panCardNumber: false}));
            }
        }
    };

    const handleAddDriver = () => {
        const newErrors = {};
        if (!name) newErrors.name = true;
        if (!phone) newErrors.phone = true;
        if (!vehicle) newErrors.vehicle = true;
        if (!panCardNumber) newErrors.panCardNumber = true;
        if (!licenseNumber) newErrors.licenseNumber = true;

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            toast({
                title: "Missing Information",
                description: "Please fill out all required fields to add a new driver.",
                variant: "destructive"
            });
            return;
        }

        const newDriver = {
            id: `driver_${new Date().getTime()}`,
            name,
            phone,
            vehicle,
            panCardNumber,
            licenseNumber,
            status,
            rating: (Math.random() * (5 - 3.5) + 3.5).toFixed(1), // Random rating between 3.5 and 5
            avatar: avatar || `https://placehold.co/40x40.png?text=${name.charAt(0)}`,
        };

        const existingDrivers = JSON.parse(localStorage.getItem('drivers') || '[]');
        const updatedDrivers = [...existingDrivers, newDriver];
        localStorage.setItem('drivers', JSON.stringify(updatedDrivers));
        window.dispatchEvent(new Event('storage'));


        toast({
            title: "Driver Added",
            description: `${name} has been successfully added to your drivers list.`
        });

        router.push('/dashboard/drivers');
    };

    return (
        <>
            <DashboardHeader title="Add New Driver" />
            <Card>
                <CardHeader>
                    <CardTitle>Driver Information</CardTitle>
                    <CardDescription>Enter the details for the new driver.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2 flex flex-col items-center">
                        <Avatar className="h-24 w-24 mb-2">
                            <AvatarImage src={avatarPreview} alt={name} />
                            <AvatarFallback>{name ? name.charAt(0) : '?'}</AvatarFallback>
                        </Avatar>
                        <Button variant="outline" onClick={() => fileInputRef.current.click()}>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Photo
                        </Button>
                        <Input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleAvatarChange}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
                        <Input id="name" placeholder="e.g. John Doe" value={name} onChange={handleInputChange(setName, 'name')} className={cn(errors.name && 'border-destructive')} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number <span className="text-destructive">*</span></Label>
                        <Input id="phone" type="tel" placeholder="e.g. 1234567890" value={phone} onChange={handlePhoneChange} className={cn(errors.phone && 'border-destructive')} />
                        <p className="text-sm text-muted-foreground text-right">{phone.length}/10</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="vehicle">Vehicle Number <span className="text-destructive">*</span></Label>
                        <Input id="vehicle" placeholder="e.g. Bike - ABC 123" value={vehicle} onChange={handleInputChange(setVehicle, 'vehicle')} className={cn(errors.vehicle && 'border-destructive')} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="pan">PAN Card Number <span className="text-destructive">*</span></Label>
                        <Input id="pan" placeholder="e.g. ABCDE1234F" value={panCardNumber} onChange={handlePanCardChange} className={cn(errors.panCardNumber && 'border-destructive')} />
                        <p className="text-sm text-muted-foreground text-right">{panCardNumber.length}/10</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="license">License Number <span className="text-destructive">*</span></Label>
                        <Input id="license" placeholder="e.g. DL-1234567890" value={licenseNumber} onChange={handleInputChange(setLicenseNumber, 'licenseNumber')} className={cn(errors.licenseNumber && 'border-destructive')} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="status">Initial Status</Label>
                        <Select onValueChange={setStatus} value={status}>
                            <SelectTrigger id="status">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Available">Available</SelectItem>
                                <SelectItem value="Offline">Offline</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={handleAddDriver}>
                            <Save className="mr-2 h-4 w-4" />
                            Save Driver
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
