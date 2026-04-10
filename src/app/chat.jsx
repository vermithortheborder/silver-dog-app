import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/utils/auth/useAuth";
import { Send, ArrowLeft } from "lucide-react-native";
import { useAppTheme } from "@/components/AppTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  useFonts,
  Sora_400Regular,
  Sora_600SemiBold,
  Sora_800ExtraBold,
} from "@expo-google-fonts/sora";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function ChatScreen() {
  const { instructor } = useLocalSearchParams();
  const { colors, isDark } = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { auth, signIn } = useAuth();
  const queryClient = useQueryClient();
  const flatListRef = useRef(null);
  const [message, setMessage] = useState("");

  const [fontsLoaded] = useFonts({
    Sora_400Regular,
    Sora_600SemiBold,
    Sora_800ExtraBold,
  });

  const { data: messagesData, isLoading } = useQuery({
    queryKey: ["chat-messages", auth?.user?.id, instructor],
    queryFn: async () => {
      if (!auth?.user?.id) return { messages: [] };
      const response = await fetch(
        `/api/chat?userId=${auth.user.id}&instructor=${encodeURIComponent(instructor)}`,
      );
      if (!response.ok) throw new Error("Failed to fetch messages");
      return response.json();
    },
    enabled: !!auth?.user?.id,
    refetchInterval: 3000, // Poll every 3 seconds for new messages
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageText) => {
      if (!auth?.user?.id) throw new Error("Not authenticated");
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: auth.user.id,
          instructorName: instructor,
          message: messageText,
        }),
      });
      if (!response.ok) throw new Error("Failed to send message");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["chat-messages"]);
      setMessage("");
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    },
  });

  useEffect(() => {
    if (messagesData?.messages?.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messagesData?.messages?.length]);

  if (!fontsLoaded) {
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
          paddingHorizontal: 40,
        }}
      >
        <Text
          style={{
            fontFamily: "Sora_600SemiBold",
            fontSize: 20,
            color: colors.primary,
            marginBottom: 32,
            textAlign: "center",
          }}
        >
          Inicia sesión para chatear
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
    );
  }

  const messages = messagesData?.messages || [];

  const handleSend = () => {
    if (message.trim()) {
      sendMessageMutation.mutate(message.trim());
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header */}
      <View
        style={{
          backgroundColor: colors.cardBackground,
          paddingTop: insets.top + 16,
          paddingBottom: 16,
          paddingHorizontal: 20,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.primary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: "Sora_800ExtraBold",
              fontSize: 18,
              color: colors.primary,
            }}
          >
            {instructor}
          </Text>
          <Text
            style={{
              fontFamily: "Sora_400Regular",
              fontSize: 12,
              color: colors.secondary,
            }}
          >
            Instructor
          </Text>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 20,
        }}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 60,
            }}
          >
            <Text
              style={{
                fontFamily: "Sora_600SemiBold",
                fontSize: 16,
                color: colors.secondary,
                textAlign: "center",
              }}
            >
              No hay mensajes aún.{"\n"}¡Envía el primero!
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const isMyMessage = !item.is_instructor;
          const messageDate = new Date(item.created_at);

          return (
            <View
              style={{
                flexDirection: "row",
                justifyContent: isMyMessage ? "flex-end" : "flex-start",
                marginBottom: 12,
              }}
            >
              <View
                style={{
                  maxWidth: "75%",
                  backgroundColor: isMyMessage
                    ? colors.accent
                    : colors.cardBackground,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderRadius: 20,
                  borderBottomRightRadius: isMyMessage ? 4 : 20,
                  borderBottomLeftRadius: isMyMessage ? 20 : 4,
                  shadowColor: colors.cardShadow,
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: isDark ? 0.3 : 0.06,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Sora_400Regular",
                    fontSize: 15,
                    color: isMyMessage ? "#FFFFFF" : colors.primary,
                    lineHeight: 22,
                  }}
                >
                  {item.message}
                </Text>
                <Text
                  style={{
                    fontFamily: "Sora_400Regular",
                    fontSize: 11,
                    color: isMyMessage
                      ? "rgba(255,255,255,0.7)"
                      : colors.secondary,
                    marginTop: 4,
                  }}
                >
                  {format(messageDate, "h:mm a")}
                </Text>
              </View>
            </View>
          );
        }}
      />

      {/* Input */}
      <View
        style={{
          backgroundColor: colors.cardBackground,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: insets.bottom + 12,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: colors.searchBackground,
            borderRadius: 24,
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        >
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Escribe un mensaje..."
            placeholderTextColor={colors.searchPlaceholder}
            style={{
              fontFamily: "Sora_400Regular",
              fontSize: 15,
              color: colors.primary,
            }}
            multiline
            maxLength={500}
          />
        </View>
        <TouchableOpacity
          onPress={handleSend}
          disabled={!message.trim() || sendMessageMutation.isLoading}
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: message.trim() ? colors.accent : colors.surface,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Send
            size={20}
            color={message.trim() ? "#FFFFFF" : colors.secondary}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
