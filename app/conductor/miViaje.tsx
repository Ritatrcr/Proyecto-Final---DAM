import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Para la flecha hacia atrás y el icono de intercambio
import { useAuth } from "@/context/authContext/AuthContext"; // Contexto de autenticación
import { useViajes } from "@/context/viajeContext/ViajeContext"; // Contexto de viajes
import colors from "@/styles/Colors";

export default function CrearViaje() {
  const { user } = useAuth(); // Obtenemos el usuario logueado
  const { userName } = useAuth();
  const { agregarViaje } = useViajes(); // Obtenemos la función de agregar viaje del contexto de viajes
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [precio, setPrecio] = useState("15.00");
  const [origen, setOrigen] = useState(""); // Este será el campo editable
  const [destino] = useState("Universidad de la Sabana"); // Este será el valor fijo

  // Estado para determinar si el destino es editable
  const [isDestinoEditable, setIsDestinoEditable] = useState(false);

  // Función para manejar la navegación hacia atrás
  const handleBack = () => {
    // Aquí se puede usar la navegación que prefieras, en este caso, `navigation.goBack()`
  };

  // Función para intercambiar los puntos de origen y destino
  const handleSwap = () => {
    setIsDestinoEditable(!isDestinoEditable); // Cambiar si el destino es editable o no
    setOrigen(destino); // Cambiar el origen por el destino (o viceversa si se desea)
  };

  // Función para manejar la creación de un viaje
  const handleCreateViaje = async () => {
    if (!user) {
      console.error("Usuario no logueado");
      return;
    }

    const nuevoViaje = {
      id: user.uid, // Usamos el UID del usuario como el ID del viaje
      conductor: userName || "Conductor desconocido", // Nombre del conductor
      haciaLaU: destino === "Universidad de la Sabana", // Establecemos si es hacia la U
      direccion: origen,
      horaSalida: hora,
      fecha: fecha,
      precio: precio,
      puntos: [""], // Inicializamos con un punto pendiente
      estado: "por iniciar", // El viaje aún no ha comenzado
    };

    // Llamamos a la función agregarViaje del contexto
    await agregarViaje(nuevoViaje);
    console.log("Viaje creado con éxito");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Flecha hacia atrás */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={24} color="blue" />
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Crea un nuevo viaje</Text>
      </View>

      {/* Contenedor de Origen (editable) y Destino (fijo) con el ícono a la izquierda */}
      <View style={styles.inputContainerRow}>
        <Ionicons name="location-outline" size={24} color="black" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Colina"
          placeholderTextColor={colors.grey}
          value={origen}
          onChangeText={setOrigen} // Solo origen es editable
        />
        {/* Botón de intercambio */}
        <TouchableOpacity style={styles.swapButton} onPress={handleSwap}>
          <Ionicons name="swap-vertical" size={24} color="blue" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainerRow}>
        <Ionicons name="location-outline" size={24} color="black" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Where to?"
          placeholderTextColor={colors.grey}
          value={destino} // Destino es fijo
          editable={isDestinoEditable} // Solo se puede editar cuando isDestinoEditable es true
        />
      </View>

      {/* Fecha */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Fecha</Text>
        <TextInput
          style={styles.input}
          placeholder="Lunes 12-12-2012"
          placeholderTextColor={colors.grey}
          value={fecha}
          onChangeText={setFecha}
        />
      </View>

      {/* Hora */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Hora del viaje</Text>
        <TextInput
          style={styles.input}
          placeholder="Hora del viaje"
          placeholderTextColor={colors.grey}
          value={hora}
          onChangeText={setHora}
        />
      </View>

      {/* Precio */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Precio</Text>
        <View style={styles.priceButtonsContainer}>
          {["15.00", "15.30", "15.10", "15.05"].map((price, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.priceButton,
                price === precio && styles.selectedPriceButton
              ]}
              onPress={() => setPrecio(price)}
            >
              <Text style={styles.priceText}>€ {price}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Botón para crear viaje */}
      <TouchableOpacity style={styles.createButton} onPress={handleCreateViaje}>
        <Text style={styles.createButtonText}>Crear Viaje</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.white
  },
  backButton: {
    marginBottom: 20,
  },
  header: {
    marginBottom: 20
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.black
  },
  inputContainer: {
    marginBottom: 15
  },
  inputContainerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15
  },
  icon: {
    marginRight: 10,
  },
  label: {
    fontSize: 14,
    color: colors.black,
    marginBottom: 5
  },
  input: {
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    flex: 1, // Para que ocupe el espacio restante
  },
  swapButton: {
    marginLeft: 10,
    borderRadius: 50,   
    backgroundColor: colors.lightBlue,
    padding: 10,
  },
  
  priceButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10
  },
  priceButton: {
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginBottom: 10,
    backgroundColor: colors.lightBlue,
  },
  selectedPriceButton: {
    backgroundColor: colors.blue,
  },
  priceText: {
    color: colors.black,
    fontSize: 16
  },
  createButton: {
    backgroundColor: colors.blue,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    marginTop: 30,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold"
  },
});

