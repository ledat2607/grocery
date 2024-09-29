"use client";

import { Heading } from "@/components/heading";
import ImageUpload from "@/components/image-upload";
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
import { storage } from "@/lib/firebase";
import { Billboards, Store } from "@/type-db";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { deleteObject, ref } from "firebase/storage";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface BillboardFormProps {
  initialData: Billboards;
}
const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
});
const BillboardForm = ({ initialData }: BillboardFormProps) => {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  const router = useRouter();
  const urlBack = `/${params.storeId}/billboards`;

  //update store
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/stores/${params.storeId}/billboards/${params.billboardId}`,
          data
        );
      } else {
        await axios.post(`/api/stores/${params.storeId}/billboards`, data);
      }
      toast.success("Success!");
      router.refresh();
      router.push(urlBack);
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
      const { imageUrl } = form.getValues();

      await deleteObject(ref(storage, imageUrl)).then(async () => {
        await axios.delete(
          `/api/stores/${params.storeId}/billboards/${params.billboardId}`
        );
      });

      toast.success("Success!");
      router.refresh();
      router.push(urlBack);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  const title = initialData ? "Edit billboard" : "Create billboard";
  const description = initialData ? "Edit a billboard" : "Create a billboard";
  const actionButonLabel = initialData ? "Update" : "Create";
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isLoading}
      />
      <div className="flex items-center justify-center">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            variant={"destructive"}
            size={"icon"}
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4 animate-bounce" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image Billboard</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disable={isLoading}
                    onChange={(url) => {
                      field.onChange(url);
                    }}
                    onRemove={() => {
                      field.onChange("");
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="mt-6"
                    disabled={isLoading}
                    placeholder="Billboard label..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="pt-6 space-x-2 flex items-center justify-start">
            <Button disabled={isLoading} type="submit">
              {actionButonLabel}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default BillboardForm;
