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
import { Cuisine } from "@/type-db";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface CuisineFormProps {
  initialData: Cuisine;
}
const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});
const CuisineForm = ({ initialData }: CuisineFormProps) => {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      value: initialData?.value || "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const urlBack = `/${params.storeId}/cuisines`;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/stores/${params.storeId}/cuisines/${params.cuisineId}`,
          data
        );
      } else {
        await axios.post(`/api/stores/${params.storeId}/cuisines`, data);
      }
      toast.success("Success!");
      router.push(urlBack);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      router.refresh();
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(
        `/api/stores/${params.storeId}/cuisines/${params.cuisineId}`
      );

      toast.success("Success!");
      router.refresh();
      router.push(urlBack);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      router.refresh();
      setIsLoading(false);
    }
  };

  const title = initialData ? "Edit cuisine" : "Create cuisine";
  const description = initialData ? "Edit a cuisine" : "Create a cuisine";
  const actionButtonLabel = initialData ? "Update" : "Create";

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isLoading}
      />
      <div className="flex items-center justify-center rounded-2xl">
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
          <div className="flex items-center w-full gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="lg:w-[30%] w-[45%]">
                  <FormLabel>Cuisine name</FormLabel>
                  <FormControl>
                    <Input
                      className="mt-6"
                      disabled={isLoading}
                      placeholder="Cuisine name..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem className="lg:w-[30%] w-[45%]">
                  <FormLabel>From</FormLabel>
                  <FormControl>
                    <Input
                      className="mt-6"
                      disabled={isLoading}
                      placeholder="Cuisine name..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="pt-6 space-x-2 flex items-center justify-start">
            <Button disabled={isLoading} type="submit">
              {actionButtonLabel}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default CuisineForm;
