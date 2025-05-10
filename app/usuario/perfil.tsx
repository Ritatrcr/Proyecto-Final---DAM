import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import colors from "../../styles/Colors";  // Asegúrate de tener un archivo de colores
import { ArrowRight, LogOutIcon, StarIcon } from '@/components/Icons';
export default function Ajustes() {
  return (
    <View style={styles.container}>

   

      {/* Imagen de perfil y texto debajo */}
      <View style={styles.profileContainer}>
        <Image
          source={require("../../assets/images/defaultUser.png")}  
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>Merchito</Text>
        <Text style={styles.profileRole}>Conductor</Text>
        <View style={styles.starsContainer }>
           
        <StarIcon color={colors.blue} />
            <Text style={{marginLeft:10}}>5.00</Text>
            </View>
      </View>

      {/* Opciones */}

      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>Quiero ser Conductor</Text>
        <ArrowRight color={colors.lightGreyrows} />

      </TouchableOpacity>
        
      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>Editar perfil</Text>
        <ArrowRight color={colors.lightGreyrows} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>Soporte</Text>
        <ArrowRight color={colors.lightGreyrows} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>Terminos y Condiciones</Text>
             <ArrowRight color={colors.lightGreyrows} />
        
      </TouchableOpacity>
    <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>Cerrar sesión</Text>
             <LogOutIcon color={colors.lightGreyrows} />
        
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    
  starsContainer: { 
    flexDirection: 'row',  // Alinea los elementos en fila
    alignItems: 'center',  // Centra verticalmente
    marginBottom: 10,
    justifyContent: 'space-between',
  },

  container: {
    flex: 1,

    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 100,
  },
  header: {
    fontSize: 28,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 30,
    textAlign: 'center',  // Centrado del encabezado
  },
  profileContainer: {
    alignItems: 'center',  // Centra el contenido en el eje horizontal
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 35,  // Hace que la imagen sea circular
    backgroundColor: colors.lightBlue,
    marginBottom: 10, 
    borderWidth:2,
    borderColor:colors.lightGrey // Espacio entre la imagen y los textos
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 5,
  },
  profileRole: {
    fontSize: 14,
    color: colors.grey,
    marginBottom: 15,
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
    flexDirection: 'row',   
    alignContent: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderBottomColor: colors.lightGrey100,
    borderBottomWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
    
    marginBottom: 15,
  },
  optionText: {
    fontSize: 16,
    color: colors.black,
    fontWeight: '500',
  },
  
});
