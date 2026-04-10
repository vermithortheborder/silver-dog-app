import { useQuery } from "@tanstack/react-query";

export function useProfileData(userId) {
  const { data: statsData } = useQuery({
    queryKey: ["user-stats", userId],
    queryFn: async () => {
      if (!userId) return null;
      const response = await fetch(`/api/user/stats?userId=${userId}`);
      if (!response.ok) return null;
      return response.json();
    },
    enabled: !!userId,
  });

  const { data: packageStats } = useQuery({
    queryKey: ["package-stats", userId],
    queryFn: async () => {
      if (!userId) return null;
      const response = await fetch("/api/packages/stats");
      if (!response.ok) return null;
      return response.json();
    },
    enabled: !!userId,
  });

  return { statsData, packageStats };
}
