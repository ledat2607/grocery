"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import { useEffect } from "react";

const SetupPage = () => {
  const onOpen = useStoreModal((state: any) => state.onOpen);
  const isOpen = useStoreModal((state: any) => state.isOpen);
  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return null;
};

export default SetupPage;
