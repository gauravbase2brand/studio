

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  ClipboardList,
  Truck,
  Building2,
  Settings,
  LogOut,
  Users,
  ChevronDown,
  Utensils,
  PlusCircle,
  Briefcase,
  Dot,
  TicketPercent,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  PanelLeft,
  PanelLeftClose,
  Tag,
  Gift,
  History,
  Ban,
  CornerUpLeft,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { useAuth } from "@/lib/auth";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { useEffect, useState, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import { allRestaurants } from "@/lib/restaurants";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";

const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["SUPER_ADMIN", "ADMIN", "RESTAURANT_OWNER", "DRIVER", "SUPPORT"] },
    { href: "/dashboard/manage", label: "Manage", icon: Briefcase, roles: ["SUPER_ADMIN", "ADMIN", "RESTAURANT_OWNER"] },
    { 
      href: "/dashboard/orders", 
      label: "Order History", 
      icon: History, 
      roles: ["SUPER_ADMIN", "ADMIN", "RESTAURANT_OWNER", "DRIVER", "SUPPORT"],
      children: [
        { href: "/dashboard/orders", label: "All Orders", roles: ["SUPER_ADMIN", "ADMIN", "RESTAURANT_OWNER", "DRIVER", "SUPPORT"], icon: Dot },
        { href: "/dashboard/orders/returned", label: "Returned Orders", roles: ["SUPER_ADMIN", "ADMIN", "RESTAURANT_OWNER"], icon: CornerUpLeft },
        { href: "/dashboard/orders/cancelled", label: "Cancelled Orders", roles: ["SUPER_ADMIN", "ADMIN", "RESTAURANT_OWNER"], icon: Ban },
      ]
    },
    { href: "/dashboard/users", label: "Customers", icon: Users, roles: ["SUPER_ADMIN", "ADMIN", "RESTAURANT_OWNER"] },
    { href: "/dashboard/offers", label: "Offers", icon: TicketPercent, roles: ["SUPER_ADMIN", "ADMIN", "RESTAURANT_OWNER"] },
    { href: "/dashboard/drivers", label: "Drivers", icon: Truck, roles: ["SUPER_ADMIN", "ADMIN", "RESTAURANT_OWNER"] },
    { 
        href: "/dashboard/restaurants", 
        label: "Restaurants", 
        icon: Building2, 
        roles: ["SUPER_ADMIN", "RESTAURANT_OWNER"],
        children: [
            { href: "/dashboard/restaurants", label: "Restaurants List", roles: ["SUPER_ADMIN"], icon: Dot },
            { href: `/dashboard/restaurants/${allRestaurants[0]?.id}`, label: "Restaurant Details", roles: ["SUPER_ADMIN", "RESTAURANT_OWNER"], icon: Dot },
            { href: "/dashboard/restaurants/new", label: "Add Restaurant", roles: ["SUPER_ADMIN"], icon: Dot },
            { href: `/dashboard/restaurants/${allRestaurants[0]?.id}/food-items`, label: "Food Items", roles: ["SUPER_ADMIN", "RESTAURANT_OWNER"], icon: Dot },
            { href: `/dashboard/restaurants/${allRestaurants[0]?.id}/add-dish`, label: "Add Dish", roles: ["SUPER_ADMIN", "RESTAURANT_OWNER"], icon: Dot },
            { href: "/dashboard/restaurants/categories", label: "Categories", roles: ["SUPER_ADMIN", "RESTAURANT_OWNER"], icon: Dot },
        ]
    },
    { href: "/dashboard/settings", label: "Settings", icon: Settings, roles: ["SUPER_ADMIN", "ADMIN", "RESTAURANT_OWNER", "DRIVER", "SUPPORT"] },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { isMobile, open, setOpen, toggleSidebar, state } = useSidebar();
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [offers, setOffers] = useState([]);
  const router = useRouter();
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );


  const updateOffers = () => {
    try {
      const storedOffers = localStorage.getItem("offers");
      if (storedOffers) {
        setOffers(JSON.parse(storedOffers));
      } else {
        setOffers([]);
      }
    } catch (error) {
      console.error("Failed to parse offers from localStorage", error);
      setOffers([]);
    }
  };


  useEffect(() => {
    updateOffers();

    const handleStorageChange = () => {
      updateOffers();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const toggleSubmenu = (label) => {
    setOpenSubmenus(prev => ({...prev, [label]: !prev[label]}));
  }

  const filteredMenuItems = user ? menuItems.filter(item => item.roles.includes(user.role)) : [];

  const formatRole = (role) => {
    if (!role) return '';
    return role
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };
  
  const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }


  return (
    <Sidebar>
      <SidebarHeader>
        <div className={cn("flex items-center gap-4", state === "collapsed" && "justify-center")}>
            <Logo className={cn(state === "collapsed" && "hidden")} />
             <SidebarTrigger className={cn("ml-auto", state === "collapsed" && "ml-0")}/>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {filteredMenuItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const filteredChildren = hasChildren && user ? item.children?.filter(child => child.roles.includes(user.role)) : [];
            const isSubmenuOpen = openSubmenus[item.label] ?? false;

            if (hasChildren && filteredChildren && filteredChildren.length > 0) {
              return (
                <Collapsible key={item.href} open={isSubmenuOpen} onOpenChange={() => toggleSubmenu(item.label)} className="w-full">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                            isActive={pathname.startsWith(item.href) && !isSubmenuOpen}
                            tooltip={{ children: item.label }}
                            className="justify-between w-full"
                        >
                             <div className="flex items-center gap-2">
                                <item.icon className="h-5 w-5" />
                                <span className={cn(state === "collapsed" && "hidden")}>{item.label}</span>
                            </div>
                            <ChevronDown className={cn("transform transition-transform duration-200 h-4 w-4", isSubmenuOpen && "rotate-180", state === "collapsed" && "hidden")} />
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {filteredChildren.map((child) => (
                           <SidebarMenuSubItem key={child.href}>
                             <SidebarMenuSubButton asChild isActive={pathname === child.href}>
                               <Link href={child.href}>
                                <child.icon className="h-3.5 w-3.5" />
                                <span>{child.label}</span>
                               </Link>
                             </SidebarMenuSubButton>
                           </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            }

            return (
              <SidebarMenuItem key={item.href} className="w-full">
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label }}
                  className="w-full"
                >
                  <Link href={item.href} className="flex items-center gap-2">
                    <item.icon className="h-5 w-5" />
                    <span className={cn("flex-1", state === "collapsed" && "hidden")}>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
        {offers.length > 0 && (
          <div className={cn("p-4 mt-auto", state === "collapsed" && "hidden")}>
             <Carousel
                opts={{ align: "start", loop: offers.length > 1 }}
                plugins={[plugin.current]}
                className="w-full"
              >
                <CarouselContent>
                  {offers.map((offer) => (
                    <CarouselItem key={offer.id} onClick={() => router.push('/dashboard/offers')} className="cursor-pointer">
                      <Card className="h-full bg-accent/50 border-primary/20 hover:bg-accent transition-colors">
                        <CardHeader className="p-4">
                          <CardTitle className="flex items-center gap-2 text-base">
                            {offer.discountType === 'percentage' ? <Tag className="h-5 w-5 text-primary" /> : <Gift className="h-5 w-5 text-primary" />}
                            {offer.title}
                          </CardTitle>
                          <CardDescription>
                            Use code <span className="font-semibold text-primary">{offer.code}</span>
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-lg font-bold">
                            {offer.discountType === 'percentage'
                              ? `${offer.discountValue}% OFF`
                              : `$${offer.discountValue.toFixed(2)} OFF`}
                          </p>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
          </div>
        )}
      </SidebarContent>
      <SidebarFooter className="border-t -mx-2 pt-2">
        {user && (
            <div className={cn("flex items-center gap-2 p-2", state === "collapsed" && "justify-center")}>
                <Avatar className="h-9 w-9">
                <AvatarImage src={`https://placehold.co/40x40.png?text=${user.name.charAt(0)}`} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className={cn("flex flex-col", state === "collapsed" && "hidden")}>
                    <span className="text-sm font-semibold text-foreground">{capitalize(user.name)}</span>
                    <span className="text-xs text-muted-foreground">{formatRole(user.role)}</span>
                </div>
            </div>
        )}
        <SidebarMenu>
            <SidebarMenuItem>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <SidebarMenuButton tooltip={{ children: "Logout" }} className="w-full">
                           <LogOut className="h-5 w-5" />
                           <span className={cn(state === "collapsed" && "hidden")}>Logout</span>
                        </SidebarMenuButton>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                            <AlertDialogDescription>
                                You will be returned to the login page.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>No</AlertDialogCancel>
                            <AlertDialogAction onClick={logout}>Yes</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
