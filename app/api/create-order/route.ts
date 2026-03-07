import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: Request) {
    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });

        const { amount } = await req.json();

        if (!amount) {
            return NextResponse.json(
                { error: "Amount is required" },
                { status: 400 }
            );
        }

        // Razorpay test mode has a max limit of ₹5,00,000 (50,000,000 paise)
        const amountInPaise = Math.round(amount * 100);
        const cappedAmount = Math.min(amountInPaise, 50000000);

        const options = {
            amount: cappedAmount,
            currency: "INR",
            receipt: `rcpt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        return NextResponse.json(order, { status: 200 });

    } catch (error: any) {
        console.error("Error creating Razorpay order:", error);
        return NextResponse.json(
            { error: "Failed to create order" },
            { status: 500 }
        );
    }
}
