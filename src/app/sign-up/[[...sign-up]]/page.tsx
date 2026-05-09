import { SignUp } from "@clerk/nextjs";
import { AuthLeftPanel } from "@/components/auth/auth-left-panel";

export default function SignUpPage() {
  return (
    <div className="grid h-screen lg:grid-cols-2">
      <AuthLeftPanel variant="sign-up" />
      <div className="flex items-center justify-center p-8">
        <SignUp forceRedirectUrl="/dashboard" />
      </div>
    </div>
  );
}
