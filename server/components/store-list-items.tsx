import { cn } from "@/lib/utils";
import { Check, Store } from "lucide-react";

interface StoreListItemProps {
  store: any;
  onSelect: (store: any) => void;
  isChecked: boolean;
}

export const StoreListItem = ({
  store,
  onSelect,
  isChecked,
}: StoreListItemProps) => {
  return (
    <div
      onClick={() => onSelect(store)}
      className="flex items-center px-2 py-1 cursor-pointer hover:bg-red-50 text-muted-foreground hover:text-primary"
    >
      <Store className="mr-2 h-4 w-4" />
      <p className="w-full truncate text-sm whitespace-nowrap">{store.label}</p>
      <Check
        className={cn(
          "ml-auto w-4 h-4",
          isChecked ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
};
 
 