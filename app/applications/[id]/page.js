"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteApplicationDialog } from "@/components/delete-application-dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Pencil, ArrowLeft } from "lucide-react";

const statusVariants = {
  APPLIED: "secondary",
  INTERVIEWING: "default",
  OFFER: "default",
  REJECTED: "destructive",
};

const jobTypeLabels = {
  INTERNSHIP: "Internship",
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
};

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function DetailRow({ label, children }) {
  return (
    <div className="flex flex-col gap-1 border-b py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm font-medium text-muted-foreground">
        {label}
      </span>
      <span className="text-sm">{children}</span>
    </div>
  );
}

export default function ViewApplicationPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadApplication() {
      try {
        setLoading(true);
        const res = await fetch(`/api/applications/${id}`);
        const result = await res.json();
        if (result.success) {
          setApplication(result.data);
        } else {
          setError(result.message || "Failed to load application.");
        }
      } catch (err) {
        setError("Something went wrong while loading the application.");
      } finally {
        setLoading(false);
      }
    }

    loadApplication();
  }, [id]);

  return (
    <div className="flex h-full min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-card px-6">
          <div>
            <h1 className="text-lg font-semibold">Application Details</h1>
            <p className="text-sm text-muted-foreground">
              View the full details of this application.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/applications">
              <ArrowLeft className="size-4" />
              Back
            </Link>
          </Button>
        </header>

        <main className="flex-1 p-6">
          {loading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Loading application...
            </p>
          ) : error ? (
            <p className="py-8 text-center text-sm text-destructive">
              {error}
            </p>
          ) : application ? (
            <Card className="mx-auto max-w-2xl">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle>{application.jobTitle}</CardTitle>
                    <CardDescription>{application.companyName}</CardDescription>
                  </div>
                  <Badge
                    variant={statusVariants[application.status] || "secondary"}
                  >
                    {application.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <DetailRow label="Company Name">
                    {application.companyName}
                  </DetailRow>
                  <DetailRow label="Job Title">
                    {application.jobTitle}
                  </DetailRow>
                  <DetailRow label="Job Type">
                    {jobTypeLabels[application.jobType] || application.jobType}
                  </DetailRow>
                  <DetailRow label="Status">{application.status}</DetailRow>
                  <DetailRow label="Applied Date">
                    {formatDate(application.appliedDate)}
                  </DetailRow>
                  <DetailRow label="Notes">
                    {application.notes || "-"}
                  </DetailRow>
                  <DetailRow label="Created">
                    {formatDate(application.createdAt)}
                  </DetailRow>
                  <DetailRow label="Last Updated">
                    {formatDate(application.updatedAt)}
                  </DetailRow>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button asChild>
                    <Link href={`/applications/${application.id}/edit`}>
                      <Pencil className="size-4" />
                      Edit
                    </Link>
                  </Button>
                  <DeleteApplicationDialog
                    application={application}
                    onDeleted={() => router.push("/applications")}
                  />
                </div>
              </CardContent>
            </Card>
          ) : null}
        </main>
      </div>
    </div>
  );
}
