"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteApplicationDialog } from "@/components/delete-application-dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Pencil, PlusCircle, Eye, Search, Inbox } from "lucide-react";

const statusVariants = {
  APPLIED: "secondary",
  INTERVIEWING: "default",
  OFFER: "default",
  REJECTED: "destructive",
};

const statusOptions = [
  { value: "ALL", label: "All Statuses" },
  { value: "APPLIED", label: "Applied" },
  { value: "INTERVIEWING", label: "Interviewing" },
  { value: "OFFER", label: "Offer" },
  { value: "REJECTED", label: "Rejected" },
];

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("ALL");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    async function loadApplications() {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        if (status && status !== "ALL") {
          params.set("status", status);
        }
        if (debouncedSearch) {
          params.set("search", debouncedSearch);
        }

        const query = params.toString();
        const res = await fetch(
          `/api/applications${query ? `?${query}` : ""}`
        );
        const result = await res.json();

        if (result.success) {
          setApplications(result.data);
        } else {
          toast.error(result.message || "Failed to load applications.");
        }
      } catch (err) {
        toast.error("Something went wrong while loading applications.");
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, [status, debouncedSearch]);

  function handleDeleted(id) {
    setApplications((current) => current.filter((item) => item.id !== id));
    toast.success("Application deleted.");
  }

  const hasFilters = status !== "ALL" || debouncedSearch !== "";

  return (
    <div className="flex h-full min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-card px-6">
          <div>
            <h1 className="text-lg font-semibold">Applications</h1>
            <p className="text-sm text-muted-foreground">
              All of your job applications in one place.
            </p>
          </div>
          <Button asChild>
            <Link href="/applications/new">
              <PlusCircle className="size-4" />
              Add Application
            </Link>
          </Button>
        </header>

        <main className="flex-1 p-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Applications</CardTitle>
              <CardDescription>
                Filter and search through your applications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by company or job title..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="sm:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((row) => (
                    <div key={row} className="flex items-center gap-4">
                      <Skeleton className="h-6 flex-1" />
                      <Skeleton className="h-6 flex-1" />
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-6 w-28" />
                      <Skeleton className="h-6 w-28" />
                    </div>
                  ))}
                </div>
              ) : applications.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                    <Inbox className="size-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      No applications found
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {hasFilters
                        ? "Try adjusting your search or filter."
                        : "Add your first application to get started."}
                    </p>
                  </div>
                  {!hasFilters ? (
                    <Button asChild>
                      <Link href="/applications/new">
                        <PlusCircle className="size-4" />
                        Add Application
                      </Link>
                    </Button>
                  ) : null}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company Name</TableHead>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell className="font-medium">
                          {application.companyName}
                        </TableCell>
                        <TableCell>{application.jobTitle}</TableCell>
                        <TableCell>
                          {formatDate(application.appliedDate)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              statusVariants[application.status] || "secondary"
                            }
                          >
                            {application.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button asChild variant="outline" size="icon">
                              <Link href={`/applications/${application.id}`}>
                                <Eye className="size-4" />
                              </Link>
                            </Button>
                            <Button asChild variant="outline" size="icon">
                              <Link
                                href={`/applications/${application.id}/edit`}
                              >
                                <Pencil className="size-4" />
                              </Link>
                            </Button>
                            <DeleteApplicationDialog
                              application={application}
                              onDeleted={handleDeleted}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
