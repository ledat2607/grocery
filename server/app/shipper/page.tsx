import { Order } from "@/type-db";
import { collection, doc, getDocs } from "firebase/firestore";
import { OrderColumns } from "../(dashboard)/[storeId]/(routes)/orders/components/columns";
import { formatter } from "@/lib/utils";
import { format } from "date-fns";
import { ShippingClient } from "./components/shipping-client";
import { db } from "@/lib/firebase";
import { auth } from "@clerk/nextjs/server";
import { ShippingColumns } from "./components/columns";

const ShipperPage = async () => {
  const { userId } = await auth();
  const orderData = (
    await getDocs(
      collection(doc(db, "stores", "GsGFvwku3vPwlUyXKUnn"), "orders")
    )
  ).docs.map((doc) => doc.data()) as Order[];

  // Filter orders based on address and order_status
  const filteredOrders = orderData.filter(
    (item) => item.address && item.order_status !== "Deliveried" // Check for address and order status
  );

  const formattedOrder: ShippingColumns[] = filteredOrders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    isPaid: item.isPaid,
    images: item.orderItems.map((item) => item.images[0].url),
    products: item.orderItems.map((item) => item.id).join(","),
    productQuantities: item.orderItems.map((item) => ({
      productId: item.id,
      qty: item.qty,
    })),
    idShipper: item?.shipperId as string,
    order_status: item.order_status,
    totalPrice: formatter.format(
      item.orderItems.reduce((total, item) => {
        if (item && item.qty !== undefined) {
          return total + Number(item.discountPrice * item.qty);
        }
        return total;
      }, 0)
    ),
    createdAt: item.createdAt
      ? format(item.createdAt.toDate(), "MMMM do, yyyy")
      : "",
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ShippingClient data={formattedOrder} userId={userId} />
      </div>
    </div>
  );
};

export default ShipperPage;
