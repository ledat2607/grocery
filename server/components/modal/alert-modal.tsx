'use client'

import { useEffect, useState } from "react";
import { Modal } from "../modal";
import { Button } from "../ui/button";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const AlertModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}: AlertModalProps) => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
      setIsMounted(true);
    }, []);
    if(!isMounted){
        return null;
    }
    
    return (
      <Modal
        title="Are you sure ?"
        desription="This action can't undo !!"
        isOpen={isOpen}
        onClose={onClose}
      >
        <div className="pt-6 flex items-center justify-end gap-4">
          <Button onClick={onClose} disabled={loading} variant={"outline"}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            variant={"destructive"}
          >
            Confirm
          </Button>
        </div>
      </Modal>
    );
};

