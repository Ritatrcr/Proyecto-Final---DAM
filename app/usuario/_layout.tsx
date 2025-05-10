import { AuthProvider } from "@/context/authContext/AuthContext";
import { Tabs } from "expo-router";
import { HomeIcon, UserIcon, ActivityIcon, HistoryIcon } from "../../components/Icons";
import colors from "../../styles/Colors";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import React from "react";

export default function Tabslayout() {
  return (
    <AuthProvider>
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen
          name="index"
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ focused }) => (
              <HomeIcon color={focused ? "black" : colors.grey} />
            ),
            tabBarLabelStyle: {
              fontSize: 14,
              
             
            },
            tabBarActiveTintColor: "black",
            tabBarInactiveTintColor: colors.grey,
            tabBarIconStyle: styles.tabBarIconStyle,
            tabBarStyle: styles.tabBarStyle,
          }}
        />
        
        <Tabs.Screen
          name="solicitudes"
          options={{
            tabBarLabel: "Solicitudes",
            tabBarIcon: ({ focused }) => (
              <ActivityIcon color={focused ? "black" : colors.grey} />
            ),
            tabBarLabelStyle: {
              fontSize: 14,
             
            },
            tabBarActiveTintColor: "black",
            tabBarInactiveTintColor: colors.grey,
            tabBarIconStyle: styles.tabBarIconStyle,
            tabBarStyle: styles.tabBarStyle,
          }}
        />

        <Tabs.Screen
          name="miViaje"
          options={{
            tabBarLabel: "",
            tabBarIcon: ({ focused }) => (
              <View style={styles.iconContainer}>
                <Text style={[styles.textStyle, { color: focused ? "black" : "white" }]}>
                  Mi{'\n'}Viaje
                </Text>
              </View>
            ),
            tabBarLabelStyle: {
              fontSize: 14,
           
            },
        
            
            tabBarIconStyle: styles.tabBarIconStyle,
            tabBarStyle: styles.tabBarStyle,
          }}
        />

        <Tabs.Screen
          name="historial"
          options={{
            tabBarLabel: "Historial",
            tabBarIcon: ({ focused }) => (
              <HistoryIcon color={focused ? "black" : colors.grey} />
            ),
            tabBarLabelStyle: {
              fontSize: 14,
              
            },
            tabBarActiveTintColor: "black",
            tabBarInactiveTintColor: colors.grey,
            tabBarIconStyle: styles.tabBarIconStyle,
            tabBarStyle: styles.tabBarStyle,
          }}
        />
        
        <Tabs.Screen
          name="perfil"
          options={{
            tabBarLabel: "Perfil",
            tabBarIcon: ({ focused }) => (
              <UserIcon color={focused ? "black" : colors.grey} />
            ),
            tabBarLabelStyle: {
              fontSize: 14,
            
            },
            tabBarActiveTintColor: "black",
            tabBarInactiveTintColor: colors.grey,
            tabBarIconStyle: styles.tabBarIconStyle,
            tabBarStyle: styles.tabBarStyle,
          }}
        />
      </Tabs>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 70, 
    height: 70, 
    borderRadius: 35,  
    backgroundColor: colors.blue, 
    borderColor: colors.darkGrey,  
    borderWidth: 2,  
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  textStyle: {
    textAlign: 'center',  
    fontSize: 16,     
    
  },
  tabBarIconStyle: {
    fontSize: 30,          
  },
  tabBarStyle: {
    height: 80,           
    paddingTop: 10,        
    paddingBottom: 10,     
  },
});
