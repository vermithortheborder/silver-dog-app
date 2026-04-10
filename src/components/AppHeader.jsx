import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useAppTheme } from "@/components/AppTheme";

export default function AppHeader({
  title,
  showBackButton = false,
  leftComponent,
  rightComponent,
  onBackPress,
  style,
  titleStyle,
  centered = false,
}) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useAppTheme();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: centered ? "center" : "space-between",
        paddingHorizontal: 20,
        paddingTop: insets.top + 24,
        paddingBottom: 16,
        ...style,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {showBackButton && (
          <TouchableOpacity
            onPress={handleBackPress}
            style={{ marginRight: 16 }}
          >
            <ChevronLeft size={20} color={colors.primary} />
          </TouchableOpacity>
        )}
        {leftComponent}
      </View>

      {title && (
        <Text
          style={{
            fontFamily: "Sora_800ExtraBold",
            fontSize: centered ? 24 : 18,
            color: colors.primary,
            flex: centered ? 0 : 1,
            textAlign: centered ? "center" : "left",
            ...titleStyle,
          }}
        >
          {title}
        </Text>
      )}

      <View>{rightComponent}</View>
    </View>
  );
}
