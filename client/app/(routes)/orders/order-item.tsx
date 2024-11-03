'use client';

import { useEffect, useState } from "react";
import Box from "@/components/box";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Order } from "@/type-db";
import Image from "next/image";
import Modal from "./modal";

interface OrderItemProps {
  order: Order;
}

const OrderItem = ({ order }: OrderItemProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Box>
      <div className="w-full grid grid-cols-2 md:grid-cols-5 gap-x-4 gap-y-6 px-4 py-2 items-center rounded-md border border-gray-100">
        <div className="flex items-center gap-2">
          {order.orderItems.map((item) => (
            <div
              key={item.id}
              className="aspect-square w-16 min-w-16 h-16 min-h-16 rounded-md relative overflow-hidden bg-gray-100"
            >
              <Image
                src={item.images[0].url}
                alt=""
                className="w-full h-full object-contain"
                fill
              />
            </div>
          ))}
        </div>
        <p className="text-lg font-semibold text-muted-foreground">
          {order.orderItems.map((item) => item.name).join(",")}
        </p>
        <p className={cn("text-base font-semibold")}>{order.order_status}</p>
        <p
          className={cn(
            "text-base font-semibold",
            order.isPaid ? "text-green-500" : "text-red-500"
          )}
        >
          {order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
        </p>
        <Button onClick={handleOpenModal}>Xem chi tiết</Button>
      </div>

      {/* Modal component */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} order={order} />
    </Box>
  );
};

export default OrderItem;
