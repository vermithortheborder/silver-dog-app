import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";

export default function TermsOfServicePage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const Section = ({ title, children }) => (
    <View style={{ marginBottom: 32 }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#FF6B35",
          marginBottom: 12,
        }}
      >
        {title}
      </Text>
      {children}
    </View>
  );

  const Paragraph = ({ children, style }) => (
    <Text
      style={{
        fontSize: 15,
        color: "#CCCCCC",
        lineHeight: 24,
        marginBottom: 12,
        ...style,
      }}
    >
      {children}
    </Text>
  );

  const BulletPoint = ({ children }) => (
    <View style={{ flexDirection: "row", marginBottom: 8, paddingLeft: 12 }}>
      <Text style={{ color: "#FF6B35", marginRight: 8, fontSize: 15 }}>•</Text>
      <Text style={{ flex: 1, fontSize: 15, color: "#CCCCCC", lineHeight: 22 }}>
        {children}
      </Text>
    </View>
  );

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
          <ChevronLeft size={24} color="#FF6B35" />
          <Text style={{ color: "#FF6B35", fontSize: 16, marginLeft: 4 }}>
            Volver
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "white",
            marginBottom: 4,
          }}
        >
          Términos de Servicio
        </Text>
        <Text style={{ color: "#999999", fontSize: 14 }}>
          Última actualización: 28 de marzo de 2026
        </Text>
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
          {/* 1. Aceptación */}
          <Section title="1. Aceptación de los Términos">
            <Paragraph>
              Bienvenido a{" "}
              <Text style={{ color: "white", fontWeight: "bold" }}>
                Silver Dog Training
              </Text>
              . Al acceder o utilizar nuestra aplicación móvil y sitio web,
              aceptas estar sujeto a estos Términos de Servicio. Si no estás de
              acuerdo, no debes utilizar nuestros servicios.
            </Paragraph>
          </Section>

          {/* 2. Descripción */}
          <Section title="2. Descripción del Servicio">
            <Paragraph>Silver Dog Training ofrece:</Paragraph>
            <BulletPoint>
              Cursos de entrenamiento canino en línea y personalizados
            </BulletPoint>
            <BulletPoint>
              Clases presenciales y paquetes de entrenamiento
            </BulletPoint>
            <BulletPoint>
              Servicios veterinarios: consultas, historial médico y
              recordatorios
            </BulletPoint>
            <BulletPoint>Tienda de accesorios para mascotas</BulletPoint>
            <BulletPoint>
              Servicios adicionales: peluquería, hospedaje, daycare, clínica
            </BulletPoint>
            <BulletPoint>
              Chat en vivo con instructores certificados
            </BulletPoint>
          </Section>

          {/* 3. Registro */}
          <Section title="3. Registro y Cuenta">
            <Text
              style={{
                fontSize: 17,
                fontWeight: "600",
                color: "white",
                marginBottom: 8,
              }}
            >
              3.1 Requisitos
            </Text>
            <BulletPoint>Debes tener al menos 18 años</BulletPoint>
            <BulletPoint>
              Proporcionar información precisa y actualizada
            </BulletPoint>
            <BulletPoint>
              Mantener la confidencialidad de tu contraseña
            </BulletPoint>
            <BulletPoint>
              Notificar sobre cualquier uso no autorizado
            </BulletPoint>
          </Section>

          {/* 4. Suscripciones */}
          <Section title="4. Suscripciones y Pagos">
            <Text
              style={{
                fontSize: 17,
                fontWeight: "600",
                color: "white",
                marginBottom: 8,
              }}
            >
              4.1 Planes de Suscripción
            </Text>
            <BulletPoint>Plan Mensual: $9.99 USD/mes</BulletPoint>
            <BulletPoint>Plan Anual: $59.99 USD/año (ahorra 50%)</BulletPoint>
            <BulletPoint>
              Renovación automática a menos que se cancele
            </BulletPoint>

            <Text
              style={{
                fontSize: 17,
                fontWeight: "600",
                color: "white",
                marginTop: 16,
                marginBottom: 8,
              }}
            >
              4.2 Política de Reembolsos
            </Text>
            <Paragraph>Para servicios presenciales:</Paragraph>
            <BulletPoint>
              Cancelación con 24h de anticipación: reembolso completo
            </BulletPoint>
            <BulletPoint>
              Cancelación con menos de 24h: sin reembolso
            </BulletPoint>
            <BulletPoint>Clases perdidas no son reembolsables</BulletPoint>

            <Paragraph style={{ marginTop: 12 }}>
              Para cursos digitales: No hay reembolsos una vez accedido el
              contenido. Para suscripciones vía App Store/Google Play, aplican
              sus políticas.
            </Paragraph>
          </Section>

          {/* 5. Uso Aceptable */}
          <Section title="5. Uso Aceptable">
            <Paragraph>Al usar nuestros Servicios, aceptas NO:</Paragraph>
            <BulletPoint>Violar leyes o regulaciones</BulletPoint>
            <BulletPoint>
              Infringir derechos de propiedad intelectual
            </BulletPoint>
            <BulletPoint>Cargar contenido inapropiado u ofensivo</BulletPoint>
            <BulletPoint>Distribuir virus o malware</BulletPoint>
            <BulletPoint>Compartir tu cuenta sin autorización</BulletPoint>
            <BulletPoint>Acosar o amenazar a otros usuarios</BulletPoint>
          </Section>

          {/* 6. Propiedad Intelectual */}
          <Section title="6. Propiedad Intelectual">
            <Paragraph>
              Todo el contenido (videos, textos, gráficos, software) es
              propiedad exclusiva de Silver Dog Training.
            </Paragraph>
            <Paragraph>
              No puedes reproducir, distribuir o modificar nuestro contenido sin
              consentimiento expreso por escrito.
            </Paragraph>
          </Section>

          {/* 7. Contenido del Usuario */}
          <Section title="7. Contenido del Usuario">
            <Paragraph>Al cargar contenido (fotos, mensajes):</Paragraph>
            <BulletPoint>Conservas la propiedad de tu contenido</BulletPoint>
            <BulletPoint>
              Nos otorgas licencia no exclusiva para usarlo en los Servicios
            </BulletPoint>
            <BulletPoint>Garantizas tener derecho a compartirlo</BulletPoint>
            <BulletPoint>Podemos eliminar contenido inapropiado</BulletPoint>
          </Section>

          {/* 8. Limitación de Responsabilidad */}
          <Section title="8. Limitación de Responsabilidad">
            <BulletPoint>
              Servicios proporcionados "tal cual" sin garantías
            </BulletPoint>
            <BulletPoint>No garantizamos resultados específicos</BulletPoint>
            <BulletPoint>No somos responsables de daños indirectos</BulletPoint>
            <BulletPoint>
              Responsabilidad limitada al monto pagado en 12 meses
            </BulletPoint>

            <View
              style={{
                backgroundColor: "#FF6B35",
                borderRadius: 8,
                padding: 12,
                marginTop: 12,
              }}
            >
              <Text
                style={{ color: "white", fontWeight: "bold", marginBottom: 4 }}
              >
                ⚠️ Importante:
              </Text>
              <Text style={{ color: "white", fontSize: 14, lineHeight: 20 }}>
                Los servicios veterinarios son proporcionados por profesionales
                licenciados independientes. No asumimos responsabilidad por
                diagnósticos médicos.
              </Text>
            </View>
          </Section>

          {/* 9. Cancelación */}
          <Section title="9. Cancelación">
            <Text
              style={{
                fontSize: 17,
                fontWeight: "600",
                color: "white",
                marginBottom: 8,
              }}
            >
              Puedes cancelar desde:
            </Text>
            <BulletPoint>Configuración de tu cuenta en la app</BulletPoint>
            <BulletPoint>
              Configuración de App Store (suscripciones iOS)
            </BulletPoint>
            <BulletPoint>Contactando a supportsilverdt@gmail.com</BulletPoint>
          </Section>

          {/* 10. Modificaciones */}
          <Section title="10. Modificaciones">
            <Paragraph>
              Podemos modificar estos Términos. Te notificaremos sobre cambios
              significativos mediante la app o correo electrónico.
            </Paragraph>
          </Section>

          {/* 11. Privacidad */}
          <Section title="11. Privacidad">
            <Paragraph>
              Tu privacidad es importante. Consulta nuestra Política de
              Privacidad para entender cómo protegemos tu información.
            </Paragraph>
          </Section>

          {/* 12. Contacto */}
          <Section title="12. Contacto">
            <Paragraph>Si tienes preguntas sobre estos Términos:</Paragraph>
            <View
              style={{
                backgroundColor: "#0A0A0A",
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: "#2A2A2A",
                marginTop: 8,
              }}
            >
              <Text
                style={{ color: "white", fontWeight: "bold", marginBottom: 8 }}
              >
                Silver Dog Training
              </Text>
              <View style={{ flexDirection: "row", marginBottom: 4 }}>
                <Text style={{ color: "white", fontWeight: "600" }}>
                  Email:{" "}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL("mailto:supportsilverdt@gmail.com")
                  }
                >
                  <Text
                    style={{
                      color: "#FF6B35",
                      textDecorationLine: "underline",
                    }}
                  >
                    supportsilverdt@gmail.com
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ color: "white", fontWeight: "600" }}>
                  Respuesta:{" "}
                </Text>
                <Text style={{ color: "#CCCCCC" }}>24-48 horas hábiles</Text>
              </View>
            </View>
          </Section>

          {/* Footer */}
          <View
            style={{
              marginTop: 32,
              paddingTop: 24,
              borderTopWidth: 1,
              borderTopColor: "#2A2A2A",
            }}
          >
            <Text
              style={{
                color: "#999999",
                fontSize: 13,
                fontStyle: "italic",
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              Al utilizar Silver Dog Training, confirmas que has leído,
              entendido y aceptado estos Términos de Servicio.
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
