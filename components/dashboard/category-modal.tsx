"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { categorySchema, CategoryFormValues } from "@/schemas/category.schema";
import {
  createCategoryAction,
  updateCategoryAction,
} from "@/actions/category.action";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/image-upload";

interface CategoryModalProps {
  initialData?: {
    id: string;
    name: string;
    description?: string | null;
    image?: string | null;
  } | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactElement;
}

export function CategoryModal({
  initialData,
  open: externalOpen,
  onOpenChange: setExternalOpen,
  trigger,
}: CategoryModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isControlled = externalOpen !== undefined;
  const isOpen = isControlled ? externalOpen : internalOpen;
  const setOpen = isControlled ? setExternalOpen! : setInternalOpen;

  const isEditing = !!initialData;

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      image: initialData?.image || "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        description: initialData.description || "",
        image: initialData.image || "",
      });
    } else {
      form.reset({ name: "", description: "", image: "" });
    }
  }, [initialData, form]);

  const onSubmit = async (values: CategoryFormValues) => {
    setLoading(true);
    try {
      let res;
      if (isEditing && initialData) {
        res = await updateCategoryAction(initialData.id, values);
      } else {
        res = await createCategoryAction(values);
      }

      if (res.success) {
        toast.success(res.message);
        form.reset();
        setOpen(false);
      } else {
        toast.error(res.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger render={trigger} />
      ) : (
        <DialogTrigger
          render={
            <Button type="button" size="sm">
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          }
        />
      )}

      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Category" : "Create Category"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update category details below."
              : "Add a new category for providers to list their gear."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Camping" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of category"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Cover Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={(url) => field.onChange(url)}
                      disabled={loading}
                      folder="categories"
                      variant="dropzone"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Save Changes" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
