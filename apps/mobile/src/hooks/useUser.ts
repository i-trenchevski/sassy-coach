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
    }

    // Always try to sync from API (restores data after re-login when cache is empty)
    try {
      const { user: remote } = await api.getUser();
      setUser(remote);
      await saveUser(remote);
    } catch {
      // API unreachable — use cached data if available
      if (!cached) setUser(null);
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

    // Sync to API
    try {
      await api.updateUser(updates);
    } catch {
      // API unreachable — local update is fine, will sync later
    }
  }, []);

  return { user, loading, reload, updateUser, setUser };
}
