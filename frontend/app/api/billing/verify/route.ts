import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    const response = await fetch(
      `https://sandbox.cashfree.com/pg/orders/${orderId}/payments`,
      {
        headers: {
          "x-client-id": process.env.CASHFREE_APP_ID!,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY!,
          "x-api-version": "2023-08-01",
        },
      }
    );

    const payments = await response.json();

    const success = payments.some(
      (payment: any) => payment.payment_status === "SUCCESS"
    );

    if (!success) {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    // Upgrade user in DB here

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}