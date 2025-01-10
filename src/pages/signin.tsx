import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { Building2, Users, UserRound, AlertCircle } from "lucide-react";

import signinPic from '../../public/signinPic.jpg';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuthStore } from "../../store/authStore";

interface UserType {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  baseUrl: string;
}

const userTypes: UserType[] = [
  {
    id: 'retiree',
    title: 'Retiree',
    description: 'Access your retirement portal',
    icon: UserRound,
    baseUrl: 'retiree.chevroncemcs.com'
  },
  {
    id: 'member',
    title: 'Member',
    description: 'Access your member dashboard',
    icon: Users,
    baseUrl: 'member.chevroncemcs.com'
  },
  {
    id: 'staff',
    title: 'CEMCS Staff',
    description: 'Access the ERP system',
    icon: Building2,
    baseUrl: 'erp.chevroncemcs.com'
  }
];

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<UserType | null>(null);
  const { login, isLoading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedType) {
      setError("Please select a user type");
      return;
    }

    try {
      await login(email, password, selectedType.baseUrl);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    }
  };

  const handleBack = () => {
    setSelectedType(null);
    setError(null);
    setEmail("");
    setPassword("");
  };

  if (!selectedType) {
    return (
      <div className="h-screen w-full lg:grid lg:grid-cols-2 overflow-hidden">
        <div className="flex flex-col items-center justify-center py-12 h-screen">
          <div className="mx-auto w-[350px] grid gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">Welcome Back</h1>
              <p className="text-balance text-muted-foreground">
                Please select your user type to continue
              </p>
            </div>
            
            <div className="grid gap-4">
              {userTypes.map((type) => (
                <Card 
                  key={type.id}
                  className="cursor-pointer transition-all hover:bg-accent hover:shadow-md"
                  onClick={() => setSelectedType(type)}
                >
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <type.icon className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <CardTitle>{type.title}</CardTitle>
                      <CardDescription>{type.description}</CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <div className="hidden bg-muted lg:block">
          <Image
            src={signinPic}
            alt="Sign in"
            className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full lg:grid lg:grid-cols-2 overflow-hidden">
      <div className="flex flex-col items-center justify-center py-12 h-screen relative">
        <Button 
          variant="ghost" 
          className="absolute left-4 top-4"
          onClick={handleBack}
        >
          ← Back
        </Button>
        <form onSubmit={handleSubmit} className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <div className="flex items-center justify-center gap-2">
              <selectedType.icon className="h-6 w-6" />
              <h1 className="text-3xl font-bold">{selectedType.title} Login</h1>
            </div>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/" className="underline">
              Sign up
            </Link>
          </div>
        </form>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src={signinPic}
          alt="Sign in"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}