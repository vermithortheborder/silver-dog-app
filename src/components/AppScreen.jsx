import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "@/components/AppTheme";

export default function AppScreen({
  children,
  header,
  scrollable = true,
  showHeaderBorder = true,
  style,
  contentContainerStyle,
  ...scrollViewProps
}) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useAppTheme();
  const [showBorder, setShowBorder] = useState(false);

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setShowBorder(scrollY > 0);
    scrollViewProps.onScroll?.(event);
  };

  const screenStyle = {
    flex: 1,
    backgroundColor: colors.background,
    ...style,
  };

  const defaultContentStyle = {
    paddingTop: 32,
    paddingBottom: insets.bottom + 100,
    ...contentContainerStyle,
  };

  return (
    <View style={screenStyle}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {header && (
        <View
          style={{
            backgroundColor: colors.background,
            borderBottomWidth: showHeaderBorder && showBorder ? 1 : 0,
            borderBottomColor: colors.border,
          }}
        >
          {header}
        </View>
      )}

      {scrollable ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={defaultContentStyle}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          {...scrollViewProps}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>{children}</View>
      )}
    </View>
  );
}
