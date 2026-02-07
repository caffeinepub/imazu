import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface UserProfile {
    name: string;
}
export type Time = bigint;
export interface LineItem {
    productId: ProductId;
    quantity: bigint;
    price: bigint;
}
export interface Order {
    id: OrderId;
    status: OrderStatus;
    lineItems: Array<LineItem>;
    total: bigint;
    paymentMethod: PaymentMethod;
    deliveryFee: bigint;
    customer: CustomerInfo;
    createdAt: Time;
    createdBy: Principal;
    subtotal: bigint;
    transactionId?: string;
}
export type ProductId = bigint;
export interface CustomerInfo {
    name: string;
    address: string;
    phone: string;
}
export interface Product {
    id: ProductId;
    active: boolean;
    name: string;
    description: string;
    price: bigint;
    images: Array<string>;
}
export type OrderId = bigint;
export enum OrderStatus {
    cancelled = "cancelled",
    pending = "pending",
    delivered = "delivered",
    confirmed = "confirmed",
    paymentVerified = "paymentVerified"
}
export enum PaymentMethod {
    cashOnDelivery = "cashOnDelivery",
    easyPaisa = "easyPaisa",
    jazzCash = "jazzCash"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    cancelOrder(id: OrderId): Promise<void>;
    confirmOrder(id: OrderId): Promise<void>;
    createOrder(customer: CustomerInfo, lineItems: Array<LineItem>, subtotal: bigint, deliveryFee: bigint, paymentMethod: PaymentMethod, transactionId: string | null): Promise<Order>;
    createProduct(name: string, description: string, price: bigint, images: Array<string>): Promise<Product>;
    deactivateProduct(id: ProductId): Promise<void>;
    getActiveProducts(): Promise<Array<Product>>;
    getAllOrders(): Promise<Array<Order>>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getOrder(id: OrderId): Promise<Order>;
    getProduct(id: ProductId): Promise<Product>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markOrderDelivered(id: OrderId): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateProduct(id: ProductId, name: string, description: string, price: bigint, images: Array<string>, active: boolean): Promise<Product>;
    uploadProductImage(file: ExternalBlob, productId: ProductId, filename: string): Promise<ExternalBlob>;
    verifyPayment(id: OrderId, transactionId: string): Promise<void>;
}
