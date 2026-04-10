import { useEffect, useState, useRef } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

// Configurar el comportamiento de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
      // 💾 Guardar token en el backend
      if (token) {
        savePushTokenToBackend(token);
      }
    });

    // Escuchar notificaciones recibidas
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    // Escuchar respuestas a notificaciones (cuando el usuario toca la notificación)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response:", response);
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  // Solo retornar el estado, no las funciones
  return {
    expoPushToken,
    notification,
  };
}

// 💾 Guardar token en el backend
async function savePushTokenToBackend(token) {
  try {
    await fetch("/api/push-tokens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pushToken: token }),
    });
    console.log("✅ Push token saved to backend");
  } catch (error) {
    console.error("Error saving push token:", error);
  }
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF6B00",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("No se otorgaron permisos para notificaciones push");
    return;
  }

  try {
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (projectId) {
      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log("Push token:", token);
    }
  } catch (e) {
    console.error("Error getting push token:", e);
  }

  return token;
}

// Programar una notificación local
export async function scheduleLocalNotification({
  title,
  body,
  data,
  trigger,
}) {
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: data || {},
      sound: true,
    },
    trigger: trigger || { seconds: 2 },
  });

  return id;
}

// Cancelar todas las notificaciones programadas
export async function cancelAllScheduledNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// 🎓 Programar recordatorio de clase
export async function scheduleClassReminder(scheduledClass) {
  const classDate = new Date(scheduledClass.scheduled_date);
  const now = new Date();

  // Notificar 1 hora antes de la clase
  const triggerDate = new Date(classDate);
  triggerDate.setHours(triggerDate.getHours() - 1);

  if (triggerDate > now) {
    const secondsUntilTrigger = Math.floor((triggerDate - now) / 1000);

    return await scheduleLocalNotification({
      title: "🐾 Recordatorio de Clase",
      body: `Tu clase comienza en 1 hora`,
      data: {
        classId: scheduledClass.id,
        type: "class_reminder",
        courseId: scheduledClass.course_id,
      },
      trigger: { seconds: secondsUntilTrigger },
    });
  }

  return null;
}

// 💬 Notificación instantánea de mensaje de chat
export async function scheduleChatNotification(message) {
  return await scheduleLocalNotification({
    title: `💬 Nuevo mensaje de ${message.instructor_name}`,
    body:
      message.message.length > 50
        ? message.message.substring(0, 50) + "..."
        : message.message,
    data: {
      messageId: message.id,
      type: "chat_message",
      instructorName: message.instructor_name,
    },
    trigger: { seconds: 2 }, // Notificación inmediata
  });
}

// Programar recordatorio médico
export async function scheduleReminderNotification(reminder) {
  const dueDate = new Date(reminder.due_date);
  const now = new Date();

  // Calcular cuándo enviar la notificación (1 día antes)
  const triggerDate = new Date(dueDate);
  triggerDate.setDate(triggerDate.getDate() - 1);

  // Solo programar si la fecha es futura
  if (triggerDate > now) {
    const secondsUntilTrigger = Math.floor((triggerDate - now) / 1000);

    let icon = "💉";
    if (reminder.reminder_type === "desparacitacion") icon = "💊";
    if (reminder.reminder_type === "medicamento") icon = "💊";
    if (reminder.reminder_type === "revision") icon = "🩺";

    return await scheduleLocalNotification({
      title: `${icon} Recordatorio Veterinario`,
      body: `Mañana: ${reminder.title}`,
      data: { reminderId: reminder.id, type: reminder.reminder_type },
      trigger: { seconds: secondsUntilTrigger },
    });
  }

  return null;
}

// 🍖 Programar recordatorio de alimentación
export async function scheduleFeedingNotification({ petName, time, mealType }) {
  // time debe ser en formato "HH:MM" (ej: "08:00", "18:30")
  const [hours, minutes] = time.split(":").map(Number);

  const now = new Date();
  const scheduledDate = new Date();
  scheduledDate.setHours(hours, minutes, 0, 0);

  // Si la hora ya pasó hoy, programar para mañana
  if (scheduledDate <= now) {
    scheduledDate.setDate(scheduledDate.getDate() + 1);
  }

  const secondsUntilTrigger = Math.floor((scheduledDate - now) / 1000);

  const mealEmojis = {
    desayuno: "🌅",
    comida: "🍽️",
    cena: "🌙",
    snack: "🦴",
  };

  const emoji = mealEmojis[mealType] || "🍖";

  return await scheduleLocalNotification({
    title: `${emoji} Hora de ${mealType} para ${petName}`,
    body: `Es hora de alimentar a ${petName}`,
    data: {
      type: "feeding_reminder",
      petName,
      mealType,
      time,
    },
    trigger: {
      seconds: secondsUntilTrigger,
      repeats: true,
      type: "timeInterval",
    },
  });
}

// Cancelar notificaciones de alimentación específicas
export async function cancelFeedingNotifications() {
  const scheduledNotifications =
    await Notifications.getAllScheduledNotificationsAsync();

  // Filtrar y cancelar solo las notificaciones de alimentación
  for (const notification of scheduledNotifications) {
    if (notification.content.data.type === "feeding_reminder") {
      await Notifications.cancelScheduledNotificationAsync(
        notification.identifier,
      );
    }
  }
}

// 🚶 Programar recordatorio de paseo
export async function scheduleWalkNotification({ petName, time, duration }) {
  // time debe ser en formato "HH:MM" (ej: "07:00", "18:00")
  const [hours, minutes] = time.split(":").map(Number);

  const now = new Date();
  const scheduledDate = new Date();
  scheduledDate.setHours(hours, minutes, 0, 0);

  // Si la hora ya pasó hoy, programar para mañana
  if (scheduledDate <= now) {
    scheduledDate.setDate(scheduledDate.getDate() + 1);
  }

  const secondsUntilTrigger = Math.floor((scheduledDate - now) / 1000);

  const durationText = duration ? ` (${duration} min)` : "";

  return await scheduleLocalNotification({
    title: `🐕 Hora del paseo de ${petName}`,
    body: `Es momento de sacar a ${petName} a pasear${durationText}`,
    data: {
      type: "walk_reminder",
      petName,
      time,
      duration,
    },
    trigger: {
      seconds: secondsUntilTrigger,
      repeats: true,
      type: "timeInterval",
    },
  });
}

// 🏃 Programar recordatorio de ejercicio
export async function scheduleExerciseNotification({
  petName,
  time,
  activityType,
}) {
  // time debe ser en formato "HH:MM" (ej: "08:00", "17:00")
  const [hours, minutes] = time.split(":").map(Number);

  const now = new Date();
  const scheduledDate = new Date();
  scheduledDate.setHours(hours, minutes, 0, 0);

  // Si la hora ya pasó hoy, programar para mañana
  if (scheduledDate <= now) {
    scheduledDate.setDate(scheduledDate.getDate() + 1);
  }

  const secondsUntilTrigger = Math.floor((scheduledDate - now) / 1000);

  const activityEmojis = {
    correr: "🏃",
    jugar: "🎾",
    nadar: "🏊",
    entrenar: "🎯",
  };

  const emoji = activityEmojis[activityType] || "💪";
  const activityText = activityType ? `${activityType}` : "hacer ejercicio";

  return await scheduleLocalNotification({
    title: `${emoji} Ejercicio para ${petName}`,
    body: `¡Es hora de ${activityText} con ${petName}!`,
    data: {
      type: "exercise_reminder",
      petName,
      time,
      activityType,
    },
    trigger: {
      seconds: secondsUntilTrigger,
      repeats: true,
      type: "timeInterval",
    },
  });
}

// Cancelar notificaciones de paseo
export async function cancelWalkNotifications() {
  const scheduledNotifications =
    await Notifications.getAllScheduledNotificationsAsync();

  for (const notification of scheduledNotifications) {
    if (notification.content.data.type === "walk_reminder") {
      await Notifications.cancelScheduledNotificationAsync(
        notification.identifier,
      );
    }
  }
}

// Cancelar notificaciones de ejercicio
export async function cancelExerciseNotifications() {
  const scheduledNotifications =
    await Notifications.getAllScheduledNotificationsAsync();

  for (const notification of scheduledNotifications) {
    if (notification.content.data.type === "exercise_reminder") {
      await Notifications.cancelScheduledNotificationAsync(
        notification.identifier,
      );
    }
  }
}
