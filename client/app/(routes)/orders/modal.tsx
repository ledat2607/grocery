// Modal.tsx
import React from 'react';
import { Order } from "@/type-db";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, order }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-md shadow-lg p-6 w-11/12 md:w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Order Receipt</h2>
        <div className="border-b border-gray-200 mb-4">
          <p className="text-lg"><strong>Order ID:</strong> {order.id}</p>
          <p className="text-sm text-gray-600"><strong>Status:</strong> {order.order_status}</p>
          <p className="text-sm text-gray-600"><strong>Phone:</strong> {order.phone}</p>
          <p className="text-sm text-gray-600"><strong>Address:</strong> {order.address}</p>
        </div>

        <h3 className="text-lg font-semibold mb-2">Items Ordered:</h3>
        <ul className="mb-4">
          {order.orderItems.map((item) => (
            <li key={item.id} className="flex justify-between mb-2">
              <span>{item.name} (x{item.qty})</span>
              <span>{item.discountPrice ? (item.discountPrice).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : item.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
            </li>
          ))}
        </ul>

        <div className="border-t border-gray-200 pt-2">
          <p className="text-lg font-semibold">
            <span className="mr-2">Total:</span>
            <span className="font-bold text-red-500">{(order.orderItems.reduce((total, item) => total + (item.discountPrice || item.price) * item.qty, 0)).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
