import { StyleSheet, View } from "react-native";
import { useGearContext } from "@/context/GearProvider";
import { spacing } from "@/styles/theme";
import { GearListItem } from "../GearListItem/GearListItem";

export function GearList() {
  const { gear, isLoading } = useGearContext();

  return (
    <View style={styles.container}>
      {!isLoading &&
        gear.map((item) => (
          <GearListItem
            key={item.id}
            name={item.name}
            currentDistance={item.currentDistance}
            maxDistance={item.maxDistance}
            type={item.type}
            isPrimary={item.isPrimary}
            onPress={() => {
              console.log(`Pressed ${item.name}`);
            }}
          />
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
});

