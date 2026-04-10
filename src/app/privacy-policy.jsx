import {
  View,
  Text,
  ScrollView,
  Linking,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, Mail, Shield } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";

export default function PrivacyPolicyScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View
      style={{ flex: 1, backgroundColor: "#0A0A0A", paddingTop: insets.top }}
    >
      <StatusBar style="light" />

      {/* Header */}
      <View
        style={{
          backgroundColor: "#1A1A1A",
          borderBottomWidth: 1,
          borderBottomColor: "#2A2A2A",
          paddingHorizontal: 20,
          paddingVertical: 16,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <ArrowLeft size={24} color="#FF6B35" />
          <Text style={{ color: "#FF6B35", fontSize: 16, marginLeft: 4 }}>
            Volver
          </Text>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "bold",
                color: "white",
                marginBottom: 4,
              }}
            >
              Política de Privacidad
            </Text>
            <Text style={{ fontSize: 14, color: "#999999" }}>
              Última actualización: Abril 2026
            </Text>
          </View>
          <Shield size={28} color="#FF6B35" />
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: insets.bottom + 80,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            backgroundColor: "#1A1A1A",
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: "#2A2A2A",
          }}
        >
          {/* Introduction */}
          <View style={{ marginBottom: 32 }}>
            <Text style={{ fontSize: 16, color: "#CCCCCC", lineHeight: 24 }}>
              En{" "}
              <Text style={{ fontWeight: "700", color: "white" }}>
                Silver Dog Training
              </Text>
              , nos comprometemos a proteger tu privacidad. Esta política
              explica qué información recopilamos, cómo la usamos y tus derechos
              sobre tus datos.
            </Text>
          </View>

          {/* Section 1 */}
          <View style={{ marginBottom: 32 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#FF6B35",
                marginBottom: 12,
              }}
            >
              1. Información que Recopilamos
            </Text>

            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "white",
                marginTop: 16,
                marginBottom: 8,
              }}
            >
              Información de Cuenta:
            </Text>
            <Text style={{ fontSize: 15, color: "#CCCCCC", lineHeight: 22 }}>
              • Nombre y correo electrónico (al registrarte){"\n"}• Foto de
              perfil (opcional){"\n"}• Método de autenticación (email/Google)
            </Text>

            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "white",
                marginTop: 16,
                marginBottom: 8,
              }}
            >
              Datos de Mascotas:
            </Text>
            <Text style={{ fontSize: 15, color: "#CCCCCC", lineHeight: 22 }}>
              • Información de mascotas (nombre, raza, edad, peso, fotos){"\n"}•
              Historial médico y citas veterinarias{"\n"}• Recordatorios de
              vacunas y medicamentos{"\n"}• Programación de alimentación y
              actividades
            </Text>

            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "white",
                marginTop: 16,
                marginBottom: 8,
              }}
            >
              Datos de Uso:
            </Text>
            <Text style={{ fontSize: 15, color: "#CCCCCC", lineHeight: 22 }}>
              • Inscripciones a cursos y clases{"\n"}• Asistencia a clases
              (escaneado de QR){"\n"}• Mensajes del chat con instructores{"\n"}•
              Historial de compras y pagos{"\n"}• Tokens de notificaciones push
              (para enviarte recordatorios)
            </Text>

            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "white",
                marginTop: 16,
                marginBottom: 8,
              }}
            >
              Fotos y Cámara:
            </Text>
            <Text style={{ fontSize: 15, color: "#CCCCCC", lineHeight: 22 }}>
              • Acceso a la cámara SOLO cuando escaneas códigos QR para
              verificar asistencia{"\n"}• Fotos de perfil y de mascotas que
              subes voluntariamente
            </Text>
          </View>

          {/* Section 2 */}
          <View style={{ marginBottom: 32 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#FF6B35",
                marginBottom: 12,
              }}
            >
              2. Cómo Usamos Tu Información
            </Text>
            <Text style={{ fontSize: 15, color: "#CCCCCC", lineHeight: 24 }}>
              Usamos tus datos exclusivamente para:{"\n\n"}•{" "}
              <Text style={{ fontWeight: "600", color: "white" }}>
                Proporcionar el servicio:
              </Text>{" "}
              Gestionar tu cuenta, mascotas, clases y citas{"\n"}•{" "}
              <Text style={{ fontWeight: "600", color: "white" }}>
                Notificaciones importantes:
              </Text>{" "}
              Recordatorios de vacunas, citas, clases programadas{"\n"}•{" "}
              <Text style={{ fontWeight: "600", color: "white" }}>
                Comunicación:
              </Text>{" "}
              Chat con instructores y veterinarios{"\n"}•{" "}
              <Text style={{ fontWeight: "600", color: "white" }}>Pagos:</Text>{" "}
              Procesar compras de cursos, paquetes de clases y accesorios{"\n"}•{" "}
              <Text style={{ fontWeight: "600", color: "white" }}>
                Mejorar la app:
              </Text>{" "}
              Analizar el uso para mejorar la experiencia{"\n\n"}
              <Text
                style={{ fontWeight: "bold", color: "#EF4444", fontSize: 16 }}
              >
                NO vendemos tu información a terceros.
              </Text>
            </Text>
          </View>

          {/* Section 3 */}
          <View style={{ marginBottom: 32 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#FF6B35",
                marginBottom: 12,
              }}
            >
              3. Compartir Información
            </Text>
            <Text style={{ fontSize: 15, color: "#CCCCCC", lineHeight: 24 }}>
              Solo compartimos información con:{"\n\n"}•{" "}
              <Text style={{ fontWeight: "600", color: "white" }}>
                Instructores asignados:
              </Text>{" "}
              Para gestionar tus clases{"\n"}•{" "}
              <Text style={{ fontWeight: "600", color: "white" }}>
                Veterinarios:
              </Text>{" "}
              Para citas y historial médico de tus mascotas{"\n"}•{" "}
              <Text style={{ fontWeight: "600", color: "white" }}>
                Procesadores de pago:
              </Text>{" "}
              PayPal, Stripe (solo datos necesarios para transacciones){"\n"}•{" "}
              <Text style={{ fontWeight: "600", color: "white" }}>
                Servicios de infraestructura:
              </Text>{" "}
              Hosting, base de datos, notificaciones push{"\n\n"}
              Todos estos servicios están obligados contractualmente a proteger
              tu información.
            </Text>
          </View>

          {/* Section 4 */}
          <View style={{ marginBottom: 32 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#FF6B35",
                marginBottom: 12,
              }}
            >
              4. Seguridad de Datos
            </Text>
            <Text style={{ fontSize: 15, color: "#CCCCCC", lineHeight: 24 }}>
              Protegemos tu información mediante:{"\n\n"}• Encriptación de datos
              en tránsito (HTTPS/TLS){"\n"}• Encriptación de contraseñas (nunca
              almacenamos contraseñas en texto plano){"\n"}• Acceso restringido
              a datos sensibles{"\n"}• Copias de seguridad regulares{"\n"}•
              Autenticación segura con Google OAuth
            </Text>
          </View>

          {/* Section 5 */}
          <View style={{ marginBottom: 32 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#FF6B35",
                marginBottom: 12,
              }}
            >
              5. Tus Derechos
            </Text>
            <Text style={{ fontSize: 15, color: "#CCCCCC", lineHeight: 24 }}>
              Tienes derecho a:{"\n\n"}•{" "}
              <Text style={{ fontWeight: "600", color: "white" }}>
                Acceder:
              </Text>{" "}
              Ver toda tu información personal{"\n"}•{" "}
              <Text style={{ fontWeight: "600", color: "white" }}>
                Corregir:
              </Text>{" "}
              Actualizar datos incorrectos{"\n"}•{" "}
              <Text style={{ fontWeight: "600", color: "white" }}>
                Eliminar:
              </Text>{" "}
              Borrar tu cuenta y todos tus datos permanentemente{"\n"}•{" "}
              <Text style={{ fontWeight: "600", color: "white" }}>
                Exportar:
              </Text>{" "}
              Obtener una copia de tus datos{"\n"}•{" "}
              <Text style={{ fontWeight: "600", color: "white" }}>
                Revocar consentimiento:
              </Text>{" "}
              Desactivar notificaciones push{"\n\n"}
              Para ejercer estos derechos, ve a tu perfil o contáctanos.
            </Text>
          </View>

          {/* Section 6 - Delete Account */}
          <View
            style={{
              marginBottom: 32,
              backgroundColor: "#2A2100",
              padding: 16,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#4A3600",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#FFD700",
                marginBottom: 12,
              }}
            >
              6. Eliminar Tu Cuenta
            </Text>
            <Text style={{ fontSize: 15, color: "#CCCCCC", lineHeight: 24 }}>
              Puedes eliminar tu cuenta en cualquier momento desde tu perfil.
              {"\n\n"}
              Al eliminar tu cuenta:{"\n"}• Se borrarán permanentemente todos
              tus datos personales{"\n"}• Se eliminarán todos los datos de tus
              mascotas{"\n"}• Se cancelarán tus clases programadas{"\n"}•
              Perderás acceso a cursos adquiridos{"\n"}• Esta acción es{" "}
              <Text style={{ fontWeight: "bold", color: "white" }}>
                irreversible
              </Text>
              {"\n\n"}
              El proceso de eliminación se completa en un plazo de 30 días.
            </Text>
          </View>

          {/* Section 7 */}
          <View style={{ marginBottom: 32 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#FF6B35",
                marginBottom: 12,
              }}
            >
              7. Retención de Datos
            </Text>
            <Text style={{ fontSize: 15, color: "#CCCCCC", lineHeight: 24 }}>
              • Datos de cuenta: Mientras tu cuenta esté activa{"\n"}• Historial
              de transacciones: 7 años (requisitos fiscales){"\n"}• Datos de
              mascotas: Hasta que los elimines o cierres tu cuenta{"\n"}• Logs
              del sistema: 90 días
            </Text>
          </View>

          {/* Section 8 */}
          <View style={{ marginBottom: 32 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#FF6B35",
                marginBottom: 12,
              }}
            >
              8. Menores de Edad
            </Text>
            <Text style={{ fontSize: 15, color: "#CCCCCC", lineHeight: 24 }}>
              Esta aplicación está diseñada para mayores de 18 años. No
              recopilamos intencionalmente información de menores de edad. Si
              descubres que un menor ha proporcionado datos, contáctanos
              inmediatamente.
            </Text>
          </View>

          {/* Section 9 */}
          <View style={{ marginBottom: 32 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#FF6B35",
                marginBottom: 12,
              }}
            >
              9. Cambios a esta Política
            </Text>
            <Text style={{ fontSize: 15, color: "#CCCCCC", lineHeight: 24 }}>
              Podemos actualizar esta política ocasionalmente. Te notificaremos
              de cambios significativos mediante:{"\n\n"}• Notificación push en
              la app{"\n"}• Email a tu cuenta registrada{"\n"}• Aviso en la app
              durante 30 días{"\n\n"}
              Fecha de última actualización:{" "}
              <Text style={{ fontWeight: "600", color: "white" }}>
                Abril 8, 2026
              </Text>
            </Text>
          </View>

          {/* Contact */}
          <View style={{ marginBottom: 32 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#FF6B35",
                marginBottom: 12,
              }}
            >
              10. Contacto
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: "#CCCCCC",
                lineHeight: 24,
                marginBottom: 16,
              }}
            >
              Si tienes preguntas sobre esta política o quieres ejercer tus
              derechos, contáctanos:
            </Text>

            <TouchableOpacity
              onPress={() =>
                Linking.openURL("mailto:vermithortheborder@gmail.com")
              }
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#0A0A0A",
                padding: 16,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#2A2A2A",
              }}
            >
              <Mail size={20} color="#FF6B35" />
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "600",
                  color: "#FF6B35",
                  marginLeft: 12,
                }}
              >
                vermithortheborder@gmail.com
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View
            style={{
              marginTop: 20,
              paddingTop: 20,
              borderTopWidth: 1,
              borderTopColor: "#2A2A2A",
            }}
          >
            <Text
              style={{
                fontSize: 13,
                color: "#999999",
                textAlign: "center",
                lineHeight: 20,
                fontStyle: "italic",
              }}
            >
              Silver Dog Training App{"\n"}© 2026 Todos los derechos reservados
            </Text>
          </View>
        </View>

        {/* Botón de regreso */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            backgroundColor: "#FF6B35",
            borderRadius: 12,
            padding: 16,
            marginTop: 24,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            Volver
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
