import { useAuth } from "@/utils/auth/useAuth";
import { useQuery } from "@tanstack/react-query";

export default function useUser() {
  const { auth, isReady } = useAuth();

  const {
    data,
    isLoading: loading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["user", auth?.user?.id],
    queryFn: async () => {
      if (!auth?.user) return null;

      // Fetch user role from API
      try {
        const response = await fetch("/api/user/role");

        // Si no está autenticado, retornar null sin error
        if (response.status === 401) {
          return null;
        }

        if (!response.ok) {
          console.log("Failed to fetch user role, using cached user data");
          // Return user without role if fetch fails
          return auth.user;
        }

        const { role } = await response.json();

        // Return user with role from database
        return {
          ...auth.user,
          role,
        };
      } catch (err) {
        console.error("Error fetching user role:", err);
        // Return user without role if fetch fails
        return auth.user;
      }
    },
    enabled: isReady && !!auth?.user,
    retry: false,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when app comes back to focus
    refetchOnReconnect: false, // Don't refetch on reconnect
  });

  return {
    data: data || null,
    loading,
    refetch,
    error,
  };
}
