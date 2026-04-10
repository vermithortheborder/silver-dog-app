import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/utils/auth/useAuth";
import {
  Search,
  ShoppingBag,
  MessageCircle,
  ShoppingCart,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { useAppTheme } from "@/components/AppTheme";
import AppScreen from "@/components/AppScreen";
import AppHeader from "@/components/AppHeader";
import {
  useFonts,
  Sora_400Regular,
  Sora_600SemiBold,
  Sora_800ExtraBold,
} from "@expo-google-fonts/sora";

export default function ShopScreen() {
  const { colors, isDark } = useAppTheme();
  const { auth, signIn } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [addingToCart, setAddingToCart] = useState(null);

  const [fontsLoaded] = useFonts({
    Sora_400Regular,
    Sora_600SemiBold,
    Sora_800ExtraBold,
  });

  const { data: accessories, isLoading } = useQuery({
    queryKey: ["accessories", search, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (selectedCategory) params.append("category", selectedCategory);

      const url = `/api/accessories${params.toString() ? `?${params.toString()}` : ""}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch accessories");
      return response.json();
    },
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

  const addToCartMutation = useMutation({
    mutationFn: async ({ itemId, itemType }) => {
      if (!auth?.user?.id) throw new Error("User not authenticated");
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: auth.user.id.toString(),
          itemType,
          itemId,
          quantity: 1,
        }),
      });
      if (!response.ok) throw new Error("Failed to add to cart");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
      setAddingToCart(null);
      Alert.alert("¡Agregado!", "Producto agregado al carrito");
    },
  });

  const handleAddToCart = (accessory) => {
    if (!auth?.user) {
      Alert.alert(
        "Inicia sesión",
        "Debes iniciar sesión para agregar productos al carrito",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Iniciar sesión", onPress: () => signIn() },
        ],
      );
      return;
    }
    setAddingToCart(accessory.id);
    addToCartMutation.mutate({ itemId: accessory.id, itemType: "accessory" });
  };

  const categories = [
    { id: "", label: "Todos" },
    { id: "alimento", label: "Alimento" },
    { id: "collares", label: "Collares" },
    { id: "correas", label: "Correas" },
    { id: "arneses", label: "Arneses" },
    { id: "pecheras", label: "Pecheras" },
    { id: "juguetes", label: "Juguetes" },
    { id: "camas", label: "Camas" },
    { id: "comederos", label: "Comederos" },
    { id: "cuidados", label: "Cuidados" },
  ];

  if (!fontsLoaded) {
    return null;
  }

  const items = accessories?.accessories || [];

  const header = (
    <AppHeader
      title="Tienda"
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

  return (
    <AppScreen header={header}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 0 }}
        ListHeaderComponent={
          <View style={{ marginBottom: 20 }}>
            {/* Search Bar */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.cardBackground,
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 12,
                marginBottom: 16,
                borderWidth: 2,
                borderColor: colors.border,
              }}
            >
              <Search size={20} color={colors.secondary} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Buscar productos..."
                placeholderTextColor={colors.secondary}
                style={{
                  flex: 1,
                  marginLeft: 12,
                  fontFamily: "Sora_400Regular",
                  fontSize: 16,
                  color: colors.primary,
                }}
              />
            </View>

            {/* Category Filter */}
            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 14,
                  color: colors.secondary,
                  marginBottom: 12,
                }}
              >
                Categorías
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => setSelectedCategory(cat.id)}
                    style={{
                      backgroundColor:
                        selectedCategory === cat.id
                          ? colors.accent
                          : colors.cardBackground,
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      borderRadius: 20,
                      borderWidth: 2,
                      borderColor:
                        selectedCategory === cat.id
                          ? colors.accent
                          : colors.border,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Sora_600SemiBold",
                        fontSize: 12,
                        color:
                          selectedCategory === cat.id
                            ? "#FFFFFF"
                            : colors.primary,
                      }}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Info Banner */}
            <View
              style={{
                backgroundColor: colors.accentBackground,
                padding: 16,
                borderRadius: 16,
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 16,
                  color: colors.accent,
                  marginBottom: 4,
                }}
              >
                🐕 Todo para tu perro
              </Text>
              <Text
                style={{
                  fontFamily: "Sora_400Regular",
                  fontSize: 14,
                  color: colors.secondary,
                }}
              >
                {selectedCategory
                  ? `Categoría: ${categories.find((c) => c.id === selectedCategory)?.label}`
                  : "Accesorios y comida de calidad"}
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={{ paddingVertical: 60, alignItems: "center" }}>
            {isLoading ? (
              <>
                <Text
                  style={{
                    fontFamily: "Sora_400Regular",
                    fontSize: 14,
                    color: colors.secondary,
                  }}
                >
                  Cargando productos...
                </Text>
              </>
            ) : (
              <>
                <ShoppingBag size={48} color={colors.secondary} />
                <Text
                  style={{
                    fontFamily: "Sora_600SemiBold",
                    fontSize: 18,
                    color: colors.primary,
                    marginTop: 16,
                    marginBottom: 8,
                  }}
                >
                  No hay productos
                </Text>
                <Text
                  style={{
                    fontFamily: "Sora_400Regular",
                    fontSize: 14,
                    color: colors.secondary,
                  }}
                >
                  {search ? "Intenta otra búsqueda" : "Vuelve pronto"}
                </Text>
              </>
            )}
          </View>
        }
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item: accessory }) => (
          <View
            style={{
              width: "48%",
              backgroundColor: colors.cardBackground,
              borderRadius: 16,
              overflow: "hidden",
              marginBottom: 16,
              shadowColor: colors.cardShadow,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDark ? 0.3 : 0.06,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            {accessory.image ? (
              <Image
                source={{ uri: accessory.image }}
                style={{ width: "100%", height: 140 }}
                contentFit="cover"
                transition={100}
              />
            ) : (
              <View
                style={{
                  width: "100%",
                  height: 140,
                  backgroundColor: colors.accentBackground,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ShoppingBag size={40} color={colors.accent} />
              </View>
            )}

            <View style={{ padding: 12 }}>
              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 14,
                  color: colors.primary,
                  marginBottom: 4,
                  minHeight: 40,
                }}
                numberOfLines={2}
              >
                {accessory.name}
              </Text>

              <Text
                style={{
                  fontFamily: "Sora_800ExtraBold",
                  fontSize: 20,
                  color: colors.accent,
                  marginBottom: 8,
                }}
              >
                ${parseFloat(accessory.price).toFixed(2)}
              </Text>

              <TouchableOpacity
                onPress={() => handleAddToCart(accessory)}
                disabled={
                  addingToCart === accessory.id || accessory.stock === 0
                }
                style={{
                  backgroundColor:
                    accessory.stock === 0 ? colors.border : colors.accent,
                  paddingVertical: 10,
                  borderRadius: 12,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Sora_600SemiBold",
                    fontSize: 12,
                    color: "#FFFFFF",
                  }}
                >
                  {addingToCart === accessory.id
                    ? "..."
                    : accessory.stock === 0
                      ? "Sin Stock"
                      : "Agregar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </AppScreen>
  );
}
