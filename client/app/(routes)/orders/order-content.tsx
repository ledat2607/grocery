"use client";

import { Order } from "@/type-db";
import OrderItem from "./order-item";

interface OrderContentProps {
  orders: Order[];
}
const OrderContent = ({ orders }: OrderContentProps) => {
    if(orders.length === 0){
        return (
          <div className="w-full border rounded-lg border-gray-100 p-4 flex">
            No order found
          </div>
        );
    }
  return (
    <div className="w-full rounded-lg p-4 flex flex-col items-center justify-center">
      {orders.map((order) => (
        <OrderItem key={order.id} order={order} />
      ))}
    </div>
  );
};

export default OrderContent;
