'use client'

import { PlusCircle } from "lucide-react";

interface CreateNewStoreItemProps {
  onClick: () => void;
}

export const CreateNewStoreItem = ({ onClick }: CreateNewStoreItemProps) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center bg-green-50 px-2 py-1 text-muted-foreground hover:text-primary cursor-pointer"
    >
      <PlusCircle className="mr-2 h-5 w-5" />
      Create store
    </div>
  );
};
 