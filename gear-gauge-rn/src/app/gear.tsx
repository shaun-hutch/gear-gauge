import { AppText } from "@/components/shared";
import { globalStyles } from "@/styles/globalStyles";
import { View, StyleSheet } from "react-native";

export default function Gear() {
  return (
    <View style={styles.container}>
      <AppText style={globalStyles.headlineMedium}>Gear screen</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});