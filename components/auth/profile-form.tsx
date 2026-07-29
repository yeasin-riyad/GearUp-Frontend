"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, User as UserIcon, Phone, MapPin, Building, Mail, Lock } from "lucide-react";
import { toast } from "sonner";

import { updateProfileAction } from "@/actions/profile";
import { ProfileFormValues, profileSchema } from "@/schemas/profile";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "../image-upload";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  role: "CUSTOMER" | "PROVIDER" | "ADMIN";
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  address?: string | null;
  city?: string | null;
}

interface ProfileFormProps {
  user: User;
  token?: string;
  onSuccess?: (updatedUser: User) => void;
}

export function ProfileForm({ user, token, onSuccess }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Computed Fallback Initials
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "GU";

  // Form Setup
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      avatar: user.avatar || "",
      address: user.address || "",
      city: user.city || "",
    },
  });

  const watchAvatar = form.watch("avatar");

  // Call Server Action
  async function onSubmit(data: ProfileFormValues) {
    setIsSubmitting(true);

    const result = await updateProfileAction(data, token);

    if (!result.success) {
      toast.error("Profile Update Failed", {
        description: result.error || "Failed to update profile",
      });
      setIsSubmitting(false);
      return;
    }

    toast.success("Profile Updated", {
      description: "Your profile details have been saved successfully.",
    });

    // Reset form dirty state with new submitted values
    form.reset(data);
    setIsSubmitting(false);

    if (onSuccess && result.data) {
      onSuccess(result.data);
    }
  }

  return (
    <Card className="max-w-2xl mx-auto shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Profile Settings</CardTitle>
            <CardDescription>Update your personal account details and address.</CardDescription>
          </div>
          <Badge
            variant={user.role === "ADMIN" ? "destructive" : user.role === "PROVIDER" ? "default" : "secondary"}
            className="uppercase text-xs tracking-wider"
          >
            {user.role}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Avatar Section using standalone ImageUpload component */}
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col sm:flex-row items-center gap-6 pb-4 border-b border-border/60">
                    <Avatar className="h-24 w-24 ring-2 ring-primary/20">
                      <AvatarImage src={watchAvatar || user.avatar || ""} alt={user.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-2 text-center sm:text-left">
                      <h4 className="text-sm font-semibold text-foreground">Profile Picture</h4>
                      <p className="text-xs text-muted-foreground">
                        Upload a new image file (PNG, JPG up to 5MB).
                      </p>
                      
                      <FormControl>
                        <ImageUpload
                          value={field.value}
                          onChange={(url) => field.onChange(url)}
                          disabled={isSubmitting}
                          folder="avatars"
                          variant="avatar"
                        />
                      </FormControl>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="John Doe" className="pl-9" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="+1 234 567 890" className="pl-9" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Read-only Email Address */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    Email Address
                    <Lock className="h-3 w-3 text-muted-foreground" />
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        readOnly
                        disabled
                        placeholder="john@example.com"
                        type="email"
                        className="pl-9 bg-muted/60 cursor-not-allowed text-muted-foreground"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="123 Main Street" className="pl-9" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="New York" className="pl-9" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isSubmitting || !form.formState.isDirty}
              >
                Reset
              </Button>

              <Button type="submit" disabled={isSubmitting || !form.formState.isDirty}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}