import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Cobe } from "./codeglobe";

function LandingHero() {
    
  return (
    <div>
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center px-8 py-12 pt-4 lg:px-12 lg:py-24">
        <div className="mx-auto mb-8 max-w-2xl py-8 sm:py-8 lg:py-8">
          <div className="hidden sm:flex sm:justify-center"></div>
          <div className="mt-2 text-center">
            <h1 className="text-4xl font-black tracking-tight text-slate-800 sm:text-6xl">
              Welcome to the CEMCS Experience platform.
            </h1>
            <p className="mt-6 text-base font-light leading-8 text-secondary-foreground text-slate-500 sm:text-lg">
              The site is currently under construction. <span className="font-bold text-blue-500">COMING SOON!!!</span>
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
                <div>
                    <Link href="/shop">
                        <Button
                            className="h-12 w-44 rounded-md"
                        >
                            Ecommerce Store
                        </Button>
                    </Link>
                </div>
                <div>
                    <Link href="#">
                        <Button
                            className="h-12 w-44 rounded-md"
                        >
                            Reservations
                        </Button>
                    </Link>
                </div>
            </div>
            <Cobe />
          </div>
        </div>
      </div>
    </div>
  );
}


export default LandingHero;
