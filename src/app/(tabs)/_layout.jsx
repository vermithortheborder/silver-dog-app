import { Tabs } from "expo-router";
import {
  Home,
  BookOpen,
  Calendar,
  ShoppingCart,
  User,
  ShoppingBag,
} from "lucide-react-native";
import { useAppTheme } from "@/components/AppTheme";

export default function TabLayout() {
  const { colors, isDark } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.cardBackground,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingBottom: 4,
          paddingTop: 4,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.secondary,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
        tabBarItemStyle: {
          paddingVertical: 0,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => <Home color={color} size={12} />,
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: "Mis Cursos",
          tabBarIcon: ({ color, size }) => <BookOpen color={color} size={12} />,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: "Tienda",
          tabBarIcon: ({ color, size }) => (
            <ShoppingBag color={color} size={12} />
          ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: "Agenda",
          tabBarIcon: ({ color, size }) => <Calendar color={color} size={12} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Carrito",
          tabBarIcon: ({ color, size }) => (
            <ShoppingCart color={color} size={12} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => <User color={color} size={12} />,
        }}
      />
    </Tabs>
  );
}
