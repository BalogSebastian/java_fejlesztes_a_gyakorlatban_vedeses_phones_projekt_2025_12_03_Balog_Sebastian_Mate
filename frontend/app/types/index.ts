export interface User {
    id: number;
    username: string;
    email: string;
    role: 'USER' | 'ADMIN';
}

export interface Phone {
    id: number;
    brand: string;
    model: string;
    description: string;
    price: number;
    imageUrl: string;
    user?: User;
}