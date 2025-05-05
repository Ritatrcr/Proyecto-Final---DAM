import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  Image 
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/authContext/AuthContext";
import { MaterialIcons } from "@expo/vector-icons"; 
import Loader from "../../components/Loader"; // Asegúrate de tener un componente Loader
import colors from "../../styles/Colors"; // Importa los colores

const AuthScreen = () => {
  const router = useRouter();
  const { login, register, userRole } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [focusedInput, setFocusedInput] = useState(null);
  const [errorMessage, setErrorMessage] = useState<{ email?: string, password?: string, name?: string }>({});
  const [showPassword, setShowPassword] = useState(false); 

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAuth = async () => {
    let errors: { email?: string; password?: string; name?: string } = {};

    if (!email) {
      errors.email = "El correo es obligatorio.";
    } else if (!validateEmail(email)) {
      errors.email = "Formato de email inválido.";
    }

    if (!password) {
      errors.password = "La contraseña es obligatoria.";
    } else if (password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres.";
    }

    if (!isLogin && !name) {
      errors.name = "El nombre es obligatorio.";
    }

    setErrorMessage(errors);
    
    if (Object.keys(errors).length > 0) return;

    try {
      if (isLogin) {
        await login(email, password);
        Alert.alert("Éxito", "Usuario ingresado correctamente.");
      } else {
        await register(email, password, name);
        Alert.alert("Éxito", "Usuario creado exitosamente.");
      }

      // Redirigir según el rol del usuario
      if (userRole === "driver") {
        router.push("/");
      } else if (userRole === "user") {
        router.push("/");
      }
      
    } catch (error: any) {
      Alert.alert("Error", getErrorMessage(error.code));
    }
  };

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "auth/invalid-email":
        return "Formato de email inválido.";
      case "auth/user-not-found":
        return "Usuario no encontrado.";
      case "auth/wrong-password":
        return "Contraseña incorrecta.";
      case "auth/email-already-in-use":
        return "Este email ya está registrado.";
      case "auth/weak-password":
        return "La contraseña debe tener al menos 6 caracteres.";
      default:
        return "Ocurrió un error. Inténtalo de nuevo.";
    }
  };

  return (
    <View style={styles.container}>
      <Loader />

      <Text style={styles.greeting}>{isLogin ? "Inicia Sesión" : "Crea tu cuenta"}</Text>

      {!isLogin && (
        <>
          <TextInput
            style={[
              styles.input,
              focusedInput === "name" && styles.inputFocused,
              errorMessage.name && styles.inputError
            ]}
            placeholder="Nombre"
            placeholderTextColor={colors.blue} // Usa el azul
            value={name}
            onChangeText={setName}
            onBlur={() => setFocusedInput(null)}
          />
          {errorMessage.name && <Text style={styles.errorText}>{errorMessage.name}</Text>}
        </>
      )}

      <TextInput
        style={[
          styles.input,
          focusedInput === "email" && styles.inputFocused,
          errorMessage.email && styles.inputError
        ]}
        placeholder="Correo electrónico"
        placeholderTextColor={colors.blue} // Usa el azul
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        onBlur={() => setFocusedInput(null)}
      />
      {errorMessage.email && <Text style={styles.errorText}>{errorMessage.email}</Text>}

      <View style={styles.passwordContainer}>
        <TextInput
          style={[
            styles.input,
            focusedInput === "password" && styles.inputFocused,
            errorMessage.password && styles.inputError
          ]}
          placeholder="Contraseña"
          placeholderTextColor={colors.blue} // Usa el azul
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          onBlur={() => setFocusedInput(null)}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <MaterialIcons name={showPassword ? "visibility-off" : "visibility"} size={24} color={colors.blue} />
        </TouchableOpacity>
      </View>
      {errorMessage.password && <Text style={styles.errorText}>{errorMessage.password}</Text>}

      {/* Aquí agregamos el enlace "¿Olvidaste tu contraseña?" */}
      {isLogin && (
        <View style={styles.forgotPasswordContainer}>
          <TouchableOpacity>
            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.mainButton} onPress={handleAuth}>
        <Text style={styles.mainButtonText}>{isLogin ? "Entrar" : "Registrarme"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.toggleContainer} onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.toggleText}>
          {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
          <Text style={styles.toggleTextHighlight}>{isLogin ? "Regístrate" : "Inicia sesión"}</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white, // Usa el blanco
  },
  greeting: {
    fontSize: 28,
    fontWeight: "600",
    color: colors.blue, // Usa el negro
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "400",
    color: colors.black, // Usa el negro
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 10,
    color: colors.blue, // Usa el negro
    borderWidth: 1,
    borderColor: "#EAEAEA", // Color del borde por defecto
  },
  inputFocused: {
    borderColor: colors.blue, // El borde se pone azul cuando el campo está enfocado
    borderWidth: 2,
  },
  inputError: {
    borderColor: "red",
    borderWidth: 2,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  mainButton: {
    backgroundColor: colors.blue, // Usa el negro
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
  },
  mainButtonText: {
    color: colors.white, // Usa el blanco
    fontSize: 16,
    fontWeight: "600",
  },
  toggleContainer: {
    marginTop: 24,
  },
  toggleText: {
    color: colors.black, // Usa el negro
    fontSize: 14,
  },
  toggleTextHighlight: {
    color: colors.blue, // Usa el azul
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  passwordContainer: {
    position: "relative",
    width: "100%",
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    top: 16,
  },
  // Nuevo contenedor para el enlace "¿Olvidaste tu contraseña?"
  forgotPasswordContainer: {
    width: "100%", // Asegura que ocupe el 100% del ancho disponible
    alignItems: "flex-start", // Alinea todo lo que esté dentro al inicio (izquierda)
    marginBottom: 10,
  },
  forgotPasswordText: {
    color: colors.blue, // Usa el azul
    fontSize: 14,
    marginTop: 10,
    marginBottom: 20,
  },
});
