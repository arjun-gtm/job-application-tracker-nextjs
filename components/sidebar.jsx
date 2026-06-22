"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  Settings,
  LogOut,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

const links = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Applications", href: "/applications", icon: Briefcase },
  { label: "Add New", href: "/applications/new", icon: PlusCircle },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        const result = await res.json();
        if (result.success) {
          setUser(result.data);
        }
      } catch (err) {
        // ignore, sidebar still renders
      }
    }

    loadUser();
  }, []);

  async function handleLogout() {
    try {
      setLoggingOut(true);
      const res = await fetch("/api/auth/logout", { method: "POST" });
      const result = await res.json();
      if (result.success) {
        toast.success("Logged out.");
        router.push("/login");
        router.refresh();
      } else {
        toast.error("Failed to log out.");
      }
    } catch (err) {
      toast.error("Something went wrong while logging out.");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-card md:flex md:flex-col">
      <div className="flex h-16 items-center justify-between border-b px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold">JobTracker</span>
        </Link>
        <ThemeToggle />
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="size-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4">
        {user ? (
          <div className="mb-3 px-1">
            <p className="truncate text-sm font-medium">
              {user.name || "Signed in"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        ) : null}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start"
              disabled={loggingOut}
            >
              <LogOut className="size-4" />
              {loggingOut ? "Logging out..." : "Log out"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Log out?</AlertDialogTitle>
              <AlertDialogDescription>
                You will need to log in again to access your applications.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={loggingOut}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(event) => {
                  event.preventDefault();
                  handleLogout();
                }}
                disabled={loggingOut}
              >
                {loggingOut ? "Logging out..." : "Log out"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </aside>
  );
}
