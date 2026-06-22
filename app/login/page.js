import { AuthForm } from "@/components/auth-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Log in</CardTitle>
          <CardDescription>
            Welcome back. Enter your details to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm mode="login" />
        </CardContent>
      </Card>
    </div>
  );
}
