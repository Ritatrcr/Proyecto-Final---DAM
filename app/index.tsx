import { Redirect } from "expo-router";
import { Text, View } from "react-native";
import Colors from "../styles/Colors";

export default function Index() {
  return (
    <Redirect href="./auth" />
  );
}
