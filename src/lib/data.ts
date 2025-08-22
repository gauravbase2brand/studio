
import type { Order, Kpi, User, OrderStatus } from "@/types";
import { Activity, CreditCard, DollarSign, Users, Star, ShoppingBag, BarChart, CheckCircle } from "lucide-react";
import { BakeryIcon } from "@/components/icons/bakery";
import { BurgerIcon } from "@/components/icons/burger";
import { BeverageIcon } from "@/components/icons/beverage";
import { ChickenIcon } from "@/components/icons/chicken";
import { PizzaIcon } from "@/components/icons/pizza";

export const kpiData: Kpi[] = [];

export const categories = []

export const recentOrders: (Omit<Order, 'items' | 'status' | 'customer' | 'date'> & {dish: {name: string; image: string; rating: number; reviews: number; aiHint: string; distance: number; time: number; }})[] = [];

export const allOrders: Order[] = [];

export const allUsers: User[] = [
    { id: '1', name: 'Super Admin', email: 'superadmin@example.com', role: 'SUPER_ADMIN' },
    { id: '2', name: 'Admin User', email: 'admin@example.com', role: 'ADMIN' },
    { id: '3', name: 'Restaurant Owner', email: 'owner@example.com', role: 'RESTAURANT_OWNER' },
    { id: '4', name: 'Driver', email: 'driver@example.com', role: 'DRIVER' },
    { id: '5', name: 'Support', email: 'support@example.com', role: 'SUPPORT' },
];
