import { NextResponse } from "next/server";
import crypto from "crypto";
import { placeOrder } from "@/lib/checkout-handler";
import type { CartItem } from "@/lib/cart-context";

export async function POST(req: Request) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            items,
            total,
            shippingAddress,
            contactPhone,
            userId, // Added userId to payload
        } = await req.json();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized. User ID is missing in payload." },
                { status: 401 }
            );
        }

        // Verify the payment signature securely
        const secret = process.env.RAZORPAY_KEY_SECRET!;
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            return NextResponse.json(
                { error: "Invalid payment signature" },
                { status: 400 }
            );
        }

        // Since payment is valid, store the order firmly in Firestore
        const { orderId, error } = await placeOrder({
            userId,
            items: items as CartItem[],
            total: total as number,
            shippingAddress: shippingAddress as string,
            contactPhone: contactPhone as string,
            razorpayOrderId: razorpay_order_id as string,
            razorpayPaymentId: razorpay_payment_id as string,
            status: "Confirmed",
        });

        if (error) {
            throw new Error(error);
        }

        return NextResponse.json(
            { message: "Payment verified successfully", orderId },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Error verifying payment:", error);
        return NextResponse.json(
            { error: "Payment verification failed" },
            { status: 500 }
        );
    }
}
