"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { ApplicationForm } from "@/components/application-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function EditApplicationPage() {
  const params = useParams();
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
        <header className="flex h-16 items-center border-b bg-card px-6">
          <div>
            <h1 className="text-lg font-semibold">Edit Application</h1>
            <p className="text-sm text-muted-foreground">
              Update the details of this job application.
            </p>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Card className="mx-auto max-w-2xl">
            <CardHeader>
              <CardTitle>Application Details</CardTitle>
              <CardDescription>
                Make your changes below and save.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Loading application...
                </p>
              ) : error ? (
                <p className="py-8 text-center text-sm text-destructive">
                  {error}
                </p>
              ) : (
                <ApplicationForm application={application} />
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
