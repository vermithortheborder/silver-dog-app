import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  Image,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/utils/auth/useAuth";
import {
  Calendar,
  Phone,
  MessageCircle,
  Clock,
  Upload,
} from "lucide-react-native";
import { useAppTheme } from "@/components/AppTheme";
import AppScreen from "@/components/AppScreen";
import AppHeader from "@/components/AppHeader";
import {
  useFonts,
  Sora_400Regular,
  Sora_600SemiBold,
  Sora_800ExtraBold,
} from "@expo-google-fonts/sora";
import * as ImagePicker from "expo-image-picker";
import useUpload from "@/utils/useUpload";

const SERVICE_NAMES = {
  peluqueria: "Peluquería Canina",
  funerario: "Servicio Funerario",
  seguro: "Seguro para Mascotas",
  hospedaje: "Hospedaje",
  daycare: "Daycare",
  clinica: "Clínica Veterinaria",
};

export default function ServiceRequestScreen() {
  const { colors, isDark } = useAppTheme();
  const router = useRouter();
  const { serviceType } = useLocalSearchParams();
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const [upload, { loading: uploadLoading }] = useUpload();

  const [fontsLoaded] = useFonts({
    Sora_400Regular,
    Sora_600SemiBold,
    Sora_800ExtraBold,
  });

  // Form state
  const [petSize, setPetSize] = useState("mediano");
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [requestedTime, setRequestedTime] = useState("09:00");
  const [durationDays, setDurationDays] = useState("1");
  const [contactPhone, setContactPhone] = useState("");
  const [contactWhatsapp, setContactWhatsapp] = useState("");
  const [notes, setNotes] = useState("");

  // Campos específicos para servicios funerarios
  const [ownerFullName, setOwnerFullName] = useState("");
  const [ownerIdDocument, setOwnerIdDocument] = useState("");
  const [ownerAddress, setOwnerAddress] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [petName, setPetName] = useState("");
  const [petSpecies, setPetSpecies] = useState("perro");
  const [petBreed, setPetBreed] = useState("");
  const [petWeight, setPetWeight] = useState("");
  const [petColor, setPetColor] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  // Campos específicos para peluquería canina
  const [groomingClientName, setGroomingClientName] = useState("");
  const [groomingPetName, setGroomingPetName] = useState("");
  const [groomingBreed, setGroomingBreed] = useState("");
  const [petSex, setPetSex] = useState("");
  const [groomingSize, setGroomingSize] = useState("mediano");
  const [petAge, setPetAge] = useState("");
  const [groomingColor, setGroomingColor] = useState("");
  const [petImage, setPetImage] = useState(null);
  const [groomingAddress, setGroomingAddress] = useState("");
  const [vaccineUpToDate, setVaccineUpToDate] = useState("");
  const [serviceLocation, setServiceLocation] = useState("");

  // Generate next 14 days
  const generateDates = () => {
    const dates = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const availableDates = generateDates();

  // Fetch pets
  const { data: petsData } = useQuery({
    queryKey: ["pets", auth?.user?.id],
    queryFn: async () => {
      const response = await fetch("/api/pets");
      if (!response.ok) throw new Error("Failed to fetch pets");
      return response.json();
    },
    enabled: !!auth?.user?.id,
  });

  // Fetch pricing
  const { data: pricingData } = useQuery({
    queryKey: ["service-pricing", serviceType],
    queryFn: async () => {
      const response = await fetch(`/api/services/pricing?type=${serviceType}`);
      if (!response.ok) throw new Error("Failed to fetch pricing");
      return response.json();
    },
  });

  // Image picker
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const uploadResult = await upload({
        reactNativeAsset: {
          uri: asset.uri,
          type: asset.type,
          name: asset.fileName || "pet-image.jpg",
          mimeType: asset.mimeType || "image/jpeg",
        },
      });

      if (uploadResult.url) {
        setPetImage(uploadResult.url);
      } else if (uploadResult.error) {
        Alert.alert("Error", "No se pudo subir la imagen");
      }
    }
  };

  // Create request mutation
  const createRequest = useMutation({
    mutationFn: async (data) => {
      const response = await fetch("/api/services/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create request");
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["service-requests"]);
      Alert.alert(
        "¡Solicitud Enviada!",
        `Tu solicitud ha sido enviada. Total: $${data.request.final_price}`,
        [
          {
            text: "WhatsApp",
            onPress: () => openWhatsApp(data.request),
          },
          {
            text: "Aceptar",
            onPress: () => router.back(),
          },
        ],
      );
    },
    onError: (error) => {
      Alert.alert("Error", "No se pudo enviar la solicitud");
    },
  });

  const openWhatsApp = (request) => {
    const phone = "5215512345678";
    const selectedDate = availableDates[selectedDateIndex];
    const message = `Hola! Solicito ${SERVICE_NAMES[serviceType]}. Fecha: ${selectedDate.toLocaleDateString()}. Total: $${request.final_price}`;
    const url = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert("Error", "WhatsApp no está instalado");
        }
      })
      .catch((err) => console.error("Error opening WhatsApp:", err));
  };

  const openPhone = () => {
    const phoneNumber = "tel:5512345678";
    Linking.openURL(phoneNumber);
  };

  const currentPrice = pricingData?.pricing?.find(
    (p) =>
      p.pet_size === (serviceType === "peluqueria" ? groomingSize : petSize),
  );

  const calculateTotal = () => {
    if (!currentPrice) return 0;
    const basePrice = parseFloat(currentPrice.base_price);
    const pricePerDay = parseFloat(currentPrice.price_per_day || 0);
    const days = parseInt(durationDays || 1);

    if (pricePerDay > 0 && days > 1) {
      return basePrice + pricePerDay * (days - 1);
    }
    return basePrice;
  };

  // Validar si el formulario funerario está completo
  const isFuneralFormComplete = () => {
    if (serviceType !== "funerario") return true;
    return (
      ownerFullName.trim() !== "" &&
      ownerIdDocument.trim() !== "" &&
      ownerAddress.trim() !== "" &&
      contactPhone.trim() !== "" &&
      ownerEmail.trim() !== "" &&
      petName.trim() !== "" &&
      petSpecies.trim() !== "" &&
      petBreed.trim() !== "" &&
      petWeight.trim() !== "" &&
      petColor.trim() !== "" &&
      paymentMethod.trim() !== ""
    );
  };

  // Validar si el formulario de peluquería está completo
  const isGroomingFormComplete = () => {
    if (serviceType !== "peluqueria") return true;
    return (
      groomingClientName.trim() !== "" &&
      groomingPetName.trim() !== "" &&
      groomingBreed.trim() !== "" &&
      petSex.trim() !== "" &&
      groomingSize.trim() !== "" &&
      petAge.trim() !== "" &&
      groomingColor.trim() !== "" &&
      groomingAddress.trim() !== "" &&
      vaccineUpToDate.trim() !== "" &&
      serviceLocation.trim() !== "" &&
      contactPhone.trim() !== ""
    );
  };

  const handleSubmit = () => {
    const selectedDate = availableDates[selectedDateIndex];

    if (serviceType === "funerario") {
      if (!isFuneralFormComplete()) {
        Alert.alert("Error", "Por favor completa todos los campos requeridos");
        return;
      }

      createRequest.mutate({
        pet_id: selectedPet,
        service_type: serviceType,
        pet_size: petSize,
        requested_date: selectedDate.toISOString(),
        requested_time: requestedTime,
        duration_days: parseInt(durationDays),
        contact_phone: contactPhone,
        contact_whatsapp: contactWhatsapp,
        notes: JSON.stringify({
          owner: {
            fullName: ownerFullName,
            idDocument: ownerIdDocument,
            address: ownerAddress,
            email: ownerEmail,
          },
          pet: {
            name: petName,
            species: petSpecies,
            breed: petBreed,
            weight: petWeight,
            color: petColor,
          },
          paymentMethod: paymentMethod,
          additionalNotes: notes,
        }),
      });
    } else if (serviceType === "peluqueria") {
      if (!isGroomingFormComplete()) {
        Alert.alert("Error", "Por favor completa todos los campos requeridos");
        return;
      }

      createRequest.mutate({
        pet_id: selectedPet,
        service_type: serviceType,
        pet_size: groomingSize,
        requested_date: selectedDate.toISOString(),
        requested_time: requestedTime,
        duration_days: 1,
        contact_phone: contactPhone,
        contact_whatsapp: contactWhatsapp,
        notes: JSON.stringify({
          client: {
            name: groomingClientName,
          },
          pet: {
            name: groomingPetName,
            breed: groomingBreed,
            sex: petSex,
            size: groomingSize,
            age: petAge,
            color: groomingColor,
            image: petImage,
          },
          service: {
            address: groomingAddress,
            vaccineUpToDate: vaccineUpToDate,
            location: serviceLocation,
          },
          additionalNotes: notes,
        }),
      });
    } else {
      if (!contactPhone && !contactWhatsapp) {
        Alert.alert("Error", "Ingresa al menos un método de contacto");
        return;
      }

      createRequest.mutate({
        pet_id: selectedPet,
        service_type: serviceType,
        pet_size: petSize,
        requested_date: selectedDate.toISOString(),
        requested_time: requestedTime,
        duration_days: parseInt(durationDays),
        contact_phone: contactPhone,
        contact_whatsapp: contactWhatsapp,
        notes,
      });
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  const header = (
    <AppHeader
      title={SERVICE_NAMES[serviceType] || "Solicitar Servicio"}
      showBackButton={true}
      titleStyle={{
        fontFamily: "Sora_800ExtraBold",
        fontSize: 20,
      }}
    />
  );

  const pets = petsData?.pets || [];
  const needsDuration = ["hospedaje", "daycare"].includes(serviceType);
  const isFuneralService = serviceType === "funerario";
  const isGroomingService = serviceType === "peluqueria";

  return (
    <AppScreen header={header}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Precio Estimado */}
        <View
          style={{
            backgroundColor: colors.accent,
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Sora_400Regular",
              fontSize: 14,
              color: "#FFFFFF",
              marginBottom: 8,
            }}
          >
            Precio Estimado
          </Text>
          <Text
            style={{
              fontFamily: "Sora_800ExtraBold",
              fontSize: 36,
              color: "#FFFFFF",
            }}
          >
            ${calculateTotal().toFixed(2)}
          </Text>
          {currentPrice?.description && (
            <Text
              style={{
                fontFamily: "Sora_400Regular",
                fontSize: 12,
                color: "rgba(255,255,255,0.8)",
                marginTop: 8,
                textAlign: "center",
              }}
            >
              {currentPrice.description}
            </Text>
          )}
        </View>

        {/* Formulario específico para Peluquería Canina */}
        {isGroomingService ? (
          <>
            {/* Información del Cliente */}
            <View
              style={{
                backgroundColor: colors.cardBackground,
                borderRadius: 16,
                padding: 20,
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  fontFamily: "Sora_800ExtraBold",
                  fontSize: 18,
                  color: colors.primary,
                  marginBottom: 16,
                }}
              >
                👤 Información del Cliente
              </Text>

              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 14,
                  color: colors.primary,
                  marginBottom: 8,
                }}
              >
                Nombre del Cliente *
              </Text>
              <TextInput
                value={groomingClientName}
                onChangeText={setGroomingClientName}
                placeholder="Juan Pérez"
                placeholderTextColor={colors.secondary}
                style={{
                  backgroundColor: colors.background,
                  borderRadius: 12,
                  padding: 16,
                  fontFamily: "Sora_400Regular",
                  fontSize: 16,
                  color: colors.primary,
                  marginBottom: 16,
                }}
              />

              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 14,
                  color: colors.primary,
                  marginBottom: 8,
                }}
              >
                Teléfono de Contacto *
              </Text>
              <TextInput
                value={contactPhone}
                onChangeText={setContactPhone}
                placeholder="55 1234 5678"
                placeholderTextColor={colors.secondary}
                keyboardType="phone-pad"
                style={{
                  backgroundColor: colors.background,
                  borderRadius: 12,
                  padding: 16,
                  fontFamily: "Sora_400Regular",
                  fontSize: 16,
                  color: colors.primary,
                }}
              />
            </View>

            {/* Información de la Mascota */}
            <View
              style={{
                backgroundColor: colors.cardBackground,
                borderRadius: 16,
                padding: 20,
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  fontFamily: "Sora_800ExtraBold",
                  fontSize: 18,
                  color: colors.primary,
                  marginBottom: 16,
                }}
              >
                🐾 Información de la Mascota
              </Text>

              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 14,
                  color: colors.primary,
                  marginBottom: 8,
                }}
              >
                Nombre de la Mascota *
              </Text>
              <TextInput
                value={groomingPetName}
                onChangeText={setGroomingPetName}
                placeholder="Max"
                placeholderTextColor={colors.secondary}
                style={{
                  backgroundColor: colors.background,
                  borderRadius: 12,
                  padding: 16,
                  fontFamily: "Sora_400Regular",
                  fontSize: 16,
                  color: colors.primary,
                  marginBottom: 16,
                }}
              />

              <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: "Sora_600SemiBold",
                      fontSize: 14,
                      color: colors.primary,
                      marginBottom: 8,
                    }}
                  >
                    Raza *
                  </Text>
                  <TextInput
                    value={groomingBreed}
                    onChangeText={setGroomingBreed}
                    placeholder="Golden Retriever"
                    placeholderTextColor={colors.secondary}
                    style={{
                      backgroundColor: colors.background,
                      borderRadius: 12,
                      padding: 16,
                      fontFamily: "Sora_400Regular",
                      fontSize: 16,
                      color: colors.primary,
                    }}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: "Sora_600SemiBold",
                      fontSize: 14,
                      color: colors.primary,
                      marginBottom: 8,
                    }}
                  >
                    Sexo *
                  </Text>
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    {["Macho", "Hembra"].map((sex) => (
                      <TouchableOpacity
                        key={sex}
                        onPress={() => setPetSex(sex)}
                        style={{
                          flex: 1,
                          paddingVertical: 12,
                          borderRadius: 12,
                          backgroundColor:
                            petSex === sex ? colors.accent : colors.background,
                          alignItems: "center",
                          borderWidth: 2,
                          borderColor:
                            petSex === sex ? colors.accent : "transparent",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Sora_600SemiBold",
                            fontSize: 14,
                            color: petSex === sex ? "#FFFFFF" : colors.primary,
                          }}
                        >
                          {sex}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 14,
                  color: colors.primary,
                  marginBottom: 8,
                }}
              >
                Tamaño *
              </Text>
              <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
                {[
                  { key: "pequeno", label: "P" },
                  { key: "mediano", label: "M" },
                  { key: "grande", label: "G" },
                ].map((size) => (
                  <TouchableOpacity
                    key={size.key}
                    onPress={() => setGroomingSize(size.key)}
                    style={{
                      flex: 1,
                      paddingVertical: 12,
                      borderRadius: 12,
                      backgroundColor:
                        groomingSize === size.key
                          ? colors.accent
                          : colors.background,
                      alignItems: "center",
                      borderWidth: 2,
                      borderColor:
                        groomingSize === size.key
                          ? colors.accent
                          : "transparent",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Sora_800ExtraBold",
                        fontSize: 18,
                        color:
                          groomingSize === size.key
                            ? "#FFFFFF"
                            : colors.primary,
                      }}
                    >
                      {size.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: "Sora_600SemiBold",
                      fontSize: 14,
                      color: colors.primary,
                      marginBottom: 8,
                    }}
                  >
                    Edad *
                  </Text>
                  <TextInput
                    value={petAge}
                    onChangeText={setPetAge}
                    placeholder="3 años"
                    placeholderTextColor={colors.secondary}
                    style={{
                      backgroundColor: colors.background,
                      borderRadius: 12,
                      padding: 16,
                      fontFamily: "Sora_400Regular",
                      fontSize: 16,
                      color: colors.primary,
                    }}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: "Sora_600SemiBold",
                      fontSize: 14,
                      color: colors.primary,
                      marginBottom: 8,
                    }}
                  >
                    Color *
                  </Text>
                  <TextInput
                    value={groomingColor}
                    onChangeText={setGroomingColor}
                    placeholder="Dorado"
                    placeholderTextColor={colors.secondary}
                    style={{
                      backgroundColor: colors.background,
                      borderRadius: 12,
                      padding: 16,
                      fontFamily: "Sora_400Regular",
                      fontSize: 16,
                      color: colors.primary,
                    }}
                  />
                </View>
              </View>

              {/* Imagen de la Mascota */}
              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 14,
                  color: colors.primary,
                  marginBottom: 8,
                }}
              >
                Imagen de la Mascota (opcional)
              </Text>
              <TouchableOpacity
                onPress={pickImage}
                disabled={uploadLoading}
                style={{
                  backgroundColor: colors.background,
                  borderRadius: 12,
                  padding: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 120,
                  borderWidth: 2,
                  borderColor: petImage ? colors.accent : colors.secondary,
                  borderStyle: "dashed",
                }}
              >
                {petImage ? (
                  <Image
                    source={{ uri: petImage }}
                    style={{ width: "100%", height: 150, borderRadius: 8 }}
                    resizeMode="cover"
                  />
                ) : (
                  <>
                    <Upload size={32} color={colors.secondary} />
                    <Text
                      style={{
                        fontFamily: "Sora_400Regular",
                        fontSize: 14,
                        color: colors.secondary,
                        marginTop: 8,
                      }}
                    >
                      {uploadLoading
                        ? "Subiendo imagen..."
                        : "Toca para subir una foto"}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Información del Servicio */}
            <View
              style={{
                backgroundColor: colors.cardBackground,
                borderRadius: 16,
                padding: 20,
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  fontFamily: "Sora_800ExtraBold",
                  fontSize: 18,
                  color: colors.primary,
                  marginBottom: 16,
                }}
              >
                🏡 Información del Servicio
              </Text>

              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 14,
                  color: colors.primary,
                  marginBottom: 8,
                }}
              >
                Dirección *
              </Text>
              <TextInput
                value={groomingAddress}
                onChangeText={setGroomingAddress}
                placeholder="Calle, Número, Colonia, CP"
                placeholderTextColor={colors.secondary}
                multiline
                numberOfLines={2}
                style={{
                  backgroundColor: colors.background,
                  borderRadius: 12,
                  padding: 16,
                  fontFamily: "Sora_400Regular",
                  fontSize: 16,
                  color: colors.primary,
                  marginBottom: 16,
                  textAlignVertical: "top",
                }}
              />

              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 14,
                  color: colors.primary,
                  marginBottom: 8,
                }}
              >
                ¿Vacuna al día? *
              </Text>
              <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
                {["Sí", "No"].map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => setVaccineUpToDate(option)}
                    style={{
                      flex: 1,
                      paddingVertical: 12,
                      borderRadius: 12,
                      backgroundColor:
                        vaccineUpToDate === option
                          ? colors.accent
                          : colors.background,
                      alignItems: "center",
                      borderWidth: 2,
                      borderColor:
                        vaccineUpToDate === option
                          ? colors.accent
                          : "transparent",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Sora_600SemiBold",
                        fontSize: 16,
                        color:
                          vaccineUpToDate === option
                            ? "#FFFFFF"
                            : colors.primary,
                      }}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 14,
                  color: colors.primary,
                  marginBottom: 8,
                }}
              >
                Tipo de Servicio *
              </Text>
              <View style={{ gap: 12 }}>
                {[
                  { key: "domicilio", label: "🏡 Servicio a Domicilio" },
                  { key: "recogida", label: "🚗 Servicio de Recogida" },
                ].map((service) => (
                  <TouchableOpacity
                    key={service.key}
                    onPress={() => setServiceLocation(service.key)}
                    style={{
                      padding: 16,
                      borderRadius: 12,
                      backgroundColor:
                        serviceLocation === service.key
                          ? colors.accent
                          : colors.background,
                      borderWidth: 2,
                      borderColor:
                        serviceLocation === service.key
                          ? colors.accent
                          : "transparent",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Sora_600SemiBold",
                        fontSize: 16,
                        color:
                          serviceLocation === service.key
                            ? "#FFFFFF"
                            : colors.primary,
                      }}
                    >
                      {service.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Notas Adicionales */}
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 16,
                  color: colors.primary,
                  marginBottom: 12,
                }}
              >
                Notas Adicionales (Opcional)
              </Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
                placeholder="Información adicional sobre tu mascota"
                placeholderTextColor={colors.secondary}
                style={{
                  backgroundColor: colors.cardBackground,
                  borderRadius: 12,
                  padding: 16,
                  fontFamily: "Sora_400Regular",
                  fontSize: 16,
                  color: colors.primary,
                  minHeight: 100,
                  textAlignVertical: "top",
                }}
              />
            </View>
          </>
        ) : isFuneralService ? (
          <>
            {/* Formulario de Servicio Funerario (mantener igual) */}
            <View
              style={{
                backgroundColor: colors.cardBackground,
                borderRadius: 16,
                padding: 20,
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  fontFamily: "Sora_800ExtraBold",
                  fontSize: 18,
                  color: colors.primary,
                  marginBottom: 16,
                }}
              >
                👤 Información del Propietario
              </Text>

              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 14,
                  color: colors.primary,
                  marginBottom: 8,
                }}
              >
                Nombre Completo *
              </Text>
              <TextInput
                value={ownerFullName}
                onChangeText={setOwnerFullName}
                placeholder="Juan Pérez García"
                placeholderTextColor={colors.secondary}
                style={{
                  backgroundColor: colors.background,
                  borderRadius: 12,
                  padding: 16,
                  fontFamily: "Sora_400Regular",
                  fontSize: 16,
                  color: colors.primary,
                  marginBottom: 16,
                }}
              />

              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 14,
                  color: colors.primary,
                  marginBottom: 8,
                }}
              >
                Documento de Identidad *
              </Text>
              <TextInput
                value={ownerIdDocument}
                onChangeText={setOwnerIdDocument}
                placeholder="INE, Pasaporte, etc."
                placeholderTextColor={colors.secondary}
                style={{
                  backgroundColor: colors.background,
                  borderRadius: 12,
                  padding: 16,
                  fontFamily: "Sora_400Regular",
                  fontSize: 16,
                  color: colors.primary,
                  marginBottom: 16,
                }}
              />

              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 14,
                  color: colors.primary,
                  marginBottom: 8,
                }}
              >
                Dirección Completa *
              </Text>
              <TextInput
                value={ownerAddress}
                onChangeText={setOwnerAddress}
                placeholder="Calle, Número, Colonia, CP, Ciudad"
                placeholderTextColor={colors.secondary}
                multiline
                numberOfLines={2}
                style={{
                  backgroundColor: colors.background,
                  borderRadius: 12,
                  padding: 16,
                  fontFamily: "Sora_400Regular",
                  fontSize: 16,
                  color: colors.primary,
                  marginBottom: 16,
                  textAlignVertical: "top",
                }}
              />

              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 14,
                  color: colors.primary,
                  marginBottom: 8,
                }}
              >
                Teléfono *
              </Text>
              <TextInput
                value={contactPhone}
                onChangeText={setContactPhone}
                placeholder="55 1234 5678"
                placeholderTextColor={colors.secondary}
                keyboardType="phone-pad"
                style={{
                  backgroundColor: colors.background,
                  borderRadius: 12,
                  padding: 16,
                  fontFamily: "Sora_400Regular",
                  fontSize: 16,
                  color: colors.primary,
                  marginBottom: 16,
                }}
              />

              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 14,
                  color: colors.primary,
                  marginBottom: 8,
                }}
              >
                Correo Electrónico *
              </Text>
              <TextInput
                value={ownerEmail}
                onChangeText={setOwnerEmail}
                placeholder="ejemplo@correo.com"
                placeholderTextColor={colors.secondary}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{
                  backgroundColor: colors.background,
                  borderRadius: 12,
                  padding: 16,
                  fontFamily: "Sora_400Regular",
                  fontSize: 16,
                  color: colors.primary,
                }}
              />
            </View>

            <View
              style={{
                backgroundColor: colors.cardBackground,
                borderRadius: 16,
                padding: 20,
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  fontFamily: "Sora_800ExtraBold",
                  fontSize: 18,
                  color: colors.primary,
                  marginBottom: 16,
                }}
              >
                🐾 Información de la Mascota
              </Text>

              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 14,
                  color: colors.primary,
                  marginBottom: 8,
                }}
              >
                Nombre de la Mascota *
              </Text>
              <TextInput
                value={petName}
                onChangeText={setPetName}
                placeholder="Max"
                placeholderTextColor={colors.secondary}
                style={{
                  backgroundColor: colors.background,
                  borderRadius: 12,
                  padding: 16,
                  fontFamily: "Sora_400Regular",
                  fontSize: 16,
                  color: colors.primary,
                  marginBottom: 16,
                }}
              />

              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 14,
                  color: colors.primary,
                  marginBottom: 8,
                }}
              >
                Especie *
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                {["perro", "gato", "ave", "roedor", "reptil", "otro"].map(
                  (species) => (
                    <TouchableOpacity
                      key={species}
                      onPress={() => setPetSpecies(species)}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 12,
                        backgroundColor:
                          petSpecies === species
                            ? colors.accent
                            : colors.background,
                        borderWidth: 2,
                        borderColor:
                          petSpecies === species
                            ? colors.accent
                            : "transparent",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Sora_600SemiBold",
                          fontSize: 14,
                          color:
                            petSpecies === species ? "#FFFFFF" : colors.primary,
                        }}
                      >
                        {species.charAt(0).toUpperCase() + species.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ),
                )}
              </View>

              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 14,
                  color: colors.primary,
                  marginBottom: 8,
                }}
              >
                Raza *
              </Text>
              <TextInput
                value={petBreed}
                onChangeText={setPetBreed}
                placeholder="Golden Retriever"
                placeholderTextColor={colors.secondary}
                style={{
                  backgroundColor: colors.background,
                  borderRadius: 12,
                  padding: 16,
                  fontFamily: "Sora_400Regular",
                  fontSize: 16,
                  color: colors.primary,
                  marginBottom: 16,
                }}
              />

              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 14,
                  color: colors.primary,
                  marginBottom: 8,
                }}
              >
                Peso Aproximado (kg) *
              </Text>
              <TextInput
                value={petWeight}
                onChangeText={setPetWeight}
                placeholder="25.5"
                placeholderTextColor={colors.secondary}
                keyboardType="decimal-pad"
                style={{
                  backgroundColor: colors.background,
                  borderRadius: 12,
                  padding: 16,
                  fontFamily: "Sora_400Regular",
                  fontSize: 16,
                  color: colors.primary,
                  marginBottom: 16,
                }}
              />

              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 14,
                  color: colors.primary,
                  marginBottom: 8,
                }}
              >
                Color de la Mascota *
              </Text>
              <TextInput
                value={petColor}
                onChangeText={setPetColor}
                placeholder="Dorado"
                placeholderTextColor={colors.secondary}
                style={{
                  backgroundColor: colors.background,
                  borderRadius: 12,
                  padding: 16,
                  fontFamily: "Sora_400Regular",
                  fontSize: 16,
                  color: colors.primary,
                }}
              />
            </View>

            <View
              style={{
                backgroundColor: colors.cardBackground,
                borderRadius: 16,
                padding: 20,
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  fontFamily: "Sora_800ExtraBold",
                  fontSize: 18,
                  color: colors.primary,
                  marginBottom: 16,
                }}
              >
                💳 Método de Pago *
              </Text>
              <View style={{ gap: 12 }}>
                {[
                  "Efectivo",
                  "Tarjeta de Crédito",
                  "Transferencia Bancaria",
                ].map((method) => (
                  <TouchableOpacity
                    key={method}
                    onPress={() => setPaymentMethod(method)}
                    style={{
                      padding: 16,
                      borderRadius: 12,
                      backgroundColor:
                        paymentMethod === method
                          ? colors.accent
                          : colors.background,
                      borderWidth: 2,
                      borderColor:
                        paymentMethod === method
                          ? colors.accent
                          : "transparent",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Sora_600SemiBold",
                        fontSize: 16,
                        color:
                          paymentMethod === method ? "#FFFFFF" : colors.primary,
                      }}
                    >
                      {method}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 16,
                  color: colors.primary,
                  marginBottom: 12,
                }}
              >
                Notas Adicionales (Opcional)
              </Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
                placeholder="Información adicional que desees compartir"
                placeholderTextColor={colors.secondary}
                style={{
                  backgroundColor: colors.cardBackground,
                  borderRadius: 12,
                  padding: 16,
                  fontFamily: "Sora_400Regular",
                  fontSize: 16,
                  color: colors.primary,
                  minHeight: 100,
                  textAlignVertical: "top",
                }}
              />
            </View>
          </>
        ) : (
          <>
            {/* Formulario normal para otros servicios */}
            {pets.length > 0 && (
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontFamily: "Sora_600SemiBold",
                    fontSize: 16,
                    color: colors.primary,
                    marginBottom: 12,
                  }}
                >
                  Mascota (opcional)
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 8 }}
                  style={{ flexGrow: 0 }}
                >
                  {pets.map((pet) => (
                    <TouchableOpacity
                      key={pet.id}
                      onPress={() => setSelectedPet(pet.id)}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 12,
                        backgroundColor:
                          selectedPet === pet.id
                            ? colors.accent
                            : colors.cardBackground,
                        borderWidth: 2,
                        borderColor:
                          selectedPet === pet.id
                            ? colors.accent
                            : "transparent",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Sora_600SemiBold",
                          fontSize: 14,
                          color:
                            selectedPet === pet.id ? "#FFFFFF" : colors.primary,
                        }}
                      >
                        {pet.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 16,
                  color: colors.primary,
                  marginBottom: 12,
                }}
              >
                Tamaño del Perro
              </Text>
              <View style={{ flexDirection: "row", gap: 12 }}>
                {["pequeno", "mediano", "grande"].map((size) => (
                  <TouchableOpacity
                    key={size}
                    onPress={() => setPetSize(size)}
                    style={{
                      flex: 1,
                      paddingVertical: 12,
                      borderRadius: 12,
                      backgroundColor:
                        petSize === size
                          ? colors.accent
                          : colors.cardBackground,
                      alignItems: "center",
                      borderWidth: 2,
                      borderColor:
                        petSize === size ? colors.accent : "transparent",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Sora_600SemiBold",
                        fontSize: 14,
                        color: petSize === size ? "#FFFFFF" : colors.primary,
                      }}
                    >
                      {size === "pequeno"
                        ? "Pequeño"
                        : size === "mediano"
                          ? "Mediano"
                          : "Grande"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 16,
                  color: colors.primary,
                  marginBottom: 12,
                }}
              >
                Fecha Preferida
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
                style={{ flexGrow: 0 }}
              >
                {availableDates.map((date, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedDateIndex(index)}
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      borderRadius: 12,
                      backgroundColor:
                        selectedDateIndex === index
                          ? colors.accent
                          : colors.cardBackground,
                      alignItems: "center",
                      minWidth: 80,
                      borderWidth: 2,
                      borderColor:
                        selectedDateIndex === index
                          ? colors.accent
                          : "transparent",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Sora_600SemiBold",
                        fontSize: 12,
                        color:
                          selectedDateIndex === index
                            ? "#FFFFFF"
                            : colors.secondary,
                        marginBottom: 4,
                      }}
                    >
                      {date.toLocaleDateString("es-ES", { weekday: "short" })}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Sora_800ExtraBold",
                        fontSize: 18,
                        color:
                          selectedDateIndex === index
                            ? "#FFFFFF"
                            : colors.primary,
                      }}
                    >
                      {date.getDate()}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Sora_400Regular",
                        fontSize: 10,
                        color:
                          selectedDateIndex === index
                            ? "#FFFFFF"
                            : colors.secondary,
                      }}
                    >
                      {date.toLocaleDateString("es-ES", { month: "short" })}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 16,
                  color: colors.primary,
                  marginBottom: 12,
                }}
              >
                Hora Preferida
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {["09:00", "11:00", "13:00", "15:00", "17:00"].map((time) => (
                  <TouchableOpacity
                    key={time}
                    onPress={() => setRequestedTime(time)}
                    style={{
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      borderRadius: 12,
                      backgroundColor:
                        requestedTime === time
                          ? colors.accent
                          : colors.cardBackground,
                      borderWidth: 2,
                      borderColor:
                        requestedTime === time ? colors.accent : "transparent",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Sora_600SemiBold",
                        fontSize: 14,
                        color:
                          requestedTime === time ? "#FFFFFF" : colors.primary,
                      }}
                    >
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {needsDuration && (
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontFamily: "Sora_600SemiBold",
                    fontSize: 16,
                    color: colors.primary,
                    marginBottom: 12,
                  }}
                >
                  Duración (días)
                </Text>
                <TextInput
                  value={durationDays}
                  onChangeText={setDurationDays}
                  keyboardType="number-pad"
                  placeholder="Ej: 3"
                  placeholderTextColor={colors.secondary}
                  style={{
                    backgroundColor: colors.cardBackground,
                    borderRadius: 12,
                    padding: 16,
                    fontFamily: "Sora_400Regular",
                    fontSize: 16,
                    color: colors.primary,
                  }}
                />
              </View>
            )}

            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 16,
                  color: colors.primary,
                  marginBottom: 12,
                }}
              >
                Teléfono de Contacto *
              </Text>
              <TextInput
                value={contactPhone}
                onChangeText={setContactPhone}
                keyboardType="phone-pad"
                placeholder="55 1234 5678"
                placeholderTextColor={colors.secondary}
                style={{
                  backgroundColor: colors.cardBackground,
                  borderRadius: 12,
                  padding: 16,
                  fontFamily: "Sora_400Regular",
                  fontSize: 16,
                  color: colors.primary,
                  marginBottom: 12,
                }}
              />
              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 16,
                  color: colors.primary,
                  marginBottom: 12,
                }}
              >
                WhatsApp (opcional)
              </Text>
              <TextInput
                value={contactWhatsapp}
                onChangeText={setContactWhatsapp}
                keyboardType="phone-pad"
                placeholder="55 1234 5678"
                placeholderTextColor={colors.secondary}
                style={{
                  backgroundColor: colors.cardBackground,
                  borderRadius: 12,
                  padding: 16,
                  fontFamily: "Sora_400Regular",
                  fontSize: 16,
                  color: colors.primary,
                }}
              />
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontFamily: "Sora_600SemiBold",
                  fontSize: 16,
                  color: colors.primary,
                  marginBottom: 12,
                }}
              >
                Notas Adicionales
              </Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
                placeholder="Ej: Mi perro es nervioso con extraños"
                placeholderTextColor={colors.secondary}
                style={{
                  backgroundColor: colors.cardBackground,
                  borderRadius: 12,
                  padding: 16,
                  fontFamily: "Sora_400Regular",
                  fontSize: 16,
                  color: colors.primary,
                  minHeight: 100,
                  textAlignVertical: "top",
                }}
              />
            </View>
          </>
        )}

        {/* Botones de Acción */}
        <View style={{ gap: 12, marginBottom: 20 }}>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={
              createRequest.isPending ||
              (isFuneralService && !isFuneralFormComplete()) ||
              (isGroomingService && !isGroomingFormComplete())
            }
            style={{
              backgroundColor: colors.accent,
              borderRadius: 16,
              padding: 18,
              alignItems: "center",
              opacity:
                createRequest.isPending ||
                (isFuneralService && !isFuneralFormComplete()) ||
                (isGroomingService && !isGroomingFormComplete())
                  ? 0.6
                  : 1,
            }}
          >
            <Text
              style={{
                fontFamily: "Sora_800ExtraBold",
                fontSize: 18,
                color: "#FFFFFF",
              }}
            >
              {createRequest.isPending ? "Enviando..." : "Solicitar Servicio"}
            </Text>
          </TouchableOpacity>

          {((isFuneralService && !isFuneralFormComplete()) ||
            (isGroomingService && !isGroomingFormComplete())) && (
            <Text
              style={{
                fontFamily: "Sora_400Regular",
                fontSize: 12,
                color: colors.secondary,
                textAlign: "center",
              }}
            >
              ⚠️ Por favor completa todos los campos requeridos
            </Text>
          )}

          {!isFuneralService && !isGroomingService && (
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                onPress={() => openWhatsApp({ final_price: calculateTotal() })}
                style={{
                  flex: 1,
                  backgroundColor: "#25D366",
                  borderRadius: 16,
                  padding: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <MessageCircle size={20} color="#FFFFFF" />
                <Text
                  style={{
                    fontFamily: "Sora_600SemiBold",
                    fontSize: 14,
                    color: "#FFFFFF",
                  }}
                >
                  WhatsApp
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={openPhone}
                style={{
                  flex: 1,
                  backgroundColor: "#007AFF",
                  borderRadius: 16,
                  padding: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <Phone size={20} color="#FFFFFF" />
                <Text
                  style={{
                    fontFamily: "Sora_600SemiBold",
                    fontSize: 14,
                    color: "#FFFFFF",
                  }}
                >
                  Llamar
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </AppScreen>
  );
}
