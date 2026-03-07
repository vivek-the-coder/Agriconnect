import { NextResponse } from "next/server";
import { placeOrder } from "@/lib/checkout-handler";
import type { CartItem } from "@/lib/cart-context";

export async function POST(req: Request) {
    try {
        const {
            razorpay_order_id,
            items,
            total,
            shippingAddress,
            contactPhone,
            userId, // Added userId
        } = await req.json();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Store the order as "Failed"
        const { orderId, error } = await placeOrder({
            userId,
            items: items as CartItem[],
            total: total as number,
            shippingAddress: shippingAddress as string,
            contactPhone: contactPhone as string,
            razorpayOrderId: razorpay_order_id as string,
            razorpayPaymentId: "FAILED",
            status: "Failed",
        });

        if (error) {
            throw new Error(error);
        }

        return NextResponse.json(
            { message: "Failure recorded successfully", orderId },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Error recording failure:", error);
        return NextResponse.json(
            { error: "Failed to record payment failure" },
            { status: 500 }
        );
    }
}
