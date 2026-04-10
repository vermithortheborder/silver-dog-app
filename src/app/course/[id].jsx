import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  Platform,
  Linking,
} from "react-native";
import { Image } from "expo-image";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/utils/auth/useAuth";
import {
  ArrowLeft,
  ShoppingCart,
  Calendar,
  Clock,
  User,
  MessageCircle,
  CheckCircle,
  Play,
  ExternalLink,
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

const { width } = Dimensions.get("window");

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams();
  const { colors, isDark } = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { auth, signIn } = useAuth();
  const queryClient = useQueryClient();

  const [fontsLoaded] = useFonts({
    Sora_400Regular,
    Sora_600SemiBold,
    Sora_800ExtraBold,
  });

  const { data: courseData, isLoading } = useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      const response = await fetch(`/api/courses/${id}`);
      if (!response.ok) throw new Error("Failed to fetch course");
      return response.json();
    },
  });

  const { data: enrollmentData } = useQuery({
    queryKey: ["enrollment", id, auth?.user?.id],
    queryFn: async () => {
      if (!auth?.user?.id) return { isEnrolled: false };
      const response = await fetch(
        `/api/courses/${id}/enrollment?userId=${auth.user.id}`,
      );
      if (!response.ok) return { isEnrolled: false };
      return response.json();
    },
    enabled: !!auth?.user?.id,
  });

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!auth?.user?.id) throw new Error("Not authenticated");
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: String(auth.user.id),
          itemType: "course",
          itemId: id,
          quantity: 1,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add to cart");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
      Alert.alert("¡Agregado!", "Curso agregado al carrito", [
        { text: "Ver Carrito", onPress: () => router.push("/(tabs)/cart") },
        { text: "OK" },
      ]);
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
  });

  if (!fontsLoaded || isLoading) {
    return null;
  }

  const course = courseData?.course;
  const isEnrolled = enrollmentData?.isEnrolled || false;

  if (!course) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "Sora_600SemiBold",
            fontSize: 16,
            color: colors.secondary,
          }}
        >
          Curso no encontrado
        </Text>
      </View>
    );
  }

  const canWatchVideo =
    isEnrolled && course.type === "online" && course.video_url;

  // Extract YouTube video ID - SUPPORTS SHORTS
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^#&?\/]{11})/,
      /youtube\.com\/v\/([^#&?\/]{11})/,
      /youtube\.com\/watch\?.*v=([^#&?\/]{11})/,
      /youtube\.com\/shorts\/([^#&?\/]{11})/,
      /youtu\.be\/shorts\/([^#&?\/]{11})/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) return match[1];
    }
    return null;
  };

  const videoId = getYouTubeVideoId(course.video_url);

  const openVideo = async () => {
    if (!videoId) return;

    const youtubeAppUrl = `youtube://watch?v=${videoId}`;
    const youtubeBrowserUrl = `https://www.youtube.com/watch?v=${videoId}`;

    try {
      const canOpen = await Linking.canOpenURL(youtubeAppUrl);
      if (canOpen) {
        await Linking.openURL(youtubeAppUrl);
      } else {
        await Linking.openURL(youtubeBrowserUrl);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo abrir el video");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header with back button */}
      <View
        style={{
          position: "absolute",
          top: insets.top + 12,
          left: 20,
          right: 20,
          zIndex: 10,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.background + "DD",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ArrowLeft size={20} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/cart")}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.background + "DD",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ShoppingCart size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Video Thumbnail with Play Button */}
        <TouchableOpacity
          onPress={canWatchVideo ? openVideo : null}
          activeOpacity={canWatchVideo ? 0.8 : 1}
          style={{ position: "relative" }}
        >
          <Image
            source={{
              uri:
                course.thumbnail ||
                `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            }}
            style={{ width, height: width * 0.56 }}
            contentFit="cover"
            transition={100}
          />

          {/* Overlay for enrolled users */}
          {canWatchVideo && (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.3)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: colors.accent,
                  justifyContent: "center",
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <Play size={32} color="#FFFFFF" fill="#FFFFFF" />
              </View>
              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 16,
                  color: "#FFFFFF",
                  marginTop: 16,
                  backgroundColor: "rgba(0,0,0,0.6)",
                  paddingHorizontal: 20,
                  paddingVertical: 8,
                  borderRadius: 20,
                }}
              >
                Toca para ver el video
              </Text>
            </View>
          )}

          {/* Overlay for non-enrolled users */}
          {course.type === "online" && !isEnrolled && (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: colors.accent,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Play size={28} color="#FFFFFF" fill="#FFFFFF" />
              </View>
              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 16,
                  color: "#FFFFFF",
                  marginTop: 12,
                }}
              >
                Inscríbete para ver
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Content */}
        <View style={{ padding: 20 }}>
          {/* Badge */}
          <View
            style={{
              backgroundColor: colors.tagBackground,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 16,
              alignSelf: "flex-start",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontFamily: "Sora_600SemiBold",
                fontSize: 12,
                color: colors.accent,
              }}
            >
              {course.type === "online"
                ? "CURSO ONLINE"
                : "CLASE PERSONALIZADA"}
            </Text>
          </View>

          {/* Title */}
          <Text
            style={{
              fontFamily: "Sora_800ExtraBold",
              fontSize: 28,
              color: colors.primary,
              marginBottom: 16,
              lineHeight: 36,
            }}
          >
            {course.title}
          </Text>

          {/* Instructor and Duration */}
          <View style={{ flexDirection: "row", gap: 20, marginBottom: 24 }}>
            {course.instructor && (
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <User size={16} color={colors.secondary} />
                <Text
                  style={{
                    fontFamily: "Sora_400Regular",
                    fontSize: 14,
                    color: colors.secondary,
                  }}
                >
                  {course.instructor}
                </Text>
              </View>
            )}
            {course.duration && (
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <Clock size={16} color={colors.secondary} />
                <Text
                  style={{
                    fontFamily: "Sora_400Regular",
                    fontSize: 14,
                    color: colors.secondary,
                  }}
                >
                  {course.duration}
                </Text>
              </View>
            )}
          </View>

          {/* Enrolled Badge */}
          {isEnrolled && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                backgroundColor: "#10B98120",
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 12,
                marginBottom: 24,
              }}
            >
              <CheckCircle size={20} color="#10B981" />
              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 14,
                  color: "#10B981",
                }}
              >
                Ya estás inscrito en este curso
              </Text>
            </View>
          )}

          {/* Description */}
          <View
            style={{
              backgroundColor: colors.surface,
              padding: 20,
              borderRadius: 16,
              marginBottom: 24,
            }}
          >
            <Text
              style={{
                fontFamily: "Sora_600SemiBold",
                fontSize: 16,
                color: colors.primary,
                marginBottom: 12,
              }}
            >
              Descripción
            </Text>
            <Text
              style={{
                fontFamily: "Sora_400Regular",
                fontSize: 15,
                color: colors.secondary,
                lineHeight: 24,
              }}
            >
              {course.description}
            </Text>
          </View>

          {/* Chat with Instructor Button */}
          {isEnrolled && (
            <TouchableOpacity
              onPress={() => router.push("/chat?instructor=Instructor")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                backgroundColor: colors.surface,
                paddingVertical: 16,
                borderRadius: 16,
                marginBottom: 16,
              }}
            >
              <MessageCircle size={20} color={colors.accent} />
              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 16,
                  color: colors.accent,
                }}
              >
                Chatear con Instructor
              </Text>
            </TouchableOpacity>
          )}

          {/* Schedule Class Button (for personalized) */}
          {isEnrolled && course.type === "personalized" && (
            <TouchableOpacity
              onPress={() => router.push(`/schedule-class?courseId=${id}`)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                backgroundColor: colors.surface,
                paddingVertical: 16,
                borderRadius: 16,
                marginBottom: 24,
              }}
            >
              <Calendar size={20} color={colors.accent} />
              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 16,
                  color: colors.accent,
                }}
              >
                Agendar Clase
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Bottom Purchase Info Bar - Apple Policy Compliant */}
      {!isEnrolled && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: colors.cardBackground,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: insets.bottom + 20,
          }}
        >
          <View style={{ alignItems: "center", gap: 12 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <ExternalLink size={20} color={colors.accent} />
              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 16,
                  color: colors.primary,
                  textAlign: "center",
                }}
              >
                Precio: ${course.price}
              </Text>
            </View>
            <Text
              style={{
                fontFamily: "Sora_400Regular",
                fontSize: 14,
                color: colors.secondary,
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              Para comprar cursos, visita nuestra web en tu navegador
            </Text>
            <TouchableOpacity
              onPress={() => Linking.openURL("https://silverdogtraining.com")}
              style={{
                backgroundColor: colors.surface,
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 14,
                  color: colors.accent,
                }}
              >
                Abrir en Navegador
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
