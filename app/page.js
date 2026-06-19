"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Briefcase, Send, CalendarClock, CheckCircle2 } from "lucide-react";

const statusVariants = {
  APPLIED: "secondary",
  INTERVIEWING: "default",
  OFFER: "default",
  REJECTED: "destructive",
};

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Home() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadApplications() {
      try {
        setLoading(true);
        const res = await fetch("/api/applications");
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
  }, []);

  const stats = [
    {
      label: "Total Applications",
      value: applications.length,
      icon: Briefcase,
    },
    {
      label: "Applied",
      value: applications.filter((item) => item.status === "APPLIED").length,
      icon: Send,
    },
    {
      label: "Interviewing",
      value: applications.filter((item) => item.status === "INTERVIEWING")
        .length,
      icon: CalendarClock,
    },
    {
      label: "Offers",
      value: applications.filter((item) => item.status === "OFFER").length,
      icon: CheckCircle2,
    },
  ];

  const recent = applications.slice(0, 5);

  return (
    <div className="flex h-full min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 space-y-6 p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardDescription>{stat.label}</CardDescription>
                    <Icon className="size-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-8 w-12" />
                    ) : (
                      <p className="text-2xl font-bold">{stat.value}</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Your latest job applications.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((row) => (
                    <div
                      key={row}
                      className="flex items-center justify-between py-1"
                    >
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-6 w-20" />
                    </div>
                  ))}
                </div>
              ) : recent.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No applications yet. Add your first one to get started.
                </p>
              ) : (
                <div className="divide-y">
                  {recent.map((item) => (
                    <Link
                      key={item.id}
                      href={`/applications/${item.id}`}
                      className="flex items-center justify-between py-3 transition-colors hover:bg-muted/50"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {item.companyName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.jobTitle}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                          {formatDate(item.appliedDate)}
                        </span>
                        <Badge
                          variant={statusVariants[item.status] || "secondary"}
                        >
                          {item.status}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
