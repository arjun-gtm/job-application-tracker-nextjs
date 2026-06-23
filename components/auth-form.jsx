"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Enter a valid email."),
  password: z.string().min(1, "Password is required."),
});

const signupSchema = z.object({
  name: z.string().trim().optional(),
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Enter a valid email."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(72, "Password must be 72 characters or fewer."),
});

export function AuthForm({ mode }) {
  const router = useRouter();
  const isSignup = mode === "signup";
  const [submitError, setSubmitError] = useState("");

  const form = useForm({
    resolver: zodResolver(isSignup ? signupSchema : loginSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    setSubmitError("");
    try {
      const url = isSignup ? "/api/auth/signup" : "/api/auth/login";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await res.json();

      if (result.success) {
        toast.success(isSignup ? "Account created." : "Welcome back.");
        router.push("/");
        router.refresh();
      } else {
        setSubmitError(result.message || "Something went wrong.");
        toast.error(result.message || "Something went wrong.");
      }
    } catch (err) {
      setSubmitError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {isSignup ? (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : null}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {submitError ? (
          <p className="text-sm font-medium text-destructive">{submitError}</p>
        ) : null}

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting
            ? "Please wait..."
            : isSignup
              ? "Create account"
              : "Log in"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-foreground underline">
                Log in
              </Link>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-medium text-foreground underline">
                Sign up
              </Link>
            </>
          )}
        </p>
      </form>
    </Form>
  );
}
