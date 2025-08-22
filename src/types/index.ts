

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "RESTAURANT_OWNER" | "DRIVER" | "SUPPORT";

export type User = {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

export type OrderStatus = "Pending" | "Processing" | "Out for Delivery" | "Delivered" | "Cancelled" | "Returned";

export type PaymentMethod = "Card" | "UPI" | "Net Banking" | "Cash on Delivery";

export type RefundMethod = "UPI" | "Card";

export type RefundStatus = "Pending" | "Processing" | "Completed" | "Rejected";


export type OrderItem = {
    dishId: string;
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
    size?: string;
}

export type Order = {
  id: string;
  customer: {
    name: string;
    email: string;
    address: string;
    phone: string;
  };
  date: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  total: number;
  items: OrderItem[] | number;
  driverId?: string;
  note?: string;
  couponCode?: string;
  cancellationReason?: string;
  returnReason?: string;
  refundStatus?: RefundStatus;
  refundMethod?: RefundMethod;
};

export type Kpi = {
    title: string;
    value: string;
    change: string;
    changeType: "increase" | "decrease";
    icon: React.ComponentType<{ className?: string }>;
};

export type Dish = {
    id: string;
    name: string;
    category: string;
    price: number;
    description: string;
    longDescription?: string;
    status: string;
    image: string;
    stockQuantity?: string;
    stockStatus?: string;
    quantity?: string;
    deliveryType?: string;
    saleStartDate?: string | null;
    saleEndDate?: string | null;
    hasExpiryDate?: boolean;
    hasDiscount?: boolean;
}

export type Offer = {
    id: string;
    title: string;
    code: string;
    description: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    startDate: string;
    endDate: string;
    foodItemId?: string; // Kept for backward compatibility
    foodItemIds?: string[];
}
