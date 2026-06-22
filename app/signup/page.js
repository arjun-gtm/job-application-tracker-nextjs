import { AuthForm } from "@/components/auth-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Sign up to start tracking your job applications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm mode="signup" />
        </CardContent>
      </Card>
    </div>
  );
}
