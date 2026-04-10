import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  Linking,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/utils/auth/useAuth";
import { ShoppingCart, Trash2, CreditCard } from "lucide-react-native";
import { useAppTheme } from "@/components/AppTheme";
import AppScreen from "@/components/AppScreen";
import AppHeader from "@/components/AppHeader";
import {
  useFonts,
  Sora_400Regular,
  Sora_600SemiBold,
  Sora_800ExtraBold,
} from "@expo-google-fonts/sora";

export default function CartScreen() {
  const { colors, isDark } = useAppTheme();
  const router = useRouter();
  const { auth, signIn } = useAuth();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  const [fontsLoaded] = useFonts({
    Sora_400Regular,
    Sora_600SemiBold,
    Sora_800ExtraBold,
  });

  // Helper function to get headers with JWT authentication
  const getAuthHeaders = () => {
    const headers = {
      "Content-Type": "application/json",
    };

    if (auth?.jwt) {
      headers["Authorization"] = `Bearer ${auth.jwt}`;
    }

    return headers;
  };

  const { data: cartData, isLoading } = useQuery({
    queryKey: ["cart", auth?.user?.id],
    queryFn: async () => {
      if (!auth?.user?.id) return { items: [], total: 0 };
      const response = await fetch(`/api/cart?userId=${auth.user.id}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch cart");
      return response.json();
    },
    enabled: !!auth?.user?.id,
  });

  const removeMutation = useMutation({
    mutationFn: async (itemId) => {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to remove item");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
    },
  });

  const handlePayment = async (provider) => {
    if (!auth?.user?.id) {
      Alert.alert("Error", "Debes iniciar sesión para realizar el pago");
      return;
    }

    if (!auth?.jwt) {
      Alert.alert(
        "Error de autenticación",
        "No se encontró el token de sesión. Por favor, cierra sesión e inicia sesión nuevamente.",
      );
      return;
    }

    setIsProcessing(true);
    try {
      let endpoint = "";
      if (provider === "stripe") {
        endpoint = "/api/stripe/create-checkout";
      } else if (provider === "paypal") {
        endpoint = "/api/paypal/create-order";
      } else if (provider === "credicard") {
        endpoint = "/api/credicard/create-payment";
      }

      console.log("🚀 Iniciando pago con", provider);
      console.log("📞 Llamando a:", endpoint);
      console.log("🔑 JWT presente:", !!auth.jwt);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          userId: auth.user.id,
          type: "cart",
        }),
      });

      console.log("📥 Respuesta HTTP:", response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error("❌ Error del servidor:", error);

        // Mostrar error detallado de Credicard
        if (provider === "credicard" && error.credicardError) {
          console.error("💳 Error de Credicard:", error.credicardError);
          console.error("📤 Datos enviados:", error.sentData);
          console.error("🔍 Error parseado:", error.credicardErrorParsed);

          // Mostrar error de forma legible
          let errorMessage = `❌ HTTP Status: ${error.httpStatus}\n\n`;

          if (error.credicardErrorParsed) {
            errorMessage += `📋 Error de Credicard:\n${JSON.stringify(error.credicardErrorParsed, null, 2)}\n\n`;
          } else {
            errorMessage += `📋 Respuesta de Credicard:\n${error.credicardError}\n\n`;
          }

          errorMessage += `📤 Datos enviados:\n`;
          errorMessage += `• Email: ${error.sentData.email}\n`;
          errorMessage += `• Amount: ${error.sentData.amount}\n`;
          errorMessage += `• Concept: ${error.sentData.concept}\n`;
          errorMessage += `• Client ID: ${error.sentData.clientIdUsed}\n`;
          errorMessage += `• Success URL: ${error.sentData.redirectSuccess}\n`;
          errorMessage += `• Failure URL: ${error.sentData.redirectFailure}\n`;

          Alert.alert("Error de Credicard - Debug Info", errorMessage, [
            {
              text: "Copiar Todo",
              onPress: () => {
                console.log("📋 Información completa del error:");
                console.log(JSON.stringify(error, null, 2));
              },
            },
            { text: "OK" },
          ]);
          return;
        }

        throw new Error(error.error || "Error al crear el pago");
      }

      const data = await response.json();
      console.log("✅ Respuesta exitosa:", data);

      // Obtener la URL de pago según el proveedor
      let paymentUrl = "";
      if (provider === "stripe") {
        paymentUrl = data.url;
      } else if (provider === "paypal") {
        paymentUrl = data.approvalUrl;
      } else if (provider === "credicard") {
        paymentUrl = data.paymentUrl;
      }

      console.log("🔗 URL de pago:", paymentUrl);

      if (paymentUrl) {
        // Abrir el navegador con la URL de pago
        const canOpen = await Linking.canOpenURL(paymentUrl);
        console.log("🌐 Puede abrir URL:", canOpen);

        if (canOpen) {
          await Linking.openURL(paymentUrl);
          console.log("✅ Navegador abierto");
        } else {
          throw new Error("No se puede abrir el navegador");
        }
      } else {
        throw new Error("No se recibió la URL de pago");
      }
    } catch (error) {
      console.error("💥 Error en pago:", error);
      Alert.alert("Error", error.message || "No se pudo procesar el pago");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  const header = (
    <AppHeader
      title="Carrito"
      titleStyle={{
        fontFamily: "Sora_800ExtraBold",
        fontSize: 24,
      }}
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
          <ShoppingCart size={64} color={colors.secondary} />
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
            Inicia sesión para ver tu carrito
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
            Guarda tus cursos favoritos
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

  const items = cartData?.items || [];
  const total = cartData?.total || 0;

  return (
    <AppScreen header={header}>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 12 }}>
          {isLoading ? (
            <Text
              style={{
                fontFamily: "Sora_400Regular",
                fontSize: 14,
                color: colors.secondary,
                textAlign: "center",
                paddingVertical: 20,
              }}
            >
              Cargando carrito...
            </Text>
          ) : items.length === 0 ? (
            <View style={{ paddingVertical: 30, alignItems: "center" }}>
              <ShoppingCart size={48} color={colors.secondary} />
              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 18,
                  color: colors.primary,
                  marginTop: 16,
                  marginBottom: 8,
                }}
              >
                Tu carrito está vacío
              </Text>
              <Text
                style={{
                  fontFamily: "Sora_400Regular",
                  fontSize: 14,
                  color: colors.secondary,
                  textAlign: "center",
                  marginBottom: 20,
                }}
              >
                Agrega cursos a tu carrito
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/courses")}
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
              data={items}
              scrollEnabled={false}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View
                  style={{
                    backgroundColor: colors.cardBackground,
                    borderRadius: 16,
                    padding: 12,
                    marginBottom: 12,
                    flexDirection: "row",
                    shadowColor: colors.cardShadow,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: isDark ? 0.3 : 0.06,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                >
                  <Image
                    source={{ uri: item.thumbnail || item.image }}
                    style={{ width: 80, height: 80, borderRadius: 12 }}
                    contentFit="cover"
                    transition={100}
                  />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text
                      style={{
                        fontFamily: "Sora_600SemiBold",
                        fontSize: 16,
                        color: colors.primary,
                        marginBottom: 4,
                      }}
                      numberOfLines={2}
                    >
                      {item.title || item.name}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Sora_800ExtraBold",
                        fontSize: 18,
                        color: colors.accent,
                        marginTop: 4,
                      }}
                    >
                      ${item.price}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => removeMutation.mutate(item.id)}
                    disabled={removeMutation.isLoading}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: colors.destructiveBackground,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Trash2 size={18} color={colors.destructive} />
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </View>

        {/* Payment Buttons Section */}
        {items.length > 0 && (
          <View
            style={{
              backgroundColor: colors.cardBackground,
              borderTopWidth: 1,
              borderTopColor: colors.border,
              padding: 20,
              paddingBottom: 32,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 16,
                  color: colors.secondary,
                }}
              >
                Total
              </Text>
              <Text
                style={{
                  fontFamily: "Sora_800ExtraBold",
                  fontSize: 28,
                  color: colors.primary,
                }}
              >
                ${total.toFixed(2)}
              </Text>
            </View>

            {/* Check if cart has digital courses (not allowed in mobile per Apple policy) */}
            {(() => {
              const hasCourses = items.some(
                (item) => item.item_type === "course",
              );

              if (hasCourses) {
                // Show web purchase message for courses
                return (
                  <View
                    style={{
                      backgroundColor: colors.accentBackground,
                      padding: 20,
                      borderRadius: 16,
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <CreditCard size={32} color={colors.accent} />
                    <Text
                      style={{
                        fontFamily: "Sora_600SemiBold",
                        fontSize: 16,
                        color: colors.primary,
                        textAlign: "center",
                      }}
                    >
                      Compra de Cursos Digitales
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Sora_400Regular",
                        fontSize: 14,
                        color: colors.secondary,
                        textAlign: "center",
                        lineHeight: 20,
                        marginBottom: 8,
                      }}
                    >
                      Para comprar cursos digitales, completa tu compra en
                      nuestra web
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL("https://silverdogtraining.com/cart")
                      }
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
                        Ir a la Web
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              } else {
                // Show payment buttons for physical products only
                return (
                  <>
                    {/* Stripe Button */}
                    <TouchableOpacity
                      onPress={() => handlePayment("stripe")}
                      disabled={isProcessing}
                      style={{
                        backgroundColor: "#635BFF",
                        paddingVertical: 14,
                        borderRadius: 20,
                        alignItems: "center",
                        marginBottom: 10,
                        flexDirection: "row",
                        justifyContent: "center",
                        gap: 8,
                        opacity: isProcessing ? 0.5 : 1,
                      }}
                    >
                      <CreditCard size={20} color="#FFFFFF" />
                      <Text
                        style={{
                          fontFamily: "Sora_600SemiBold",
                          fontSize: 15,
                          color: "#FFFFFF",
                        }}
                      >
                        {isProcessing ? "Procesando..." : "Pagar con Tarjeta"}
                      </Text>
                    </TouchableOpacity>

                    {/* PayPal Button */}
                    <TouchableOpacity
                      onPress={() => handlePayment("paypal")}
                      disabled={isProcessing}
                      style={{
                        backgroundColor: "#0070BA",
                        paddingVertical: 14,
                        borderRadius: 20,
                        alignItems: "center",
                        marginBottom: 10,
                        opacity: isProcessing ? 0.5 : 1,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Sora_600SemiBold",
                          fontSize: 15,
                          color: "#FFFFFF",
                        }}
                      >
                        {isProcessing ? "Procesando..." : "Pagar con PayPal"}
                      </Text>
                    </TouchableOpacity>

                    {/* Credicard Button */}
                    <TouchableOpacity
                      onPress={() => handlePayment("credicard")}
                      disabled={isProcessing}
                      style={{
                        backgroundColor: "#E31837",
                        paddingVertical: 14,
                        borderRadius: 20,
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "center",
                        gap: 8,
                        opacity: isProcessing ? 0.5 : 1,
                      }}
                    >
                      <CreditCard size={20} color="#FFFFFF" />
                      <Text
                        style={{
                          fontFamily: "Sora_600SemiBold",
                          fontSize: 15,
                          color: "#FFFFFF",
                        }}
                      >
                        {isProcessing ? "Procesando..." : "Pagar con Credicard"}
                      </Text>
                    </TouchableOpacity>
                  </>
                );
              }
            })()}
          </View>
        )}
      </View>
    </AppScreen>
  );
}
