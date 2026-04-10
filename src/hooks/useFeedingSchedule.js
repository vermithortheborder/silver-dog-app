import { useState } from "react";
import { Alert } from "react-native";
import {
  scheduleFeedingNotification,
  cancelFeedingNotifications,
} from "@/utils/useNotifications";

export function useFeedingSchedule() {
  const [feedingSchedules, setFeedingSchedules] = useState([]);
  const [showFeedingModal, setShowFeedingModal] = useState(false);
  const [feedingTime, setFeedingTime] = useState("");
  const [feedingMealType, setFeedingMealType] = useState("desayuno");

  const addFeedingSchedule = async (petName) => {
    if (!feedingTime.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      Alert.alert("Error", "Formato de hora inválido. Use HH:MM (ej: 08:00)");
      return;
    }

    try {
      const notificationId = await scheduleFeedingNotification({
        petName,
        time: feedingTime,
        mealType: feedingMealType,
      });

      const newSchedule = {
        id: notificationId,
        time: feedingTime,
        mealType: feedingMealType,
      };

      setFeedingSchedules([...feedingSchedules, newSchedule]);
      setShowFeedingModal(false);
      setFeedingTime("");
      setFeedingMealType("desayuno");

      Alert.alert(
        "✅ ¡Recordatorio Programado!",
        `Se enviará una notificación diaria a las ${feedingTime} para ${feedingMealType}`,
      );
    } catch (error) {
      console.error("Error scheduling feeding:", error);
      Alert.alert("Error", "No se pudo programar el recordatorio");
    }
  };

  const removeFeedingSchedule = async (scheduleId) => {
    try {
      await cancelFeedingNotifications(scheduleId);
      setFeedingSchedules(feedingSchedules.filter((s) => s.id !== scheduleId));
      Alert.alert("✅ Eliminado", "Recordatorio eliminado correctamente");
    } catch (error) {
      console.error("Error removing schedule:", error);
      Alert.alert("Error", "No se pudo eliminar el recordatorio");
    }
  };

  return {
    feedingSchedules,
    showFeedingModal,
    setShowFeedingModal,
    feedingTime,
    setFeedingTime,
    feedingMealType,
    setFeedingMealType,
    addFeedingSchedule,
    removeFeedingSchedule,
  };
}
