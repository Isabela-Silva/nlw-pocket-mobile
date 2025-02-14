import { Alert, Text, View } from "react-native";
import { api } from "@/services/api";
import { useEffect, useState } from "react";
import { Categories, CategoriesProps } from "@/components/categories";
import { PlaceProps } from "@/components/place";
import { Places } from "@/components/places";
import MapView, { Callout, Marker } from "react-native-maps";

import * as Location from "expo-location";
import { colors } from "@/styles/colors";
import { fontFamily } from "@/styles/font-family";
import { router } from "expo-router";

type MarketsProps = PlaceProps & {
  latitude: number;
  longitude: number;
};

const currentLocation = {
  latitude: -23.561187293883442,
  longitude: -46.656451388116494,
};

export default function Home() {
  const [categories, setCategories] = useState<CategoriesProps>([]);
  const [category, setCategory] = useState(""); // state that store if element was selected
  const [markets, setMarkets] = useState<MarketsProps[]>([]);

  // const handlePress = (event: CalloutPressEvent) => {
  //   const id = event.nativeEvent.id;
  //   router.push(`/market/${id}`);
  // };

  async function fetchCategories() {
    try {
      const { data } = await api.get("/categories");
      setCategories(data);
      setCategory(data[0].id); //o indice 0 ta selecionado
    } catch (error) {
      console.log(error);
      Alert.alert("erro na categoria");
    }
  }

  async function fetchMarkets() {
    try {
      if (!category) {
        return;
      }
      const { data } = await api.get("/markets/category/" + category); // this '+ category" is like a filter
      setMarkets(data);
      // console.log(data);
    } catch (error) {
      console.log(error);
      Alert.alert("erro em places, locais");
    }
  }

  //deixamos essa function pra pegar a localizacao atual, mas vai ficar comentada
  async function getCurrentLocation() {
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync();

      if (granted) {
        const location = await Location.getCurrentPositionAsync();
        console.log(location);
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    // getCurrentLocation(); //get adress atual
    fetchCategories();
  }, []);
  // essa requisição das categorias são chamadas toda vez que a pagina renderiza

  useEffect(() => {
    console.log("categoria selecionada", category);
    fetchMarkets();
  }, [category]);

  return (
    <View
      style={{
        flex: 1,
        // alignItems: "center",
        // justifyContent: "center",
        backgroundColor: "#cecece",
      }}
    >
      <Categories
        data={categories}
        onSelect={setCategory}
        selected={category}
      />
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          identifier="current"
          coordinate={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          }}
          image={require("@/assets/location.png")}
        />

        {/*  aqui os marcadores (red icons) vão ser renderizados de acordo com os markets (os
      lugares) que existem  */}

        {markets.map((item) => (
          <Marker
            key={item.id}
            identifier={item.id}
            coordinate={{ latitude: item.latitude, longitude: item.longitude }}
            image={require("@/assets/pin.png")}
          >
            <Callout
              onPress={() => router.navigate(`/market/${item.id}`)}
              style={{ width: 500, height: 200 }}
            >
              <View
                style={{
                  // width: 500,
                  padding: 10,
                  backgroundColor: "white",
                  borderRadius: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.gray[600],
                    fontFamily: fontFamily.medium,
                  }}
                >
                  {item.name}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.gray[600],
                    fontFamily: fontFamily.regular,
                  }}
                >
                  {item.address}
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <Places data={markets} />
    </View>
  );
}
