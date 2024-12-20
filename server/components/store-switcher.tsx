"use client";

import { Store } from "@/type-db";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { ChevronsUpDown, StoreIcon } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandList } from "./ui/command";
import { StoreListItem } from "./store-list-items";
import { Separator } from "./ui/separator";
import { useStoreModal } from "@/hooks/use-store-modal";
import { CreateNewStoreItem } from "./create-new-store-item";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Store[];
}

const StoreSwitcher = ({ items }: StoreSwitcherProps) => {
  const params = useParams();
  const router = useRouter();
  const storeModal = useStoreModal();

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtered, setFiltered] = useState<{ label: string; value: string }[]>(
    []
  );

  const formattedStore = items.map((item) => ({
    label: item.name,
    value: item.id,
  }));
  const currentStore = formattedStore.find(
    (item) => item.value === params.storeId
  );

  const onStoreSelect = (store: { value: string; label: string }) => {
    setOpen(false);
    router.push(`${store.value}`);
  };
  const handleSearchTerm = (e: any) => {
    setSearchTerm(e.target.value);
    setFiltered(
      formattedStore.filter((item) =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          <StoreIcon className="mr-2" />
          {currentStore?.value
            ? formattedStore.find(
                (framework) => framework.value === currentStore?.value
              )?.label
            : "Select framework..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <div className="w-full px-2 py-1 flex items-center border rounded-md border-gray-200">
            <StoreIcon className="mr-2 h-4 w-4" />
            <input
              onChange={handleSearchTerm}
              type="text"
              placeholder="Search store..."
              className="outline-none px-3 py-2"
            />
          </div>
          <CommandList>
            <CommandGroup heading="Stores">
              {searchTerm === "" ? (
                formattedStore.map((item, i) => (
                  <StoreListItem
                    store={item}
                    key={i}
                    onSelect={onStoreSelect}
                    isChecked={currentStore?.value === item.value}
                  />
                ))
              ) : filtered.length > 0 ? (
                formattedStore.map((item, i) => (
                  <StoreListItem
                    store={item}
                    key={i}
                    onSelect={onStoreSelect}
                    isChecked={currentStore?.value === item.value}
                  />
                ))
              ) : (
                <CommandEmpty>No store found</CommandEmpty>
              )}
            </CommandGroup>
          </CommandList>
          <Separator />
          <CommandList>
            <CommandGroup>
              <CreateNewStoreItem
                onClick={() => {
                  setOpen(false);
                  storeModal.onOpen();
                }}
              />
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StoreSwitcher;
