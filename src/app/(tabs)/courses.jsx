import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Filter, ShoppingCart } from "lucide-react-native";
import { useAppTheme } from "@/components/AppTheme";
import AppScreen from "@/components/AppScreen";
import AppHeader from "@/components/AppHeader";
import { useAuth } from "@/utils/auth/useAuth";
import {
  useFonts,
  Sora_400Regular,
  Sora_600SemiBold,
  Sora_800ExtraBold,
} from "@expo-google-fonts/sora";

export default function CoursesScreen() {
  const { colors, isDark } = useAppTheme();
  const router = useRouter();
  const { auth, signIn } = useAuth();
  const [filter, setFilter] = useState("all");

  const [fontsLoaded] = useFonts({
    Sora_400Regular,
    Sora_600SemiBold,
    Sora_800ExtraBold,
  });

  // Fetch only enrolled courses
  const { data: coursesData, isLoading } = useQuery({
    queryKey: ["enrolled-courses", auth?.user?.id],
    queryFn: async () => {
      const response = await fetch("/api/courses/enrolled");
      if (!response.ok) {
        if (response.status === 401) {
          return { courses: [] };
        }
        throw new Error("Failed to fetch courses");
      }
      return response.json();
    },
    enabled: !!auth?.user?.id,
  });

  // Get cart count for badge
  const { data: cartData } = useQuery({
    queryKey: ["cart", auth?.user?.id],
    queryFn: async () => {
      if (!auth?.user?.id) return { items: [] };
      const response = await fetch(`/api/cart?userId=${auth.user.id}`);
      if (!response.ok) return { items: [] };
      return response.json();
    },
    enabled: !!auth?.user?.id,
  });

  if (!fontsLoaded) {
    return null;
  }

  const header = (
    <AppHeader
      title="Mis Cursos"
      showBackButton={true}
      titleStyle={{
        fontFamily: "Sora_800ExtraBold",
        fontSize: 24,
      }}
      rightComponent={
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/cart")}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: colors.accentBackground,
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          <ShoppingCart size={22} color={colors.accent} />
          {cartData?.items?.length > 0 && (
            <View
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                backgroundColor: "#EF4444",
                borderRadius: 10,
                minWidth: 20,
                height: 20,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 6,
              }}
            >
              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 11,
                  color: "#FFFFFF",
                }}
              >
                {cartData.items.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      }
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
          <BookOpen size={64} color={colors.secondary} />
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
            Inicia sesión para ver tus cursos
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
            Accede a tu contenido exclusivo
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

  const courses = coursesData?.courses || [];

  // Filter courses by type if needed
  const filteredCourses =
    filter === "all" ? courses : courses.filter((c) => c.type === filter);

  return (
    <AppScreen header={header}>
      {/* Filter Tabs */}
      <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
        <View style={{ flexDirection: "row", gap: 12 }}>
          {["all", "online", "personalized"].map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setFilter(type)}
              style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 20,
                backgroundColor:
                  filter === type ? colors.accent : colors.tagInactive,
              }}
            >
              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 14,
                  color: filter === type ? "#FFFFFF" : colors.tagText,
                }}
              >
                {type === "all"
                  ? "Todos"
                  : type === "online"
                    ? "Online"
                    : "Personalizado"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Courses Grid */}
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
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
            Cargando cursos...
          </Text>
        ) : filteredCourses.length === 0 ? (
          <View style={{ paddingVertical: 60, alignItems: "center" }}>
            <BookOpen size={48} color={colors.secondary} />
            <Text
              style={{
                fontFamily: "Sora_600SemiBold",
                fontSize: 18,
                color: colors.primary,
                marginTop: 16,
                marginBottom: 8,
              }}
            >
              No tienes cursos inscritos
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
              Explora nuestra tienda y comienza a aprender
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/shop")}
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
                Explorar Cursos
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredCourses}
            scrollEnabled={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  backgroundColor: colors.cardBackground,
                  borderRadius: 16,
                  marginBottom: 16,
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
                  style={{ width: "100%", height: 180 }}
                  contentFit="cover"
                  transition={100}
                />
                <View style={{ padding: 16 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 8,
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
                      numberOfLines={2}
                    >
                      {item.title}
                    </Text>
                    <View
                      style={{
                        backgroundColor: colors.tagBackground,
                        paddingHorizontal: 12,
                        paddingVertical: 4,
                        borderRadius: 12,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Sora_600SemiBold",
                          fontSize: 11,
                          color: colors.accent,
                        }}
                      >
                        {item.type === "online" ? "ONLINE" : "PERSONALIZADO"}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={{
                      fontFamily: "Sora_400Regular",
                      fontSize: 14,
                      color: colors.secondary,
                      marginBottom: 12,
                      lineHeight: 20,
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
                    <View
                      style={{
                        backgroundColor: "#10B981" + "20",
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 12,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Sora_600SemiBold",
                          fontSize: 13,
                          color: "#10B981",
                        }}
                      >
                        ✓ Inscrito
                      </Text>
                    </View>
                    {item.duration && (
                      <View
                        style={{
                          backgroundColor: colors.surface,
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderRadius: 8,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Sora_600SemiBold",
                            fontSize: 12,
                            color: colors.primary,
                          }}
                        >
                          {item.duration}
                        </Text>
                      </View>
                    )}
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
