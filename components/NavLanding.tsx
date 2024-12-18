import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuthStore } from "../store/authStore";



export function NavLanding() {
  const total = 0; // Placeholder for cart total
  const { logout } = useAuthStore();

  return (
    <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
      <div className="flex items-center justify-between w-full">
        <Link href="/">
          <h1 className="text-black font-bold text-xl lg:text-3xl">
            CEMCS<span className="text-blue-500">Experience</span>
          </h1>
        </Link>
        {/* <NavLandingLinks /> */}
        <div className="flex space-x-5">
          <Link href="/signin">
            <Button>
              Sign In
            </Button>
          </Link>
          <div>
            <Button onClick={logout}>
              Log Out
            </Button>
          </div>
        </div>
      </div>

      
    </nav>
  );
}
