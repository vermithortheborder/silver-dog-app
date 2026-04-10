import { useState } from "react";
import { Alert } from "react-native";
import * as Notifications from "expo-notifications";
import {
  scheduleWalkNotification,
  scheduleExerciseNotification,
} from "@/utils/useNotifications";

export function useActivitySchedule() {
  const [walkSchedules, setWalkSchedules] = useState([]);
  const [exerciseSchedules, setExerciseSchedules] = useState([]);
  const [showWalkModal, setShowWalkModal] = useState(false);
  const [showExerciseModal, setShowExerciseModal] = useState(false);

  // Estados para paseo
  const [walkTime, setWalkTime] = useState("");
  const [walkDuration, setWalkDuration] = useState("30");

  // Estados para ejercicio
  const [exerciseTime, setExerciseTime] = useState("");
  const [exerciseType, setExerciseType] = useState("jugar");

  const addWalkSchedule = async (petName) => {
    if (!walkTime.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      Alert.alert("Error", "Formato de hora inválido. Use HH:MM (ej: 07:00)");
      return;
    }

    try {
      const notificationId = await scheduleWalkNotification({
        petName,
        time: walkTime,
        duration: walkDuration,
      });

      const newSchedule = {
        id: notificationId,
        time: walkTime,
        duration: walkDuration,
      };

      setWalkSchedules([...walkSchedules, newSchedule]);
      setShowWalkModal(false);
      setWalkTime("");
      setWalkDuration("30");

      Alert.alert(
        "✅ ¡Paseo Programado!",
        `Se enviará una notificación diaria a las ${walkTime} para pasear a ${petName}`,
      );
    } catch (error) {
      console.error("Error scheduling walk:", error);
      Alert.alert("Error", "No se pudo programar el paseo");
    }
  };

  const removeWalkSchedule = async (scheduleId) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(scheduleId);
      setWalkSchedules(walkSchedules.filter((s) => s.id !== scheduleId));
      Alert.alert("✅ Eliminado", "Paseo eliminado correctamente");
    } catch (error) {
      console.error("Error removing walk:", error);
      Alert.alert("Error", "No se pudo eliminar el paseo");
    }
  };

  const addExerciseSchedule = async (petName) => {
    if (!exerciseTime.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      Alert.alert("Error", "Formato de hora inválido. Use HH:MM (ej: 08:00)");
      return;
    }

    try {
      const notificationId = await scheduleExerciseNotification({
        petName,
        time: exerciseTime,
        activityType: exerciseType,
      });

      const newSchedule = {
        id: notificationId,
        time: exerciseTime,
        activityType: exerciseType,
      };

      setExerciseSchedules([...exerciseSchedules, newSchedule]);
      setShowExerciseModal(false);
      setExerciseTime("");
      setExerciseType("jugar");

      Alert.alert(
        "✅ ¡Ejercicio Programado!",
        `Se enviará una notificación diaria a las ${exerciseTime} para ${exerciseType} con ${petName}`,
      );
    } catch (error) {
      console.error("Error scheduling exercise:", error);
      Alert.alert("Error", "No se pudo programar el ejercicio");
    }
  };

  const removeExerciseSchedule = async (scheduleId) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(scheduleId);
      setExerciseSchedules(
        exerciseSchedules.filter((s) => s.id !== scheduleId),
      );
      Alert.alert("✅ Eliminado", "Ejercicio eliminado correctamente");
    } catch (error) {
      console.error("Error removing exercise:", error);
      Alert.alert("Error", "No se pudo eliminar el ejercicio");
    }
  };

  return {
    // Paseos
    walkSchedules,
    showWalkModal,
    setShowWalkModal,
    walkTime,
    setWalkTime,
    walkDuration,
    setWalkDuration,
    addWalkSchedule,
    removeWalkSchedule,

    // Ejercicios
    exerciseSchedules,
    showExerciseModal,
    setShowExerciseModal,
    exerciseTime,
    setExerciseTime,
    exerciseType,
    setExerciseType,
    addExerciseSchedule,
    removeExerciseSchedule,
  };
}
