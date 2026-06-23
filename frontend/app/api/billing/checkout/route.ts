import { NextResponse } from "next/server";

export async function POST() {
  try {
    const orderId = `order_${Date.now()}`;

    const response = await fetch(
      "https://api.cashfree.com/pg/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": process.env.CASHFREE_APP_ID!,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY!,
          "x-api-version": "2023-08-01",
        },
        body: JSON.stringify({
          order_id: orderId,
          order_amount: 5,
          order_currency: "INR",
          customer_details: {
            customer_id: orderId,
            customer_email: "user@example.com",
            customer_phone: "9999999999",
          },
          order_meta: {
            return_url:
              `${process.env.NEXT_PUBLIC_APP_URL}/billing?order_id={order_id}`,
          },
        }),
      }
    );

    const data = await response.json();
    console.log("Cashfree Status:", response.status);
    console.log("Cashfree Response:", data);
    console.log("APP_ID:", process.env.CASHFREE_APP_ID);
    console.log("SECRET:", process.env.CASHFREE_SECRET_KEY?.slice(0, 8));

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message ?? "Failed to create order" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      orderId: data.order_id,
      paymentSessionId: data.payment_session_id,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Could not create order" },
      { status: 500 }
    );
  }
}
