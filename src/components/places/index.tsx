import { View, Text, useWindowDimensions } from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";

import { Place, PlaceProps } from "../place";
import { useRef } from "react";
import { s } from "./styles";

type Props = {
  data: PlaceProps[]; // placeProps from place component, it's very curious
};

export function Places({ data }: Props) {
  const dimensions = useWindowDimensions();
  const BottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = {
    min: 278,
    max: dimensions.height - 128, //this 128 was teacher that chose, so don't a obrigatorio number
  };
  return (
    <BottomSheet
      ref={BottomSheetRef}
      snapPoints={[snapPoints.min, snapPoints.max]}
      handleIndicatorStyle={s.indicator} //for barrinha to look nice
      backgroundStyle={s.container} //style of background
      enableOverDrag={false}
    >
      <BottomSheetFlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Place data={item} />}
        contentContainerStyle={s.content}
        ListHeaderComponent={() => (
          <Text style={s.title}>Explore locais perto de você</Text>
        )}
        showsVerticalScrollIndicator={false}
      />
    </BottomSheet>
  );
}
