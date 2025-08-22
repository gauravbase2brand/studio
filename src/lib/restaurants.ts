
export type Restaurant = {
    id: string;
    name: string;
    owner: string;
    logo: string;
    totalProducts: number;
    totalSales: number;
    address: string;
    email: string;
    phone: string;
};

export const allRestaurants: Restaurant[] = [
    {
        id: '1',
        name: 'The Golden Spoon',
        owner: 'John Doe',
        logo: 'https://placehold.co/64x64.png',
        totalProducts: 50,
        totalSales: 12500,
        address: '123 Main St, Anytown, USA',
        email: 'contact@goldenspoon.com',
        phone: '123-456-7890'
    }
];

    