"use client";

import { Heading } from "@/components/heading";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Store } from "@/type-db";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface SettingFormProps {
  initialData: Store;
}
const formSchema = z.object({
  name: z.string().min(3, { message: "Store name should be min 3 characters" }),
});
const SettingForm = ({ initialData }: SettingFormProps) => {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  const router = useRouter();

  //update store
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      await axios.patch(`/api/stores/${params.storeId}`, data);
      toast.success("Success!");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  //delete handle
  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/stores/${params.storeId}`);
      toast.success("Success!");
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isLoading}
      />
      <div className="flex items-center justify-center">
        <Heading title="Settings Page" description="Setting abou your store" />
        <Button
          variant={"destructive"}
          size={"icon"}
          onClick={() => setOpen(true)}
        >
          <Trash className="h-4 w-4 animate-bounce" />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
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
          <div className="pt-6 space-x-2 flex items-center justify-start">
            <Button disabled={isLoading} type="submit">
              Update
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default SettingForm;
