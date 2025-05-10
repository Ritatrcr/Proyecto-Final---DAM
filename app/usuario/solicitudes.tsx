import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import colors from "../../styles/Colors";  // Asegúrate de tener un archivo de colores

export default function Ajustes() {
  return (
    <View style={styles.container}>

      {/* Encabezado */}
      <Text style={styles.header}>Ajustes</Text>

      {/* Imagen de perfil */}
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }} // Puedes poner la URL de la imagen del perfil aquí
          style={styles.profileImage}
        />
        <View style={styles.profileText}>
          <Text style={styles.profileName}>Merchito</Text>
          <Text style={styles.profileRole}>Conductor</Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>✏️</Text>
        </TouchableOpacity>
      </View>

      {/* Opciones */}
      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>Quiero ser usuario</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>Editar datos de mi vehículo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>Configuración</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 30,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,  // Hace que la imagen sea circular
    backgroundColor: colors.lightBlue,
    marginRight: 20,
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.black,
  },
  profileRole: {
    fontSize: 14,
    color: colors.grey,
  },
  editButton: {
    backgroundColor: colors.blue,
    borderRadius: 20,
    padding: 10,
  },
  editButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  option: {
    backgroundColor: colors.lightBlue,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  optionText: {
    fontSize: 16,
    color: colors.black,
    fontWeight: '500',
  },
});
