import { SignIn } from "@clerk/nextjs";
import { AuthLeftPanel } from "@/components/auth/auth-left-panel";

export default function SignInPage() {
  return (
    <div className="grid h-screen lg:grid-cols-2">
      <AuthLeftPanel />
      <div className="flex items-center justify-center p-8">
        <SignIn forceRedirectUrl="/dashboard" />
      </div>
    </div>
  );
}
