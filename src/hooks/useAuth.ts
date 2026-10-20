import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function check(u: User | null) {
      setUser(u);
      if (u) {
        const { data } = await supabase.from("user_roles").select("role").eq("user_id", u.id).eq("role", "admin").maybeSingle();
        setIsAdmin(!!data);
      } else setIsAdmin(false);
      setLoading(false);
    }
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setTimeout(() => check(session?.user ?? null), 0);
    });
    supabase.auth.getSession().then(({ data }) => check(data.session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  return { user, isAdmin, loading };
}
