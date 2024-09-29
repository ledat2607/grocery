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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { storage } from "@/lib/firebase";
import { Billboards, Category } from "@/type-db";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { deleteObject, ref } from "firebase/storage";
import { Trash } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface CategoryFormProps {
  initialData: Category;
  billboards: Billboards[];
}
const formSchema = z.object({
  name: z.string().min(1),
  billboardLabel: z.string().min(1),
});
const CategoryForm = ({ initialData, billboards }: CategoryFormProps) => {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const urlBack = `/${params.storeId}/categories`;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/stores/${params.storeId}/categories/${params.categoryId}`,
          data
        );
      } else {
        await axios.post(`/api/stores/${params.storeId}/categories`, data);
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
        `/api/stores/${params.storeId}/categories/${params.categoryId}`
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

  const title = initialData ? "Edit category" : "Create category";
  const description = initialData ? "Edit a category" : "Create a category";
  const actionButtonLabel = initialData ? "Update" : "Create";

  console.log(initialData, billboards);
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
          <div className="flex items-center w-full">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="lg:w-[30%] w-[45%]">
                  <FormLabel>Category name</FormLabel>
                  <FormControl>
                    <Input
                      className="mt-6"
                      disabled={isLoading}
                      placeholder="Category name..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="billboardLabel"
              render={({ field }) => (
                <FormItem className="ml-6 lg:w-[20%] w-[45%]">
                  <FormLabel>Billboard</FormLabel>
                  <FormControl>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a billboard"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {billboards.map((billboard) => (
                          <SelectItem
                            className="h-24 flex items-center w-full"
                            key={billboard.id}
                            value={billboard.label}
                          >
                            {billboard.label}
                            {/* <Image
                            src={billboard.imageUrl}
                            alt=""
                            className="rounded-2xl"
                            width={60}
                            height={60}
                          /> */}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

export default CategoryForm;
