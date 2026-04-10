import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/utils/auth/useAuth";
import useUser from "@/utils/useUser";
import {
  Users,
  BookOpen,
  Calendar,
  MessageCircle,
  ArrowLeft,
  QrCode,
  Scan,
} from "lucide-react-native";
import { useAppTheme } from "@/components/AppTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  useFonts,
  Sora_400Regular,
  Sora_600SemiBold,
  Sora_800ExtraBold,
} from "@expo-google-fonts/sora";

export default function InstructorDashboard() {
  const { colors, isDark } = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { auth, signIn } = useAuth();
  const { data: user, loading: userLoading } = useUser();

  const [fontsLoaded] = useFonts({
    Sora_400Regular,
    Sora_600SemiBold,
    Sora_800ExtraBold,
  });

  const {
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["instructor-stats", user?.id],
    queryFn: async () => {
      const response = await fetch("/api/instructor/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json();
    },
    enabled: !!user,
  });

  const {
    data: classesData,
    isLoading: classesLoading,
    refetch: refetchClasses,
  } = useQuery({
    queryKey: ["instructor-classes", user?.id],
    queryFn: async () => {
      const response = await fetch("/api/instructor/classes");
      if (!response.ok) throw new Error("Failed to fetch classes");
      return response.json();
    },
    enabled: !!user,
  });

  const {
    data: studentsData,
    isLoading: studentsLoading,
    refetch: refetchStudents,
  } = useQuery({
    queryKey: ["instructor-students", user?.id],
    queryFn: async () => {
      const response = await fetch("/api/instructor/students");
      if (!response.ok) throw new Error("Failed to fetch students");
      return response.json();
    },
    enabled: !!user,
  });

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchStats(), refetchClasses(), refetchStudents()]);
    setRefreshing(false);
  }, []);

  if (!fontsLoaded || userLoading) {
    return null;
  }

  if (!auth?.user) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
        <Text
          style={{
            fontFamily: "Sora_800ExtraBold",
            fontSize: 24,
            color: colors.primary,
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          Inicia sesión para acceder
        </Text>
        <TouchableOpacity
          onPress={() => signIn()}
          style={{
            backgroundColor: colors.accent,
            paddingHorizontal: 32,
            paddingVertical: 16,
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
    );
  }

  const classes = classesData?.classes || [];
  const students = studentsData?.students || [];
  const instructorStats = stats || {
    totalStudents: 0,
    totalCourses: 0,
    upcomingClasses: 0,
    unreadChats: 0,
  };

  const upcomingClasses = classes.filter(
    (cls) => new Date(cls.scheduled_date) > new Date(),
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header */}
      <View
        style={{
          backgroundColor: "#7C3AED",
          paddingTop: insets.top + 16,
          paddingBottom: 24,
          paddingHorizontal: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "rgba(255,255,255,0.2)",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <Text
          style={{
            fontFamily: "Sora_800ExtraBold",
            fontSize: 32,
            color: "#FFFFFF",
            marginBottom: 8,
          }}
        >
          Panel de Instructor
        </Text>
        <Text
          style={{
            fontFamily: "Sora_400Regular",
            fontSize: 16,
            color: "rgba(255,255,255,0.8)",
          }}
        >
          Gestiona tus clases y estudiantes
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats Cards */}
        <View style={{ padding: 20, gap: 16 }}>
          <View
            style={{
              flexDirection: "row",
              gap: 12,
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: colors.cardBackground,
                borderRadius: 20,
                padding: 20,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: "#DBEAFE",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <Users size={24} color="#2563EB" />
              </View>
              <Text
                style={{
                  fontFamily: "Sora_400Regular",
                  fontSize: 12,
                  color: colors.secondary,
                  marginBottom: 4,
                }}
              >
                Estudiantes
              </Text>
              <Text
                style={{
                  fontFamily: "Sora_800ExtraBold",
                  fontSize: 28,
                  color: colors.primary,
                }}
              >
                {instructorStats.totalStudents}
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: colors.cardBackground,
                borderRadius: 20,
                padding: 20,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: "#DCFCE7",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <BookOpen size={24} color="#16A34A" />
              </View>
              <Text
                style={{
                  fontFamily: "Sora_400Regular",
                  fontSize: 12,
                  color: colors.secondary,
                  marginBottom: 4,
                }}
              >
                Mis Cursos
              </Text>
              <Text
                style={{
                  fontFamily: "Sora_800ExtraBold",
                  fontSize: 28,
                  color: colors.primary,
                }}
              >
                {instructorStats.totalCourses}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              gap: 12,
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: colors.cardBackground,
                borderRadius: 20,
                padding: 20,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: "#F3E8FF",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <Calendar size={24} color="#9333EA" />
              </View>
              <Text
                style={{
                  fontFamily: "Sora_400Regular",
                  fontSize: 12,
                  color: colors.secondary,
                  marginBottom: 4,
                }}
              >
                Próximas
              </Text>
              <Text
                style={{
                  fontFamily: "Sora_800ExtraBold",
                  fontSize: 28,
                  color: colors.primary,
                }}
              >
                {instructorStats.upcomingClasses}
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: colors.cardBackground,
                borderRadius: 20,
                padding: 20,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: "#FFEDD5",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <MessageCircle size={24} color={colors.accent} />
              </View>
              <Text
                style={{
                  fontFamily: "Sora_400Regular",
                  fontSize: 12,
                  color: colors.secondary,
                  marginBottom: 4,
                }}
              >
                Chats
              </Text>
              <Text
                style={{
                  fontFamily: "Sora_800ExtraBold",
                  fontSize: 28,
                  color: colors.primary,
                }}
              >
                {instructorStats.unreadChats}
              </Text>
            </View>
          </View>
        </View>

        {/* QR Scanner Button */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <TouchableOpacity
            onPress={() => router.push("/qr-scanner")}
            style={{
              backgroundColor: colors.accent,
              borderRadius: 24,
              padding: 24,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              shadowColor: colors.accent,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 16 }}
            >
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 20,
                  backgroundColor: "rgba(255,255,255,0.25)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <QrCode size={32} color="#FFFFFF" />
              </View>
              <View>
                <Text
                  style={{
                    fontFamily: "Sora_800ExtraBold",
                    fontSize: 20,
                    color: "#FFFFFF",
                    marginBottom: 4,
                  }}
                >
                  Escanear Carnet QR
                </Text>
                <Text
                  style={{
                    fontFamily: "Sora_400Regular",
                    fontSize: 14,
                    color: "rgba(255,255,255,0.9)",
                  }}
                >
                  Registrar asistencia de estudiantes
                </Text>
              </View>
            </View>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(255,255,255,0.25)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Scan size={20} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Upcoming Classes */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text
            style={{
              fontFamily: "Sora_800ExtraBold",
              fontSize: 24,
              color: colors.primary,
              marginBottom: 16,
            }}
          >
            Próximas Clases
          </Text>

          {upcomingClasses.length === 0 ? (
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 16,
                padding: 32,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: colors.background,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <Calendar size={32} color={colors.secondary} />
              </View>
              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 16,
                  color: colors.secondary,
                  textAlign: "center",
                }}
              >
                No hay clases programadas
              </Text>
            </View>
          ) : (
            <View style={{ gap: 12 }}>
              {upcomingClasses.slice(0, 5).map((cls) => (
                <View
                  key={cls.id}
                  style={{
                    backgroundColor: colors.cardBackground,
                    borderRadius: 16,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 8,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontFamily: "Sora_600SemiBold",
                          fontSize: 16,
                          color: colors.primary,
                          marginBottom: 4,
                        }}
                      >
                        {cls.course_title}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Sora_400Regular",
                          fontSize: 14,
                          color: colors.secondary,
                        }}
                      >
                        {cls.student_name}
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: "#F3E8FF",
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 12,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Sora_600SemiBold",
                          fontSize: 10,
                          color: "#9333EA",
                        }}
                      >
                        AGENDADA
                      </Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: "row", gap: 16 }}>
                    <Text
                      style={{
                        fontFamily: "Sora_400Regular",
                        fontSize: 13,
                        color: colors.secondary,
                      }}
                    >
                      📅{" "}
                      {new Date(cls.scheduled_date).toLocaleDateString("es-ES")}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Sora_400Regular",
                        fontSize: 13,
                        color: colors.secondary,
                      }}
                    >
                      🕐{" "}
                      {new Date(cls.scheduled_date).toLocaleTimeString(
                        "es-ES",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Sora_400Regular",
                        fontSize: 13,
                        color: colors.secondary,
                      }}
                    >
                      ⏱️ {cls.duration_minutes}min
                    </Text>
                  </View>

                  {cls.notes && (
                    <Text
                      style={{
                        fontFamily: "Sora_400Regular",
                        fontSize: 13,
                        color: colors.secondary,
                        marginTop: 8,
                        fontStyle: "italic",
                      }}
                    >
                      Notas: {cls.notes}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Students List */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text
            style={{
              fontFamily: "Sora_800ExtraBold",
              fontSize: 24,
              color: colors.primary,
              marginBottom: 16,
            }}
          >
            Mis Estudiantes
          </Text>

          {students.length === 0 ? (
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 16,
                padding: 32,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: colors.background,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <Users size={32} color={colors.secondary} />
              </View>
              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 16,
                  color: colors.secondary,
                  textAlign: "center",
                }}
              >
                No tienes estudiantes aún
              </Text>
            </View>
          ) : (
            <View style={{ gap: 12 }}>
              {students.slice(0, 8).map((student) => (
                <View
                  key={`${student.id}-${student.enrolled_course}`}
                  style={{
                    backgroundColor: colors.cardBackground,
                    borderRadius: 16,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontFamily: "Sora_600SemiBold",
                          fontSize: 16,
                          color: colors.primary,
                          marginBottom: 4,
                        }}
                      >
                        {student.name}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Sora_400Regular",
                          fontSize: 13,
                          color: colors.secondary,
                          marginBottom: 6,
                        }}
                      >
                        {student.email}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Sora_400Regular",
                          fontSize: 13,
                          color: "#2563EB",
                        }}
                      >
                        📚 {student.enrolled_course}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontFamily: "Sora_400Regular",
                        fontSize: 11,
                        color: colors.secondary,
                      }}
                    >
                      {new Date(student.enrolled_at).toLocaleDateString(
                        "es-ES",
                      )}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
