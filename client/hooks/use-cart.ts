import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Products } from "@/type-db";
import { toast } from "react-hot-toast";

interface CartStore {
  items: Products[];
  addItem: (data: Products) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
  updateQty: (id: string, qty: number) => void;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],

      addItem: (data: Products) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === data.id);

        // Update quantity if item exists, otherwise add item
        if (existingItem) {
          existingItem.qty += data.qty || 1; // Update quantity
          set({ items: [...currentItems] });
          toast.success("Updated");
        } else {
          set({
            items: [...currentItems, { ...data, qty: data.qty || 1 }],
          });
          toast.success("Added");
        }
      },

      removeItem: (id: string) => {
        set({ items: get().items.filter((item) => item.id !== id) });
        toast.success("Removed");
      },
      updateQty: (id: string, qty: number) => {
        const currentItems = get().items;
        const itemIndex = currentItems.findIndex((item) => item.id === id);

        if (itemIndex !== -1) {
          currentItems[itemIndex].qty = qty; // Directly update the quantity
          set({ items: [...currentItems] });
          toast.success("Quantity updated");
        } else {
          toast.error("Item not found");
        }
      },
      removeAll: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;
