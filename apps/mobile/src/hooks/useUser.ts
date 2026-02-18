import { useState, useEffect, useCallback } from "react";
import type { User } from "@sassy-coach/shared";
import { getUser, saveUser } from "@/utils/storage";
import { api } from "@/utils/api";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const cached = await getUser();
    if (cached) {
      setUser(cached);

      // Try to sync from API
      try {
        const { user: remote } = await api.getUser(cached.id);
        setUser(remote);
        await saveUser(remote);
      } catch {
        // API unreachable — cached data is fine
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const updateUser = useCallback(async (updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      saveUser(updated);
      return updated;
    });
  }, []);

  return { user, loading, reload, updateUser, setUser };
}
