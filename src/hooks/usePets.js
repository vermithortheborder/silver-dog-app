import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

export function usePets(userId) {
  return useQuery({
    queryKey: ["pets", userId],
    queryFn: async () => {
      const response = await fetch("/api/pets");
      if (!response.ok) throw new Error("Failed to fetch pets");
      return response.json();
    },
    enabled: !!userId,
  });
}

export function useAddPet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (petData) => {
      const response = await fetch("/api/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(petData),
      });
      if (!response.ok) throw new Error("Failed to add pet");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pets"]);
      Alert.alert("¡Éxito!", "Mascota agregada correctamente");
    },
    onError: () => {
      Alert.alert("Error", "No se pudo agregar la mascota");
    },
  });
}

export function useUpdatePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (petData) => {
      console.log("🐕 Enviando actualización:", petData);

      if (!petData.id) {
        throw new Error("Pet ID is required");
      }

      const response = await fetch(`/api/pets/${petData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(petData),
      });

      console.log("🐕 Status de respuesta:", response.status);

      const responseData = await response.json();
      console.log(
        "🐕 Respuesta completa del servidor:",
        JSON.stringify(responseData, null, 2),
      );

      if (!response.ok) {
        // Crear mensaje de error detallado
        const errorMsg = responseData.details
          ? `${responseData.error || "Error"}: ${responseData.details}`
          : responseData.error || "Failed to update pet";

        console.error("🐕 ERROR del servidor:", errorMsg);
        throw new Error(errorMsg);
      }

      return responseData;
    },
    onSuccess: (data) => {
      console.log("🐕 Actualización exitosa:", data);
      queryClient.invalidateQueries(["pets"]);
      Alert.alert("¡Éxito!", "Información actualizada correctamente");
    },
    onError: (error) => {
      console.error("🐕 ❌ Error en la mutación:", error);
      console.error("🐕 ❌ Mensaje de error:", error.message);

      // Mostrar el error completo en el Alert
      Alert.alert(
        "Error al guardar",
        error.message || "No se pudo actualizar la información",
        [{ text: "OK" }],
      );
    },
  });
}
