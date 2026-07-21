import { AppText } from "@/components/shared";
import { globalStyles } from "@/styles/globalStyles";
import { View, StyleSheet } from "react-native";

export default function Settings() {
  return (
    <View style={styles.container}>
      <AppText style={globalStyles.headlineMedium}>Settings screen</AppText>
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