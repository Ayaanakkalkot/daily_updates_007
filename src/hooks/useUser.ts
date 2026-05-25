"use client";

import { useState, useEffect } from "react";

type User = { username: string; displayName: string } | null;

export function useUser() {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.displayName) setUser(data);
      })
      .catch(() => {});
  }, []);

  return user;
}
