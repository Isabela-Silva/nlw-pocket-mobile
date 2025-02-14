import { FlatList, Text, View } from "react-native";
import { Category } from "../category";
import { s } from "./styles";

//  categoriesProps it's export because we use in other components
export type CategoriesProps = {
  id: string;
  name: string;
}[]; // it's props will be a array [ ] because it's a list of categories

type Props = {
  data: CategoriesProps;
  selected: string;
  onSelect: (id: string) => void;
};

export function Categories({ data, onSelect, selected }: Props) {
  return (
    <View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id} // Define a chave única para cada item
        renderItem={({ item }) => (
          <Category
            name={item.name}
            iconId={item.id}
            onPress={() => onSelect(item.id)}
            // ao tocar na categoria, o onSelected vai guardar o id
            isSelected={item.id === selected}
          /> // Renderiza o componente Category
        )}
        horizontal
        contentContainerStyle={s.content}
        style={s.container}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}
