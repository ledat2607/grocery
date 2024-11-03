import { NextResponse } from 'next/server';
import { db } from "@/lib/firebase"; // Import your Firebase config
import { doc, updateDoc } from "firebase/firestore";

export async function PATCH(request: Request, { params }: { params: { storeId: string; orderId: string } }) {
  try {
    const { shipperId, orderId } = await request.json(); // Get shipperId and orderId from the request body

    // Reference to the specific order in Firestore
    const orderRef = doc(
      db,
      "stores",
      params.storeId, // Use dynamic storeId from params
      "orders",
      orderId // Use dynamic orderId from the request body
    );

    // Update the order with the new shipperId
    await updateDoc(orderRef, { shipperId });

    return NextResponse.json({ message: "Order updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
