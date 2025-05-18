import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Para la navegación
import colors from "../../styles/Colors"; // Ajusta la ruta según tu estructura
import { router } from "expo-router";
import { Searchbar } from "react-native-paper";
import { useAuth } from "../../context/authContext/AuthContext"; // Asegúrate de tener el contexto de autenticación
import { useViajes } from "../../context/viajeContext/ViajeContext"; // Contexto de viajes
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/utils/FirebaseConfig";
import { cp } from "fs";

interface Viaje {
  id: string;
  conductor: string;
  haciaLaU: boolean;
  direccion: string;
  horaSalida: string;
  fecha: string;
  precio: string;
  puntos: string[];
  estado: string;
}

interface Punto {
  direccion: string;
  estado: string;
}


export default function Viajes() {
  const navigation = useNavigation(); // Instancia de la navegación
  const { userName } = useAuth();
  const { user } = useAuth();

  const { obtenerTodosLosViajesDeUnaPersona, viajes } = useViajes(); // Obtener los viajes del contexto
  const [searchQuery, setSearchQuery] = useState("");
  const { obtenerPuntosPorEstado } = useViajes();

  const [viajesEnCurso, setViajesEnCurso] = useState<Viaje[]>([]);
  const [loadingEnCurso, setLoadingEnCurso] = useState(false);
  const onChangeSearch = (query: React.SetStateAction<string>) => setSearchQuery(query);
  const [puntosPendientes, setPuntosPendientes] = useState<{ viajeId: string; viajeDireccion: string; punto: Punto }[]>([]);


  


  // Llamar a obtener los viajes cuando el componente se monta
  useEffect(() => {
    if (user) {
      obtenerTodosLosViajesDeUnaPersona(); // Cargar los viajes del usuario logueado
    }
  }, [user, obtenerTodosLosViajesDeUnaPersona]);

  

  useEffect(() => {
    async function fetchPuntosPorIniciar() {
      if (!user?.uid) return;
  
      try {
        // Llamar a la función obtenerPuntosPorEstado del contexto con el estado "por iniciar"
        const puntosConViaje = await obtenerPuntosPorEstado("pendiente");
        // Extraer sólo los puntos para mostrar en el estado local
        const puntosEstructurados = puntosConViaje.map(item => ({
          viajeId: item.viajeId,
          viajeDireccion: item.viajeDireccion,
          punto: item.punto,
        }));
        setPuntosPendientes(puntosEstructurados);
      } catch (error) {
        console.error("Error al obtener puntos pendientes:", error);
      }
    }
  
    fetchPuntosPorIniciar();
  }, [user, obtenerPuntosPorEstado]);
  
  
  
  

  useEffect(() => {
    async function fetchViajesEnCurso() {
      if (!user?.uid) return;
      setLoadingEnCurso(true);
      try {
        const usuarioId = user.uid;
        const viajesQuery = query(
          collection(db, "viajes creados", usuarioId, "viajes"),
          where("estado", "==", "en curso")
        );
        const viajesSnapshot = await getDocs(viajesQuery);
        const viajesData = viajesSnapshot.docs.map((doc) => doc.data() as Viaje);
        setViajesEnCurso(viajesData);
        console.log("Viajes en curso:", viajesData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingEnCurso(false);
      }
    }

    fetchViajesEnCurso();
  }, [user]);


  return (
    <ScrollView style={styles.container}>
      {/* Header: Viaje en curso */}
      <Text style={styles.greetingText}>Hola, {userName ? userName.charAt(0).toUpperCase() + userName.slice(1) : ''}</Text>
      <Searchbar
        placeholder="Buscar viaje..."
        value={searchQuery}
        onChangeText={onChangeSearch}
        style={styles.barraBusqueda}
      />
      <View>
      {/* Sólo mostrar card si hay algún viaje en curso */}
      {viajesEnCurso.length > 0 && (
        <View style={styles.headerContainer}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Viaje en Curso</Text>
            <Text style={styles.headerSubtitle}>
              {viajesEnCurso[0].fecha}, {viajesEnCurso[0].horaSalida}, {viajesEnCurso[0].direccion}
            </Text>
            <TouchableOpacity>
              <Text style={styles.verDetalles}>Ver detalles</Text>
            </TouchableOpacity>
          </View>
          <Image source={require("../../assets/images/carImage.png")} style={styles.headerImage} />
        </View>
      )}
      {/* Resto de la UI */}
    </View>

      {/* Tus viajes */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tus viajes</Text>
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
            <Text style={styles.noViajesText}>No tienes viajes creados aún.</Text>
          )}
        </ScrollView>
      </View>

      {/* Puntos Solicitados */}
      <View style={styles.section}>
  <Text style={styles.sectionTitle}>Puntos Solicitados</Text>
  {puntosPendientes.length === 0 ? (
    <Text>No hay puntos pendientes.</Text>
  ) : (
    puntosPendientes.map(({ viajeId, viajeDireccion, punto }, index) => (
      <View key={`${viajeId}-${index}`} style={styles.puntoCard}>
        <View style={styles.puntoImagen} />
        <View>
          <Text style={styles.puntoTitulo}>Punto {index + 1} - Viaje: {viajeDireccion}</Text>
          <Text style={styles.puntoDireccion}>{punto.direccion}</Text>
          <Text style={styles.puntoDireccion}>Estado: {punto.estado}</Text>
        </View>
      </View>
    ))
  )}
</View>


      {/* Botón "Crear Viaje" */}
      <TouchableOpacity style={styles.createButton} onPress={() => router.push("/conductor/miViaje")}>
        <Text style={styles.createButtonText}>Crear Viaje</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.white,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 20,
    marginTop: 40,
  },
  barraBusqueda: {
    marginBottom: 20,
    backgroundColor: colors.lightGrey,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerContainer: {
    backgroundColor: colors.blue,
    borderRadius: 12,
    flexDirection: "row",
    padding: 16,
    marginBottom: 24,
    alignItems: "center",
  },
  headerTextContainer: {
    flex: 1
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 4
  },
  headerSubtitle: {
    color: colors.white,
    fontSize: 13,
    marginBottom: 8
  },
  verDetalles: {
    color: colors.white,
    textDecorationLine: "underline",
    fontSize: 13
  },
  headerImage: {
    width: 80,
    height: 80,
    resizeMode: "contain"
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
  },
  puntoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.lightGrey,
    borderRadius: 12,
    padding: 12,
    marginTop: 10
  },
  puntoImagen: {
    width: 40,
    height: 40,
    backgroundColor: colors.lightGrey100,
    borderRadius: 8,
    marginRight: 12
  },
  puntoTitulo: {
    fontWeight: "bold",
    fontSize: 15
  },
  puntoDireccion: {
    fontSize: 13,
    color: colors.grey
  },
  createButton: {
    backgroundColor: colors.blue,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20
  },
  createButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold"
  }
});
