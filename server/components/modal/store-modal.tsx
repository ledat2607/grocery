"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "../modal";
import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios"
import toast from "react-hot-toast";
import { redirect } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(3, { message: "Store name should be min 3 characters" }),
});

const StoreModal = () => {
  const storeModal = useStoreModal();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const res = await axios.post("/api/stores", values);
      toast.success("Success!");
      window.location.assign(`/${res.data?.id}`);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Modal
      title="Create a new store"
      desription="Create a store for you website"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div className="space-y-2 py-2 bp-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Your store name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-6 space-x-2 flex items-center justify-end">
              <Button disabled={isLoading} type="button" variant={"outline"}>
                Cancel
              </Button>
              <Button disabled={isLoading} type="submit">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};

export default StoreModal;
