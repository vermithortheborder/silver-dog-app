import React from "react";
import { View, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/utils/auth/useAuth";
import useUser from "@/utils/useUser";
import { usePremium } from "@/utils/usePremium";
import { Scan } from "lucide-react-native";
import { useAppTheme } from "@/components/AppTheme";
import AppScreen from "@/components/AppScreen";
import AppHeader from "@/components/AppHeader";
import {
  useFonts,
  Sora_400Regular,
  Sora_600SemiBold,
  Sora_800ExtraBold,
} from "@expo-google-fonts/sora";
import { useProfileData } from "@/hooks/useProfileData";
import { UnauthenticatedView } from "@/components/Profile/UnauthenticatedView";
import { UserInfoCard } from "@/components/Profile/UserInfoCard";
import { PremiumBanner } from "@/components/Profile/PremiumBanner";
import { PremiumActiveBadge } from "@/components/Profile/PremiumActiveBadge";
import { DigitalIDCard } from "@/components/Profile/DigitalIDCard";
import { RoleActionButton } from "@/components/Profile/RoleActionButton";
import { MenuSection } from "@/components/Profile/MenuSection";
import { SignOutButton } from "@/components/Profile/SignOutButton";

export default function ProfileScreen() {
  const { colors, isDark } = useAppTheme();
  const router = useRouter();
  const { auth, signIn, signOut } = useAuth();
  const { data: user } = useUser();
  const { isPremium, isLoading: premiumLoading } = usePremium();

  const [fontsLoaded] = useFonts({
    Sora_400Regular,
    Sora_600SemiBold,
    Sora_800ExtraBold,
  });

  const { statsData, packageStats } = useProfileData(auth?.user?.id);

  if (!fontsLoaded) {
    return null;
  }

  const header = (
    <AppHeader
      title="Perfil"
      titleStyle={{
        fontFamily: "Sora_800ExtraBold",
        fontSize: 24,
      }}
    />
  );

  if (!auth?.user) {
    return (
      <AppScreen header={header}>
        <UnauthenticatedView colors={colors} onSignIn={signIn} />
      </AppScreen>
    );
  }

  const isInstructor = user?.role === "instructor" || user?.role === "admin";
  const isVeterinarian = user?.role === "veterinario" || user?.role === "admin";

  return (
    <AppScreen header={header}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 20 }}>
          <UserInfoCard
            user={auth.user}
            userRole={user?.role}
            colors={colors}
          />

          {!premiumLoading && !isPremium && (
            <PremiumBanner
              colors={colors}
              onPress={() => router.push("/paywall")}
            />
          )}

          {isPremium && <PremiumActiveBadge />}

          <DigitalIDCard
            userId={auth.user.id}
            packageStats={packageStats}
            colors={colors}
            isDark={isDark}
          />

          {isInstructor && (
            <>
              <RoleActionButton
                backgroundColor={colors.accent}
                icon={Scan}
                title="📱 Escanear Carnet QR"
                subtitle="Registrar asistencia"
                onPress={() => router.push("/qr-scanner")}
              />
              <RoleActionButton
                backgroundColor="#7C3AED"
                emoji="👨‍🏫"
                title="Panel de Instructor"
                subtitle="Gestiona clases y estudiantes"
                onPress={() => router.push("/instructor")}
              />
            </>
          )}

          {isVeterinarian && (
            <RoleActionButton
              backgroundColor="#FF5733"
              emoji="🐶"
              title="Panel de Veterinario"
              subtitle="Gestiona tus mascotas y pacientes"
              onPress={() => router.push("/admin/veterinary")}
            />
          )}

          <MenuSection colors={colors} isDark={isDark} router={router} />

          <SignOutButton colors={colors} onSignOut={signOut} />
        </View>
      </ScrollView>
    </AppScreen>
  );
}
