"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Sun, Moon, Monitor } from "lucide-react";

const themeOptions = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b py-3 last:border-0">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex h-full min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center border-b bg-card px-6">
          <div>
            <h1 className="text-lg font-semibold">Settings</h1>
            <p className="text-sm text-muted-foreground">
              Manage your preferences and app information.
            </p>
          </div>
        </header>

        <main className="flex-1 space-y-6 p-6">
          <Card className="mx-auto w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Choose how the app looks on your device.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  const isActive = mounted && theme === option.value;
                  return (
                    <Button
                      key={option.value}
                      variant={isActive ? "default" : "outline"}
                      onClick={() => setTheme(option.value)}
                    >
                      <Icon className="size-4" />
                      {option.label}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
