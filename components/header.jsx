import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <div>
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back, here is your job search at a glance.
        </p>
      </div>
      <Button asChild>
        <Link href="/applications/new">
          <PlusCircle className="size-4" />
          Add Application
        </Link>
      </Button>
    </header>
  );
}
