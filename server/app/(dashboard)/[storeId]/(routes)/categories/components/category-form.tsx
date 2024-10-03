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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Billboards, Category } from "@/type-db";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
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
  billboardId: z.string().min(1),
  billboardLabel: z.string().min(1),
});
const CategoryForm = ({ initialData, billboards }: CategoryFormProps) => {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      billboardId: "",
      billboardLabel: "",
    },
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
              name="billboardId"
              render={({ field }) => (
                <FormItem className="ml-6 lg:w-[20%] w-[45%]">
                  <FormLabel>Billboard</FormLabel>
                  <FormControl>
                    <Select
                      disabled={isLoading}
                      onValueChange={(value) => {
                        field.onChange(value); // Cập nhật giá trị form khi chọn một billboard mới
                        form.setValue(
                          "billboardLabel",
                          billboards.find((b) => b.id === value)?.label || ""
                        );
                      }}
                      value={field.value} // Sử dụng giá trị từ form
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a billboard" />
                      </SelectTrigger>

                      <SelectContent>
                        {billboards.map((billboard) => (
                          <SelectItem key={billboard.id} value={billboard.id}>
                            <div className="flex items-center justify-between w-full space-x-4">
                              <span className="flex-grow">
                                {billboard.label}
                              </span>
                              <Image
                                src={billboard.imageUrl}
                                alt={billboard.label}
                                className="rounded-2xl"
                                width={60}
                                height={60}
                              />
                            </div>
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
          <div
            className={`${
              isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            } bg-slate-800 text-white flex items-center justify-center mt-6 w-[100px] py-2 px-4 rounded hover:bg-slate-800 transition`}
            onClick={() => {
              if (!isLoading) {
                const formData = form.getValues();
                onSubmit(formData);
              }
            }}
          >
            {actionButtonLabel}
          </div>
        </form>
      </Form>
    </>
  );
};

export default CategoryForm;
