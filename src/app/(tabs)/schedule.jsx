import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/utils/auth/useAuth";
import { Calendar as CalendarIcon, Clock, User, X } from "lucide-react-native";
import { useAppTheme } from "@/components/AppTheme";
import AppScreen from "@/components/AppScreen";
import AppHeader from "@/components/AppHeader";
import {
  useFonts,
  Sora_400Regular,
  Sora_600SemiBold,
  Sora_800ExtraBold,
} from "@expo-google-fonts/sora";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function ScheduleScreen() {
  const { colors, isDark } = useAppTheme();
  const router = useRouter();
  const { auth, signIn } = useAuth();
  const queryClient = useQueryClient();

  const [fontsLoaded] = useFonts({
    Sora_400Regular,
    Sora_600SemiBold,
    Sora_800ExtraBold,
  });

  const { data: scheduledClasses, isLoading } = useQuery({
    queryKey: ["scheduled-classes", auth?.user?.id],
    queryFn: async () => {
      if (!auth?.user?.id) return [];
      const response = await fetch(`/api/schedule?userId=${auth.user.id}`);
      if (!response.ok) throw new Error("Failed to fetch schedule");
      return response.json();
    },
    enabled: !!auth?.user?.id,
  });

  const cancelMutation = useMutation({
    mutationFn: async (classId) => {
      const response = await fetch(`/api/schedule/${classId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to cancel class");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["scheduled-classes"]);
    },
  });

  if (!fontsLoaded) {
    return null;
  }

  const header = (
    <AppHeader
      title="Agenda"
      showBackButton={true}
      titleStyle={{
        fontFamily: "Sora_800ExtraBold",
        fontSize: 24,
      }}
    />
  );

  if (!auth?.user) {
    return (
      <AppScreen header={header}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 40,
          }}
        >
          <CalendarIcon size={64} color={colors.secondary} />
          <Text
            style={{
              fontFamily: "Sora_600SemiBold",
              fontSize: 20,
              color: colors.primary,
              marginTop: 24,
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            Inicia sesión para ver tu agenda
          </Text>
          <Text
            style={{
              fontFamily: "Sora_400Regular",
              fontSize: 14,
              color: colors.secondary,
              textAlign: "center",
              marginBottom: 32,
            }}
          >
            Agenda tus clases y ve tu horario
          </Text>
          <TouchableOpacity
            onPress={() => signIn()}
            style={{
              backgroundColor: colors.accent,
              paddingHorizontal: 32,
              paddingVertical: 14,
              borderRadius: 24,
            }}
          >
            <Text
              style={{
                fontFamily: "Sora_600SemiBold",
                fontSize: 16,
                color: "#FFFFFF",
              }}
            >
              Iniciar Sesión
            </Text>
          </TouchableOpacity>
        </View>
      </AppScreen>
    );
  }

  const classes = scheduledClasses?.classes || [];

  return (
    <AppScreen header={header}>
      <View style={{ paddingHorizontal: 20 }}>
        {isLoading ? (
          <Text
            style={{
              fontFamily: "Sora_400Regular",
              fontSize: 14,
              color: colors.secondary,
              textAlign: "center",
              paddingVertical: 40,
            }}
          >
            Cargando agenda...
          </Text>
        ) : classes.length === 0 ? (
          <View style={{ paddingVertical: 60, alignItems: "center" }}>
            <CalendarIcon size={48} color={colors.secondary} />
            <Text
              style={{
                fontFamily: "Sora_600SemiBold",
                fontSize: 18,
                color: colors.primary,
                marginTop: 16,
                marginBottom: 8,
              }}
            >
              No tienes clases agendadas
            </Text>
            <Text
              style={{
                fontFamily: "Sora_400Regular",
                fontSize: 14,
                color: colors.secondary,
                textAlign: "center",
                marginBottom: 24,
              }}
            >
              Agenda una clase personalizada
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/courses")}
              style={{
                backgroundColor: colors.accent,
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 20,
              }}
            >
              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 14,
                  color: "#FFFFFF",
                }}
              >
                Ver Cursos
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={classes}
            scrollEnabled={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const date = new Date(item.scheduled_date);
              const statusColor =
                item.status === "completed"
                  ? "#10B981"
                  : item.status === "cancelled"
                    ? colors.destructive
                    : colors.accent;

              return (
                <View
                  style={{
                    backgroundColor: colors.cardBackground,
                    borderRadius: 16,
                    padding: 16,
                    marginBottom: 16,
                    shadowColor: colors.cardShadow,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: isDark ? 0.3 : 0.06,
                    shadowRadius: 8,
                    elevation: 4,
                    borderLeftWidth: 4,
                    borderLeftColor: statusColor,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Sora_600SemiBold",
                        fontSize: 18,
                        color: colors.primary,
                        flex: 1,
                        marginRight: 12,
                      }}
                    >
                      {item.course_title || "Clase Personalizada"}
                    </Text>
                    {item.status === "scheduled" && (
                      <TouchableOpacity
                        onPress={() => cancelMutation.mutate(item.id)}
                        disabled={cancelMutation.isLoading}
                      >
                        <X size={20} color={colors.destructive} />
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={{ gap: 8 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <CalendarIcon size={16} color={colors.secondary} />
                      <Text
                        style={{
                          fontFamily: "Sora_400Regular",
                          fontSize: 14,
                          color: colors.secondary,
                        }}
                      >
                        {format(date, "EEEE, d 'de' MMMM yyyy", { locale: es })}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <Clock size={16} color={colors.secondary} />
                      <Text
                        style={{
                          fontFamily: "Sora_400Regular",
                          fontSize: 14,
                          color: colors.secondary,
                        }}
                      >
                        {format(date, "h:mm a")} · {item.duration_minutes} min
                      </Text>
                    </View>
                    {item.instructor_name && (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <User size={16} color={colors.secondary} />
                        <Text
                          style={{
                            fontFamily: "Sora_400Regular",
                            fontSize: 14,
                            color: colors.secondary,
                          }}
                        >
                          {item.instructor_name}
                        </Text>
                      </View>
                    )}
                  </View>

                  {item.notes && (
                    <View
                      style={{
                        marginTop: 12,
                        paddingTop: 12,
                        borderTopWidth: 1,
                        borderTopColor: colors.border,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Sora_400Regular",
                          fontSize: 13,
                          color: colors.secondary,
                          fontStyle: "italic",
                        }}
                      >
                        {item.notes}
                      </Text>
                    </View>
                  )}

                  <View
                    style={{
                      marginTop: 12,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      backgroundColor: statusColor + "20",
                      borderRadius: 8,
                      alignSelf: "flex-start",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Sora_600SemiBold",
                        fontSize: 12,
                        color: statusColor,
                        textTransform: "uppercase",
                      }}
                    >
                      {item.status === "scheduled"
                        ? "Agendada"
                        : item.status === "completed"
                          ? "Completada"
                          : "Cancelada"}
                    </Text>
                  </View>
                </View>
              );
            }}
          />
        )}
      </View>
    </AppScreen>
  );
}
