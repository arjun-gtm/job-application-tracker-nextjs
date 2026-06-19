"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const jobTypes = [
  { value: "INTERNSHIP", label: "Internship" },
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
];

const statuses = [
  { value: "APPLIED", label: "Applied" },
  { value: "INTERVIEWING", label: "Interviewing" },
  { value: "OFFER", label: "Offer" },
  { value: "REJECTED", label: "Rejected" },
];

const formSchema = z.object({
  companyName: z.string().min(1, "Company name is required."),
  jobTitle: z.string().min(1, "Job title is required."),
  jobType: z.enum(["INTERNSHIP", "FULL_TIME", "PART_TIME"], {
    message: "Please select a job type.",
  }),
  status: z.enum(["APPLIED", "INTERVIEWING", "OFFER", "REJECTED"], {
    message: "Please select a status.",
  }),
  appliedDate: z.string().min(1, "Applied date is required."),
  notes: z.string().optional(),
});

function formatDateForInput(value) {
  if (!value) return "";
  return new Date(value).toISOString().split("T")[0];
}

export function ApplicationForm({ application }) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState("");
  const isEdit = Boolean(application);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: application?.companyName || "",
      jobTitle: application?.jobTitle || "",
      jobType: application?.jobType || "",
      status: application?.status || "APPLIED",
      appliedDate: formatDateForInput(application?.appliedDate),
      notes: application?.notes || "",
    },
  });

  async function onSubmit(values) {
    setSubmitError("");
    try {
      const url = isEdit
        ? `/api/applications/${application.id}`
        : "/api/applications";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await res.json();

      if (result.success) {
        toast.success(
          isEdit ? "Application updated." : "Application created."
        );
        router.push("/applications");
      } else {
        setSubmitError(result.message || "Failed to save application.");
        toast.error(result.message || "Failed to save application.");
      }
    } catch (err) {
      setSubmitError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Acme Corp" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="jobTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input placeholder="Frontend Developer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="jobType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a job type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {jobTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="appliedDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Applied Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any extra details about this application..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {submitError ? (
          <p className="text-sm font-medium text-destructive">{submitError}</p>
        ) : null}

        <div className="flex gap-3">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? "Saving..."
              : isEdit
                ? "Update Application"
                : "Save Application"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/applications")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
