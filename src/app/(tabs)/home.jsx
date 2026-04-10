import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/utils/auth/useAuth";
import {
  Dog,
  ArrowRight,
  Heart,
  Calendar,
  Pill,
  Stethoscope,
  BookOpen,
  ShoppingBag,
  MessageCircle,
  User,
  Briefcase,
} from "lucide-react-native";
import { useAppTheme } from "@/components/AppTheme";
import AppScreen from "@/components/AppScreen";
import AppHeader from "@/components/AppHeader";
import {
  useFonts,
  Sora_400Regular,
  Sora_600SemiBold,
  Sora_800ExtraBold,
} from "@expo-google-fonts/sora";

export default function HomeScreen() {
  const { colors, isDark } = useAppTheme();
  const router = useRouter();
  const { auth } = useAuth();

  const [fontsLoaded, fontsError] = useFonts({
    Sora_400Regular,
    Sora_600SemiBold,
    Sora_800ExtraBold,
  });

  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ["courses", "featured"],
    queryFn: async () => {
      const response = await fetch("/api/courses?featured=true&limit=3");
      if (!response.ok) throw new Error("Failed to fetch courses");
      return response.json();
    },
  });

  const { data: petsData } = useQuery({
    queryKey: ["pets", auth?.user?.id],
    queryFn: async () => {
      const response = await fetch("/api/pets");
      if (!response.ok) throw new Error("Failed to fetch pets");
      return response.json();
    },
    enabled: !!auth?.user?.id,
  });

  const { data: remindersData } = useQuery({
    queryKey: ["reminders", petsData?.pets?.[0]?.id],
    queryFn: async () => {
      const response = await fetch(
        `/api/pets/reminders?petId=${petsData.pets[0].id}`,
      );
      if (!response.ok) throw new Error("Failed to fetch reminders");
      return response.json();
    },
    enabled: !!petsData?.pets?.[0]?.id,
  });

  if (!fontsLoaded && !fontsError) {
    return null;
  }

  const header = (
    <AppHeader
      title="Silver Dog Training"
      centered
      titleStyle={{
        fontFamily: "Sora_800ExtraBold",
        fontSize: 20,
      }}
    />
  );

  const featuredCourses = coursesData?.courses || [];
  const myPet = petsData?.pets?.[0];
  const upcomingReminders = remindersData?.reminders?.slice(0, 2) || [];

  return (
    <AppScreen header={header}>
      {/* Logo */}
      <View style={{ alignItems: "center", marginTop: 12, marginBottom: 16 }}>
        <Image
          source="https://ucarecdn.com/325c26b3-7b39-4af8-b91a-f8e634a5b668/-/format/auto/"
          style={{ width: 100, height: 100 }}
          contentFit="contain"
          transition={100}
        />
      </View>

      {/* Quick Access Buttons */}
      <View style={{ marginBottom: 20 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 6, gap: 10 }}
          style={{ flexGrow: 0 }}
        >
          {/* Veterinaria */}
          <TouchableOpacity
            onPress={() => router.push("/veterinary")}
            style={{
              width: 90,
              backgroundColor: "#14B8A6",
              borderRadius: 12,
              padding: 12,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Stethoscope size={22} color="#FFFFFF" strokeWidth={2.5} />
            <Text
              style={{
                fontFamily: "Sora_600SemiBold",
                fontSize: 11,
                color: "#FFFFFF",
                textAlign: "center",
                marginTop: 6,
              }}
            >
              Veterinaria
            </Text>
          </TouchableOpacity>

          {/* Servicios */}
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/profile")}
            style={{
              width: 90,
              backgroundColor: "#F59E0B",
              borderRadius: 12,
              padding: 12,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Briefcase size={22} color="#FFFFFF" strokeWidth={2.5} />
            <Text
              style={{
                fontFamily: "Sora_600SemiBold",
                fontSize: 11,
                color: "#FFFFFF",
                textAlign: "center",
                marginTop: 6,
              }}
            >
              Servicios
            </Text>
          </TouchableOpacity>

          {/* Cursos */}
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/courses")}
            style={{
              width: 90,
              backgroundColor: "#3B82F6",
              borderRadius: 12,
              padding: 12,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <BookOpen size={22} color="#FFFFFF" strokeWidth={2.5} />
            <Text
              style={{
                fontFamily: "Sora_600SemiBold",
                fontSize: 11,
                color: "#FFFFFF",
                textAlign: "center",
                marginTop: 6,
              }}
            >
              Cursos
            </Text>
          </TouchableOpacity>

          {/* Tienda */}
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/shop")}
            style={{
              width: 90,
              backgroundColor: "#EC4899",
              borderRadius: 12,
              padding: 12,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <ShoppingBag size={22} color="#FFFFFF" strokeWidth={2.5} />
            <Text
              style={{
                fontFamily: "Sora_600SemiBold",
                fontSize: 11,
                color: "#FFFFFF",
                textAlign: "center",
                marginTop: 6,
              }}
            >
              Tienda
            </Text>
          </TouchableOpacity>

          {/* Horario */}
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/schedule")}
            style={{
              width: 90,
              backgroundColor: "#10B981",
              borderRadius: 12,
              padding: 12,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Calendar size={22} color="#FFFFFF" strokeWidth={2.5} />
            <Text
              style={{
                fontFamily: "Sora_600SemiBold",
                fontSize: 11,
                color: "#FFFFFF",
                textAlign: "center",
                marginTop: 6,
              }}
            >
              Horario
            </Text>
          </TouchableOpacity>

          {/* Chat */}
          <TouchableOpacity
            onPress={() => router.push("/chat")}
            style={{
              width: 90,
              backgroundColor: "#8B5CF6",
              borderRadius: 12,
              padding: 12,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <MessageCircle size={22} color="#FFFFFF" strokeWidth={2.5} />
            <Text
              style={{
                fontFamily: "Sora_600SemiBold",
                fontSize: 11,
                color: "#FFFFFF",
                textAlign: "center",
                marginTop: 6,
              }}
            >
              Chat
            </Text>
          </TouchableOpacity>

          {/* Perfil */}
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/profile")}
            style={{
              width: 90,
              backgroundColor: "#F97316",
              borderRadius: 12,
              padding: 12,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <User size={22} color="#FFFFFF" strokeWidth={2.5} />
            <Text
              style={{
                fontFamily: "Sora_600SemiBold",
                fontSize: 11,
                color: "#FFFFFF",
                textAlign: "center",
                marginTop: 6,
              }}
            >
              Perfil
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Veterinary Health Section - MOVIDO HASTA ARRIBA */}
      {myPet && (
        <View style={{ paddingHorizontal: 6, marginBottom: 20 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Heart size={24} color={colors.accent} />
              <Text
                style={{
                  fontFamily: "Sora_800ExtraBold",
                  fontSize: 22,
                  color: colors.primary,
                }}
              >
                Salud Veterinaria
              </Text>
            </View>
            <TouchableOpacity onPress={() => router.push("/veterinary")}>
              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 14,
                  color: colors.accent,
                }}
              >
                Ver Todo
              </Text>
            </TouchableOpacity>
          </View>

          {/* Pet Card */}
          <View
            style={{
              backgroundColor: colors.cardBackground,
              borderRadius: 16,
              padding: 16,
              shadowColor: colors.cardShadow,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDark ? 0.3 : 0.06,
              shadowRadius: 8,
              elevation: 4,
              marginBottom: 12,
            }}
          >
            <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
              {myPet.photo ? (
                <Image
                  source={{ uri: myPet.photo }}
                  style={{ width: 60, height: 60, borderRadius: 30 }}
                  contentFit="cover"
                  transition={100}
                />
              ) : (
                <View
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: colors.accent + "20",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Dog size={32} color={colors.accent} />
                </View>
              )}
              <View style={{ flex: 1, justifyContent: "center" }}>
                <Text
                  style={{
                    fontFamily: "Sora_600SemiBold",
                    fontSize: 18,
                    color: colors.primary,
                    marginBottom: 4,
                  }}
                >
                  {myPet.name}
                </Text>
                {myPet.breed && (
                  <Text
                    style={{
                      fontFamily: "Sora_400Regular",
                      fontSize: 14,
                      color: colors.secondary,
                    }}
                  >
                    {myPet.breed}
                  </Text>
                )}
              </View>
            </View>

            {/* Upcoming Reminders */}
            {upcomingReminders.length > 0 ? (
              <View>
                <Text
                  style={{
                    fontFamily: "Sora_600SemiBold",
                    fontSize: 14,
                    color: colors.secondary,
                    marginBottom: 12,
                  }}
                >
                  Próximos Recordatorios
                </Text>
                {upcomingReminders.map((reminder) => (
                  <View
                    key={reminder.id}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                      paddingVertical: 8,
                    }}
                  >
                    {reminder.reminder_type === "vacuna" && (
                      <Pill size={18} color={colors.accent} />
                    )}
                    {reminder.reminder_type === "desparacitacion" && (
                      <Pill size={18} color={colors.accent} />
                    )}
                    {reminder.reminder_type === "medicamento" && (
                      <Pill size={18} color={colors.accent} />
                    )}
                    {reminder.reminder_type === "revision" && (
                      <Calendar size={18} color={colors.accent} />
                    )}
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontFamily: "Sora_600SemiBold",
                          fontSize: 14,
                          color: colors.primary,
                        }}
                      >
                        {reminder.title}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Sora_400Regular",
                          fontSize: 12,
                          color: colors.secondary,
                        }}
                      >
                        {new Date(reminder.due_date).toLocaleDateString(
                          "es-ES",
                          {
                            day: "numeric",
                            month: "short",
                          },
                        )}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <Text
                style={{
                  fontFamily: "Sora_400Regular",
                  fontSize: 14,
                  color: colors.secondary,
                  textAlign: "center",
                  paddingVertical: 8,
                }}
              >
                No hay recordatorios pendientes
              </Text>
            )}
          </View>
        </View>
      )}

      {/* Welcome Section - AHORA VA DESPUÉS */}
      <View style={{ paddingHorizontal: 6, marginBottom: 20 }}>
        <Text
          style={{
            fontFamily: "Sora_400Regular",
            fontSize: 16,
            color: colors.secondary,
            marginBottom: 8,
          }}
        >
          Hola {auth?.user ? auth.user.email?.split("@")[0] : "Invitado"},
        </Text>
        <Text
          style={{
            fontFamily: "Sora_800ExtraBold",
            fontSize: 28,
            color: colors.primary,
            lineHeight: 36,
          }}
        >
          Entrena a tu perro con{"\n"}los mejores expertos
        </Text>
      </View>

      {/* Hero Card */}
      <View style={{ paddingHorizontal: 6, marginBottom: 20 }}>
        <TouchableOpacity
          style={{
            borderRadius: 24,
            padding: 24,
            overflow: "hidden",
            position: "relative",
            backgroundColor: colors.accent,
          }}
          onPress={() => router.push("/(tabs)/courses")}
        >
          {/* Decorative Dog Icon */}
          <View
            style={{
              position: "absolute",
              top: -20,
              right: -20,
              width: 120,
              height: 120,
              opacity: 0.2,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Dog size={100} color="#FFFFFF" />
          </View>

          <View style={{ zIndex: 2 }}>
            <Text
              style={{
                fontFamily: "Sora_600SemiBold",
                fontSize: 20,
                color: "#FFFFFF",
                marginBottom: 8,
              }}
            >
              Educación Vial Canina
            </Text>
            <Text
              style={{
                fontFamily: "Sora_400Regular",
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.85)",
                marginBottom: 20,
              }}
            >
              Aprende técnicas profesionales para que tu perro se comporte
              perfectamente en la ciudad
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
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
              <ArrowRight size={16} color="#FFFFFF" />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Featured Courses */}
      <View style={{ paddingHorizontal: 6, marginBottom: 20 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              fontFamily: "Sora_800ExtraBold",
              fontSize: 22,
              color: colors.primary,
            }}
          >
            Cursos Destacados
          </Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/courses")}>
            <Text
              style={{
                fontFamily: "Sora_600SemiBold",
                fontSize: 14,
                color: colors.accent,
              }}
            >
              Ver Todos
            </Text>
          </TouchableOpacity>
        </View>

        {coursesLoading ? (
          <Text
            style={{
              fontFamily: "Sora_400Regular",
              fontSize: 14,
              color: colors.secondary,
              textAlign: "center",
              paddingVertical: 40,
            }}
          >
            Cargando cursos...
          </Text>
        ) : (
          <FlatList
            data={featuredCourses}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  width: 280,
                  backgroundColor: colors.cardBackground,
                  borderRadius: 16,
                  overflow: "hidden",
                  shadowColor: colors.cardShadow,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isDark ? 0.3 : 0.06,
                  shadowRadius: 8,
                  elevation: 4,
                }}
                onPress={() => router.push(`/course/${item.id}`)}
              >
                <Image
                  source={{ uri: item.thumbnail }}
                  style={{ width: "100%", height: 160 }}
                  contentFit="cover"
                  transition={100}
                />
                <View style={{ padding: 16 }}>
                  <Text
                    style={{
                      fontFamily: "Sora_600SemiBold",
                      fontSize: 16,
                      color: colors.primary,
                      marginBottom: 8,
                    }}
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Sora_400Regular",
                      fontSize: 14,
                      color: colors.secondary,
                      marginBottom: 12,
                    }}
                    numberOfLines={2}
                  >
                    {item.description}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Sora_800ExtraBold",
                        fontSize: 18,
                        color: colors.accent,
                      }}
                    >
                      ${item.price}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Sora_400Regular",
                        fontSize: 12,
                        color: colors.secondary,
                      }}
                    >
                      {item.duration}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </AppScreen>
  );
}
