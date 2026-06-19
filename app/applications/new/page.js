import { Sidebar } from "@/components/sidebar";
import { ApplicationForm } from "@/components/application-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function NewApplicationPage() {
  return (
    <div className="flex h-full min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center border-b bg-card px-6">
          <div>
            <h1 className="text-lg font-semibold">Add Application</h1>
            <p className="text-sm text-muted-foreground">
              Track a new job application.
            </p>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Card className="mx-auto max-w-2xl">
            <CardHeader>
              <CardTitle>Application Details</CardTitle>
              <CardDescription>
                Fill in the information below and save.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ApplicationForm />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
