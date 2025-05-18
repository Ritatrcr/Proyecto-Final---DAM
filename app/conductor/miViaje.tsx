import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Modal,
  Pressable,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/authContext/AuthContext";
import { useViajes } from "@/context/viajeContext/ViajeContext";
import colors from "@/styles/Colors";
import { router } from "expo-router";

export default function CrearViaje() {
  const { user } = useAuth();
  const { userName } = useAuth();
  const { agregarViaje } = useViajes();

  const [fecha, setFecha] = useState<Date | null>(null);
  const [hora, setHora] = useState<Date | null>(null);
  const [precio, setPrecio] = useState("15.00");
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("Universidad de la Sabana");

  const [isDestinoEditable, setIsDestinoEditable] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Estado para mostrar DateTimePickers
  const [showFechaPicker, setShowFechaPicker] = useState(false);
  const [showHoraPicker, setShowHoraPicker] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleSwap = () => {
    setIsDestinoEditable(!isDestinoEditable);
    const temp = origen;
    setOrigen(destino);
    setDestino(temp);
  };

  const handleCreateViaje = async () => {
    if (!user) {
      console.error("Usuario no logueado");
      return;
    }
    if (!fecha || !hora) {
      alert("Por favor selecciona fecha y hora");
      return;
    }
    const fechaStr = fecha.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const horaStr = hora.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const nuevoViaje = {
      id: user.uid,
      conductor: userName || "Conductor desconocido",
      haciaLaU: destino === "Universidad de la Sabana",
      direccion: origen,
      fecha: fechaStr,
      horaSalida: horaStr,
      precio: precio,
      puntos: [""],
      estado: "por iniciar",
    };

    await agregarViaje(nuevoViaje);
    setModalVisible(true);
  };

  // Manejo selector fecha
  const onChangeFecha = (event: any, selectedDate?: Date) => {
    setShowFechaPicker(Platform.OS === "ios");
    if (selectedDate) {
      setFecha(selectedDate);
    }
  };

  // Manejo selector hora
  const onChangeHora = (event: any, selectedTime?: Date) => {
    setShowHoraPicker(Platform.OS === "ios");
    if (selectedTime) {
      setHora(selectedTime);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={24} color={colors.blue} />
      </TouchableOpacity>

      <Text style={styles.title}>Crea un nuevo viaje</Text>

      {/* Contenedor origen-destino con swap */}
      <View style={styles.originDestContainer}>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Origen</Text>
          <TextInput
            style={styles.input}
            placeholder="Colina"
            placeholderTextColor={colors.grey}
            value={origen}
            onChangeText={setOrigen}
            autoCapitalize="words"
            returnKeyType="done"
          />
        </View>

        <TouchableOpacity
          style={styles.swapButton}
          onPress={handleSwap}
          activeOpacity={0.7}
        >
          <Ionicons name="swap-vertical" size={28} color={colors.blue} />
        </TouchableOpacity>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Destino</Text>
          <TextInput
            style={[styles.input, isDestinoEditable && styles.inputEditable]}
            value={destino}
            onChangeText={setDestino}
            editable={isDestinoEditable}
            selectTextOnFocus={isDestinoEditable}
            autoCapitalize="words"
            returnKeyType="done"
          />
        </View>
      </View>

      {/* Selector Fecha */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Fecha</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowFechaPicker(true)}
          activeOpacity={0.7}
        >
          <Text style={{ color: fecha ? colors.black : colors.grey, fontSize: 16 }}>
            {fecha
              ? fecha.toLocaleDateString("es-ES", {
                  weekday: "long",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              : "Selecciona una fecha"}
          </Text>
        </TouchableOpacity>
        {showFechaPicker && (
          <DateTimePicker
            value={fecha || new Date()}
            mode="date"
            display="calendar"
            onChange={onChangeFecha}
            minimumDate={new Date()}
          />
        )}
      </View>

      {/* Selector Hora */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Hora del viaje</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowHoraPicker(true)}
          activeOpacity={0.7}
        >
          <Text style={{ color: hora ? colors.black : colors.grey, fontSize: 16 }}>
            {hora
              ? hora.toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
              : "Selecciona la hora"}
          </Text>
        </TouchableOpacity>
        {showHoraPicker && (
          <DateTimePicker
            value={hora || new Date()}
            mode="time"
            display="spinner"
            onChange={onChangeHora}
            is24Hour={true}
          />
        )}
      </View>

      {/* Precio */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Precio</Text>
        <View style={styles.priceButtonsContainer}>
          {["15.00", "15.30", "15.10", "15.05"].map((price) => (
            <TouchableOpacity
              key={price}
              style={[
                styles.priceButton,
                precio === price && styles.priceButtonSelected,
              ]}
              onPress={() => setPrecio(price)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.priceText,
                  precio === price && styles.priceTextSelected,
                ]}
              >
                € {price}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Botón Crear viaje */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreateViaje}
        activeOpacity={0.8}
      >
        <Text style={styles.createButtonText}>Crear Viaje</Text>
      </TouchableOpacity>

      {/* Modal Confirmación */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>¡Viaje creado!</Text>
            <Text style={styles.modalMessage}>
              Tu viaje ha sido creado con éxito.
            </Text>
            <Pressable
              style={[styles.modalButton, styles.confirmButton]}
              onPress={() => {
                setModalVisible(false);
                router.push("../");
              }}
            >
              <Text style={styles.modalButtonText}>Ir a Inicio</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: {
    marginBottom: 15,
    width: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 25,
  },
  originDestContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  inputWrapper: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    color: colors.black,
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: colors.black,
    backgroundColor: colors.white,
  },
  inputEditable: {
    borderColor: colors.blue,
    backgroundColor: "#f0f7ff",
  },
  swapButton: {
    width: 60,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  priceButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priceButton: {
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
    marginHorizontal: 3,
  },
  priceButtonSelected: {
    backgroundColor: colors.blue,
    borderColor: colors.blue,
  },
  priceText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: "500",
  },
  priceTextSelected: {
    color: colors.white,
    fontWeight: "700",
  },
  createButton: {
    backgroundColor: colors.blue,
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 30,
    alignItems: "center",
  },
  createButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  modalContainer: {
    backgroundColor: colors.white,
    padding: 30,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    maxWidth: 360,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.black,
    marginBottom: 15,
  },
  modalMessage: {
    fontSize: 16,
    color: colors.grey,
    textAlign: "center",
    marginBottom: 25,
  },
  modalButton: {
    backgroundColor: colors.blue,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  modalButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  inputGroup: {
    marginBottom: 20,
  },
  
  confirmButton: {
    backgroundColor: colors.blue,


    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 20,

  },
  

});
  