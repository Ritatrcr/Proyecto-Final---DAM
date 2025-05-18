import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useAuth } from "@/context/authContext/AuthContext"; // Ejemplo de contexto donde está el user
import { useViajes } from "@/context/viajeContext/ViajeContext"; // Contexto donde está obtenerPuntosPorEstado

interface Punto {
  estado: string;
  fecha?: string;
  hora?: string;
  direccion?: string;
  sector?: string;
  // otros campos
}

interface PuntoConViaje {
  viajeId: string;
  viajeDireccion: string;
  punto: Punto;
}

export default function Solicitudes() {
  const [activeTab, setActiveTab] = useState<"todos" | "aceptados" | "pendientes" | "negados">("todos");
  const [puntosPendientes, setPuntosPendientes] = useState<PuntoConViaje[]>([]);
  const [puntosAceptados, setPuntosAceptados] = useState<PuntoConViaje[]>([]);
  const [puntosNegados, setPuntosNegados] = useState<PuntoConViaje[]>([]);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const { obtenerPuntosPorEstado } = useViajes();

  // Carga pendientes
  useEffect(() => {
    async function fetchPendientes() {
      if (!user?.uid) return;
      try {
        setLoading(true);
        const data = await obtenerPuntosPorEstado("pendiente");
        setPuntosPendientes(data);
      } catch (error) {
        console.error("Error al obtener puntos pendientes:", error);
      } finally {
        setLoading(false);
      }
    }
    if (activeTab === "pendientes" || activeTab === "todos") fetchPendientes();
  }, [user, obtenerPuntosPorEstado, activeTab]);

  // Carga aceptados
  useEffect(() => {
    async function fetchAceptados() {
      if (!user?.uid) return;
      try {
        setLoading(true);
        const data = await obtenerPuntosPorEstado("aceptado");
        setPuntosAceptados(data);
      } catch (error) {
        console.error("Error al obtener puntos aceptados:", error);
      } finally {
        setLoading(false);
      }
    }
    if (activeTab === "aceptados" || activeTab === "todos") fetchAceptados();
  }, [user, obtenerPuntosPorEstado, activeTab]);

  // Carga negados
  useEffect(() => {
    async function fetchNegados() {
      if (!user?.uid) return;
      try {
        setLoading(true);
        const data = await obtenerPuntosPorEstado("negado");
        setPuntosNegados(data);
      } catch (error) {
        console.error("Error al obtener puntos negados:", error);
      } finally {
        setLoading(false);
      }
    }
    if (activeTab === "negados" || activeTab === "todos") fetchNegados();
  }, [user, obtenerPuntosPorEstado, activeTab]);

  const renderSolicitudes = () => {
    let puntosMostrar: PuntoConViaje[] = [];
    if (activeTab === "todos") {
      puntosMostrar = [...puntosPendientes, ...puntosAceptados, ...puntosNegados];
    } else if (activeTab === "aceptados") {
      puntosMostrar = puntosAceptados;
    } else if (activeTab === "pendientes") {
      puntosMostrar = puntosPendientes;
    } else if (activeTab === "negados") {
      puntosMostrar = puntosNegados;
    }

    if (loading) {
      return <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 20 }} />;
    }

    if (puntosMostrar.length === 0) {
      return <Text style={{ textAlign: "center", marginTop: 20, color: "#999" }}>No hay solicitudes para mostrar</Text>;
    }

    return puntosMostrar.map(({ viajeId, viajeDireccion, punto }, index) => (
      <View key={`${viajeId}-${index}`} style={styles.solicitudCard}>
        <View style={styles.solicitudInfo}>
          <Text style={styles.solicitudTitle}>Viaje: {viajeDireccion || viajeId}</Text>
          <Text style={styles.solicitudPrice}>Estado: {punto.estado}</Text>
          <Text style={styles.solicitudDetails}>Fecha: {punto.fecha || "N/A"}</Text>
          <Text style={styles.solicitudDetails}>Hora: {punto.hora || "N/A"}</Text>
          <Text style={styles.solicitudDetails}>Dirección: {punto.direccion || "N/A"}</Text>
          <Text style={styles.solicitudDetails}>Sector: {punto.sector || "N/A"}</Text>
        </View>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Solicitudes</Text>

      <View style={styles.tabs}>
        {["todos", "aceptados", "pendientes", "negados"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab ? styles.activeTab : null]}
            onPress={() => setActiveTab(tab as any)}
          >
            <Text style={styles.tabText}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.solicitudesList}>
        {renderSolicitudes()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: "600",
    color: "#000",
    marginBottom: 20,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#EAEAEA",
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: "#007BFF",
  },
  tabText: {
    color: "#000",
    fontWeight: "600",
  },
  solicitudCard: {
    backgroundColor: "#F0F8FF",
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
  },
  solicitudInfo: {
    paddingBottom: 10,
  },
  solicitudTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  solicitudPrice: {
    fontSize: 14,
    marginBottom: 5,
  },
  solicitudDetails: {
    fontSize: 12,
    marginBottom: 5,
    color: "#007BFF",
  },
  solicitudesList: {
    paddingBottom: 100,
  },
});
