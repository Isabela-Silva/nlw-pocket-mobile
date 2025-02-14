import {
  Image,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import { s } from "./styles";
import { IconTicket } from "@tabler/icons-react-native";
import { colors } from "@/styles/colors";
import { useRouter } from "expo-router";

export type PlaceProps = {
  id: string;
  name: string;
  description: string;
  coupons: number;
  cover: string;
  address: string;
};

type Props = TouchableOpacityProps & {
  data: PlaceProps;
};

export function Place({ data, ...rest }: Props) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/market/${data.id}`);
  };

  return (
    <TouchableOpacity style={s.container} {...rest} onPress={handlePress}>
      <Image style={s.image} source={{ uri: data.cover }} />{" "}
      {/* how get this img?*/}
      <View style={s.content}>
        <Text style={s.name}>{data.name}</Text>
        <Text style={s.description} numberOfLines={2}>
          {data.description}
        </Text>

        <View style={s.footer}>
          <IconTicket size={16} color={colors.red.base} />
          <Text style={s.tickets}> {data.coupons}cupons disponíves</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
