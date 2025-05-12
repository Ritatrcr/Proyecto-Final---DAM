import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import colors from "../../styles/Colors"; // Ajusta la ruta según tu estructura
import { router } from "expo-router";
import { Searchbar } from "react-native-paper";
import { useAuth } from "../../context/authContext/AuthContext"; // Asegúrate de tener el contexto de autenticación
import { useViajes } from "../../context/viajeContext/ViajeContext"; // Contexto de viajes

export default function Viajes() {
  const navigation = useNavigation(); // Instancia de la navegación
  const { userName } = useAuth();
  const { user } = useAuth();

  const { viajes, obtenerViajesPorEstado } = useViajes(); // Obtener los viajes filtrados por estado
  const [searchQuery, setSearchQuery] = useState("");

  // Llamar a obtener los viajes con estado "finalizado" cuando el componente se monta
  useEffect(() => {
    if (user) {
      obtenerViajesPorEstado("finalizado");
    }
  }, [user, obtenerViajesPorEstado]);
  
  console.log("Viajes:", viajes);
  

  const onChangeSearch = (query: React.SetStateAction<string>) => setSearchQuery(query);


  return (
    <ScrollView style={styles.container}>
      {/* Barra de búsqueda */}
      <Searchbar
        placeholder="Buscar viaje..."
        value={searchQuery}
        onChangeText={onChangeSearch}
        style={styles.barraBusqueda}
      />

      {/* Viajes finalizados */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Viajes Finalizados</Text>
          <TouchableOpacity><Text style={styles.verMas}>Ver más</Text></TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {viajes.length > 0 ? (
            viajes.map((viaje, index) => (
              <View key={index} style={styles.viajeCard}>
                <View style={styles.fechaTag}><Text style={styles.fechaText}>{viaje.fecha}</Text></View>
                <View style={styles.cardImage} />
                <Text style={styles.viajeCiudad}>{viaje.direccion}</Text>
                <Text style={styles.viajeDesc}>{viaje.horaSalida}, {viaje.precio}</Text>
                <Text style={styles.viajeSolicitudes}>{viaje.estado}</Text>
                <TouchableOpacity style={styles.verInfoButton}>
                  <Text style={styles.verInfoText}>Ver info</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.noViajesText}>No tienes viajes finalizados.</Text>
          )}
        </ScrollView>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.white,
  },
  barraBusqueda: {
    marginBottom: 20,
    backgroundColor: colors.lightGrey,
  },
  section: {
    marginBottom: 30
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold"
  },
  verMas: {
    color: colors.blue,
    fontSize: 14
  },
  viajeCard: {
    width: 200,
    backgroundColor: colors.lightGrey,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    position: "relative"
  },
  fechaTag: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: colors.blue,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 3,
  },
  fechaText: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.white,
  },
  cardImage: {
    width: "100%",
    height: 60,
    backgroundColor: colors.lightGrey100,
    borderRadius: 8,
    marginBottom: 10
  },
  viajeCiudad: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4
  },
  viajeDesc: {
    fontSize: 12,
    color: colors.grey,
    marginBottom: 2
  },
  viajeSolicitudes: {
    fontSize: 12,
    color: colors.grey,
    marginBottom: 10
  },
  verInfoButton: {
    borderColor: colors.blue,
    borderWidth: 1,
    borderRadius: 20,
    alignItems: "center",
    paddingVertical: 6
  },
  verInfoText: {
    color: colors.blue,
    fontWeight: "bold",
    fontSize: 13
  },
  noViajesText: {
    fontSize: 16,
    color: colors.grey,
    textAlign: "center",
    padding: 20
  }
});
