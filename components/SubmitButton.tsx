"use client";

import { Button } from "@/components/ui/button";
import { Loader2, ShoppingBag } from "lucide-react";
import Link from "next/link";

interface buttonProps {
  text: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
}

export function SubmitButton({ text, variant }: buttonProps) {
  return (
    <Button variant={variant} type="submit">
      {text}
    </Button>
  );
}

export function ShoppingBagButton() {
  return (
    <Link href="/cart">
        <Button size="lg" className="w-full mt-5" type="submit">
        <ShoppingBag className="mr-4 h-5 w-5" /> Add to Cart
        </Button>
    </Link>
  );
}

export function DeleteItem() {
  return (
    <button type="submit" className="font-medium text-primary text-end">
      Delete
    </button>
  );
}

export function CheckoutButton() {
  return (
    <Button type="submit" size="lg" className="w-full mt-5 bg-blue-500">
      Checkout
    </Button>
  );
}
