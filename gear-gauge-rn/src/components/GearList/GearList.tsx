import { useGearContext } from "@/context/GearProvider";
import { GearListItem } from "../GearListItem/GearListItem";


export function GearList() {

  const { gear, isLoading } = useGearContext();

  return (
    <>
      {!isLoading && (
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
          ))
      )}
    </>
  );
};

