import { HomeGauge } from "@/components/HomeGauge/HomeGauge";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/** Primary gear shown on the home screen with a large gauge. */
export default function Index() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        <HomeGauge value={0} maxValue={500} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
