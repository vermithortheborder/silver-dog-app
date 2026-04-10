import React from "react";
import { View, Text } from "react-native";
import { Image } from "expo-image";
import {
  QrCode,
  GraduationCap,
  Package,
  DollarSign,
  AlertCircle,
} from "lucide-react-native";

export function DigitalIDCard({ userId, packageStats, colors, isDark }) {
  return (
    <View
      style={{
        backgroundColor: colors.cardBackground,
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        shadowColor: colors.cardShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.4 : 0.1,
        shadowRadius: 12,
        elevation: 6,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <QrCode size={24} color={colors.accent} />
        <Text
          style={{
            fontFamily: "Sora_800ExtraBold",
            fontSize: 20,
            color: colors.primary,
            marginLeft: 12,
          }}
        >
          Mi Carnet Digital
        </Text>
      </View>

      {/* QR Code */}
      <View
        style={{
          alignItems: "center",
          marginBottom: 24,
          backgroundColor: "#FFFFFF",
          padding: 20,
          borderRadius: 16,
        }}
      >
        <Image
          source={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify({ userId, type: "student_id" }))}`}
          style={{ width: 200, height: 200 }}
          contentFit="contain"
        />
        <Text
          style={{
            fontFamily: "Sora_400Regular",
            fontSize: 12,
            color: colors.secondary,
            marginTop: 12,
            textAlign: "center",
          }}
        >
          ID: {userId}
        </Text>
      </View>

      {/* Class Stats */}
      <View
        style={{
          backgroundColor: isDark
            ? "rgba(255,255,255,0.05)"
            : "rgba(0,0,0,0.02)",
          borderRadius: 16,
          padding: 16,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <View style={{ alignItems: "center", flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <GraduationCap size={20} color="#10B981" />
            </View>
            <Text
              style={{
                fontFamily: "Sora_800ExtraBold",
                fontSize: 24,
                color: "#10B981",
                marginBottom: 4,
              }}
            >
              {packageStats?.completedClasses || 0}
            </Text>
            <Text
              style={{
                fontFamily: "Sora_400Regular",
                fontSize: 12,
                color: colors.secondary,
              }}
            >
              Completadas
            </Text>
          </View>

          <View style={{ width: 1, backgroundColor: colors.border }} />

          <View style={{ alignItems: "center", flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Package
                size={20}
                color={
                  packageStats?.remainingClasses < 0 ? "#EF4444" : colors.accent
                }
              />
            </View>
            <Text
              style={{
                fontFamily: "Sora_800ExtraBold",
                fontSize: 24,
                color:
                  packageStats?.remainingClasses < 0
                    ? "#EF4444"
                    : colors.accent,
                marginBottom: 4,
              }}
            >
              {packageStats?.remainingClasses || 0}
            </Text>
            <Text
              style={{
                fontFamily: "Sora_400Regular",
                fontSize: 12,
                color: colors.secondary,
              }}
            >
              Restantes
            </Text>
          </View>
        </View>

        {packageStats?.remainingClasses < 0 && (
          <View
            style={{
              backgroundColor: "#FEE2E2",
              borderRadius: 12,
              padding: 12,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
            }}
          >
            <AlertCircle size={16} color="#EF4444" />
            <Text
              style={{
                fontFamily: "Sora_600SemiBold",
                fontSize: 13,
                color: "#EF4444",
                flex: 1,
              }}
            >
              Tienes {Math.abs(packageStats.remainingClasses)} clase en deuda
            </Text>
          </View>
        )}

        <View
          style={{
            height: 1,
            backgroundColor: colors.border,
            marginVertical: 16,
          }}
        />

        {/* Payment Stats */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ alignItems: "center", flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <DollarSign size={20} color="#10B981" />
            </View>
            <Text
              style={{
                fontFamily: "Sora_800ExtraBold",
                fontSize: 20,
                color: "#10B981",
                marginBottom: 4,
              }}
            >
              ${packageStats?.totalPaid?.toFixed(2) || "0.00"}
            </Text>
            <Text
              style={{
                fontFamily: "Sora_400Regular",
                fontSize: 12,
                color: colors.secondary,
              }}
            >
              Pagado
            </Text>
          </View>

          <View style={{ width: 1, backgroundColor: colors.border }} />

          <View style={{ alignItems: "center", flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <DollarSign
                size={20}
                color={
                  packageStats?.pendingPayments > 0
                    ? "#F59E0B"
                    : colors.secondary
                }
              />
            </View>
            <Text
              style={{
                fontFamily: "Sora_800ExtraBold",
                fontSize: 20,
                color:
                  packageStats?.pendingPayments > 0
                    ? "#F59E0B"
                    : colors.secondary,
                marginBottom: 4,
              }}
            >
              ${packageStats?.pendingPayments?.toFixed(2) || "0.00"}
            </Text>
            <Text
              style={{
                fontFamily: "Sora_400Regular",
                fontSize: 12,
                color: colors.secondary,
              }}
            >
              Pendiente
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
