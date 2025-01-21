import React from "react";
import Link from "next/link";
import { create } from "zustand";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

// Define the store type
interface PageStore {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

// Create the store
const usePageStore = create<PageStore>((set) => ({
  currentPage: "home",
  setCurrentPage: (page) => set({ currentPage: page }),
}));

const insurance = () => {
  const { currentPage, setCurrentPage } = usePageStore();

  const pages = [
    { id: "home", title: "Home" },
    { id: "policies", title: "Policies" },
    { id: "claims", title: "Claims" },
    { id: "profile", title: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/">
                <h1 className="text-black font-bold text-xl lg:text-3xl">
                  CEMCS<span className="text-blue-500">Insurance</span>
                </h1>
              </Link>
            </div>

            {/* Mobile menu */}
            <div className="block md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4 flex flex-col space-y-2">
                    {pages.map((page) => (
                      <Button
                        key={page.id}
                        variant={currentPage === page.id ? "default" : "ghost"}
                        onClick={() => setCurrentPage(page.id)}
                        className="w-full justify-start"
                      >
                        {page.title}
                      </Button>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop menu */}
            <nav className="hidden md:flex space-x-4">
              {pages.map((page) => (
                <Button
                  key={page.id}
                  variant={currentPage === page.id ? "default" : "ghost"}
                  onClick={() => setCurrentPage(page.id)}
                >
                  {page.title}
                </Button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-6">
          {currentPage === "home" && <div>Home Page Content</div>}
          {currentPage === "policies" && <div>Policies Page Content</div>}
          {currentPage === "claims" && <div>Claims Page Content</div>}
          {currentPage === "profile" && <div>Profile Page Content</div>}
        </Card>
      </main>
    </div>
  );
};

export default insurance;
