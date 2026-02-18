import { useState, useEffect, useCallback } from "react";
import type { User } from "@sassy-coach/shared";
import { getUser, saveUser } from "@/utils/storage";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  const updateUser = useCallback(async (updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      saveUser(updated);
      return updated;
    });
  }, []);

  return { user, loading, updateUser, setUser };
}
