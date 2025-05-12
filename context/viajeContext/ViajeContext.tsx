import React, { createContext, useState, useContext, useEffect } from "react";
import { db } from "../../utils/FirebaseConfig";
import { doc, setDoc, getDoc, updateDoc, deleteDoc, collection, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Interfaz para el viaje
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

// Interfaz para el contexto de viajes
interface ViajesContextProps {
  viajes: Viaje[];
  agregarViaje: (nuevoViaje: Viaje) => Promise<void>;
  editarViaje: (usuarioId: string, viajeId: string, datosActualizados: Partial<Viaje>) => Promise<void>;
  eliminarViaje: (usuarioId: string, viajeId: string) => Promise<void>;
  obtenerViajePorId: (usuarioId: string, viajeId: string) => Promise<Viaje | null>;
  obtenerTodosLosViajes: () => Promise<void>; // Método para obtener todos los viajes de todas las personas
  obtenerViajesPorEstado: (estado: string) => Promise<void>; // Obtener viajes de la persona logueada por estado
  obtenerPuntosPendientes: () => Promise<void>; // Obtener puntos pendientes de los viajes creados por la persona
  obtenerTodosLosViajesDeUnaPersona: () => Promise<void>; // Método para obtener todos los viajes de un usuario específico
}

// Crear el contexto
const ViajesContext = createContext<ViajesContextProps>({} as ViajesContextProps);

// Custom hook para usar el contexto
export const useViajes = () => useContext(ViajesContext);

// Proveedor del contexto de viajes
export const ViajesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viajes, setViajes] = useState<Viaje[]>([]);

  // Obtener el usuario logueado
  const obtenerUsuarioId = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    return user ? user.uid : null; // Si no hay usuario logueado, retornamos null
  };

  // Función para agregar un nuevo viaje
  const agregarViaje = async (nuevoViaje: Viaje) => {
    try {
      const usuarioId = obtenerUsuarioId();
      if (!usuarioId) {
        console.error("No hay usuario logueado");
        return;
      }

      const usuarioRef = doc(db, "viajes creados", usuarioId);
      
      // Obtener los viajes del usuario
      const viajesSnapshot = await getDocs(collection(usuarioRef, "viajes"));
      const viajesData = viajesSnapshot.docs.map((doc) => doc.data());
      
      // Determinar el número de viaje (viaje 1, viaje 2, etc.)
      const numeroViaje = viajesData.length + 1;

      // Crear un nuevo viaje con el nombre del viaje incrementado
      const viajeRef = doc(collection(usuarioRef, "viajes"), `viaje ${numeroViaje}`);
      
      // Guardar el nuevo viaje
      await setDoc(viajeRef, nuevoViaje);

      // Actualizar el estado local con el nuevo viaje
      setViajes((prevViajes) => [...prevViajes, nuevoViaje]);
    } catch (error) {
      console.error("Error al agregar el viaje:", error);
    }
  };

  // Función para editar un viaje existente
  const editarViaje = async (usuarioId: string, viajeId: string, datosActualizados: Partial<Viaje>) => {
    try {
      const viajeRef = doc(db, "viajes creados", usuarioId, "viajes", viajeId);
      await updateDoc(viajeRef, datosActualizados);
      setViajes((prevViajes) =>
        prevViajes.map((viaje) =>
          viaje.id === viajeId ? { ...viaje, ...datosActualizados } : viaje
        )
      );
    } catch (error) {
      console.error("Error al editar el viaje:", error);
    }
  };

  // Función para eliminar un viaje
  const eliminarViaje = async (usuarioId: string, viajeId: string) => {
    try {
      const viajeRef = doc(db, "viajes creados", usuarioId, "viajes", viajeId);
      await deleteDoc(viajeRef);
      setViajes((prevViajes) => prevViajes.filter((viaje) => viaje.id !== viajeId));
    } catch (error) {
      console.error("Error al eliminar el viaje:", error);
    }
  };

  // Cargar los viajes del usuario logueado al montar el componente
  useEffect(() => {
    const cargarViajes = async () => {
      const usuarioId = obtenerUsuarioId();
      if (!usuarioId) {
        console.log("No hay usuario logueado");
        return;
      }

      const viajesSnapshot = await getDocs(collection(db, "viajes creados", usuarioId, "viajes"));
      const viajesData = viajesSnapshot.docs.map((doc) => doc.data() as Viaje);

      // Imprimir los viajes en la consola
      console.log("Viajes del usuario:", viajesData);

      setViajes(viajesData);
    };

    cargarViajes();
  }, []); // Se ejecuta solo una vez cuando el componente se monta

  // Método para obtener todos los viajes de todas las personas
  const obtenerTodosLosViajes = async () => {
    try {
      const viajesSnapshot = await getDocs(collection(db, "viajes creados"));
      const viajesData = viajesSnapshot.docs.map((doc) => doc.data() as Viaje);
      console.log("Todos los viajes:", viajesData);
      setViajes(viajesData);
    } catch (error) {
      console.error("Error al obtener todos los viajes:", error);
    }
  };

  // Método para obtener los viajes de la persona logueada por estado
  const obtenerViajesPorEstado = async (estado: string) => {
    const usuarioId = obtenerUsuarioId();
    if (!usuarioId) {
      console.log("No hay usuario logueado");
      return;
    }

    try {
      const viajesQuery = query(
        collection(db, "viajes creados", usuarioId, "viajes"),
        where("estado", "==", estado)
      );
      const viajesSnapshot = await getDocs(viajesQuery);
      const viajesData = viajesSnapshot.docs.map((doc) => doc.data() as Viaje);
      console.log(`Viajes con estado "${estado}":`, viajesData);
      setViajes(viajesData);
    } catch (error) {
      console.error("Error al obtener los viajes por estado:", error);
    }
  };

  // Método para obtener los puntos pendientes de los viajes creados por la persona
  const obtenerPuntosPendientes = async () => {
    const usuarioId = obtenerUsuarioId();
    if (!usuarioId) {
      console.log("No hay usuario logueado");
      return;
    }

    try {
      const viajesQuery = query(
        collection(db, "viajes creados", usuarioId, "viajes"),
        where("estado", "==", "por iniciar")
      );
      const viajesSnapshot = await getDocs(viajesQuery);
      const viajesData = viajesSnapshot.docs.map((doc) => doc.data() as Viaje);
      const puntosPendientes = viajesData.flatMap((viaje) => viaje.puntos);
      console.log("Puntos pendientes:", puntosPendientes);
    } catch (error) {
      console.error("Error al obtener los puntos pendientes:", error);
    }
  };

  // Método para obtener todos los viajes de un usuario específico
  const obtenerTodosLosViajesDeUnaPersona = async () => {
    const usuarioId = obtenerUsuarioId();
    if (!usuarioId) {
      console.log("No hay usuario logueado");
      return;
    }

    try {
      const viajesSnapshot = await getDocs(collection(db, "viajes creados", usuarioId, "viajes"));
      const viajesData = viajesSnapshot.docs.map((doc) => doc.data() as Viaje);
      console.log("Viajes del usuario:", viajesData);
      setViajes(viajesData);
    } catch (error) {
      console.error("Error al obtener los viajes del usuario:", error);
    }
  };

  // Método para obtener un viaje por su ID
  const obtenerViajePorId = async (usuarioId: string, viajeId: string): Promise<Viaje | null> => {
    try {
      const viajeRef = doc(db, "viajes creados", usuarioId, "viajes", viajeId);
      const viajeSnapshot = await getDoc(viajeRef);
      if (viajeSnapshot.exists()) {
        return viajeSnapshot.data() as Viaje;
      } else {
        console.log("No se encontró el viaje con el ID proporcionado.");
        return null;
      }
    } catch (error) {
      console.error("Error al obtener el viaje por ID:", error);
      return null;
    }
  };

  return (
    <ViajesContext.Provider
      value={{
        viajes,
        agregarViaje,
        editarViaje,
        eliminarViaje,
        obtenerViajePorId,
        obtenerTodosLosViajes,
        obtenerViajesPorEstado,
        obtenerPuntosPendientes,
        obtenerTodosLosViajesDeUnaPersona,
      }}
    >
      {children}
    </ViajesContext.Provider>
  );
};
