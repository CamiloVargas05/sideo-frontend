"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function useSidebar() {
  const router  = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      setUser(stored);
    } catch {
      setUser({});
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth/login");
  }

  const displayName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Admin Usuario"
    : "Admin Usuario";

  const displayEmail = user?.email ?? "";

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "AU";

  const role = (user?.role ?? "").toLowerCase();

  return { user, role, displayName, displayEmail, initials, handleLogout };
}
