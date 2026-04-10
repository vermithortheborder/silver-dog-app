import { useQuery } from "@tanstack/react-query";

export function usePetReminders(petId) {
  return useQuery({
    queryKey: ["reminders", petId],
    queryFn: async () => {
      const response = await fetch(`/api/pets/reminders?petId=${petId}`);
      if (!response.ok) throw new Error("Failed to fetch reminders");
      return response.json();
    },
    enabled: !!petId,
  });
}

export function usePetAppointments(petId) {
  return useQuery({
    queryKey: ["appointments", petId],
    queryFn: async () => {
      const response = await fetch(`/api/pets/appointments?petId=${petId}`);
      if (!response.ok) throw new Error("Failed to fetch appointments");
      return response.json();
    },
    enabled: !!petId,
  });
}

export function usePetHistory(petId) {
  return useQuery({
    queryKey: ["history", petId],
    queryFn: async () => {
      const response = await fetch(`/api/pets/history?petId=${petId}`);
      if (!response.ok) throw new Error("Failed to fetch history");
      return response.json();
    },
    enabled: !!petId,
  });
}
