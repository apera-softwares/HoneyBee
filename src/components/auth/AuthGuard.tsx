"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppSelector } from "@/lib/redux/hooks";




export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const loggedInUser = useAppSelector((state)=>state.user.user);

  useEffect(() => {
    if (!loggedInUser) {
      router.replace("/signin");
    }
  }, [loggedInUser]);

  if (!loggedInUser) return null;

  return <>{children}</>;
}
