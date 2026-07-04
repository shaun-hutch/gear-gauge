import { AppText } from "@/components/AppText/AppText";
import { globalStyles } from "@/styles/globalStyles";
import { View, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <AppText style={globalStyles.headlineMedium}>Edit src/app/index.tsx to edit this screen.</AppText>
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
