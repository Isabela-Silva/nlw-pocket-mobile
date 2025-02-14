import { PlaceProps } from "@/components/place";
import { api } from "@/services/api";
import { router, useLocalSearchParams, Redirect } from "expo-router";
import { useEffect, useState, useRef } from "react";
import { Alert, Text, View, Modal, StatusBar, ScrollView } from "react-native";
import { Loading } from "@/components/loading";
import { Cover } from "@/components/market/cover";
import { Details, PropsDetails } from "@/components/market/details";
import { Coupon } from "@/components/market/coupon";
import { Button } from "@/components/button";

import { useCameraPermissions, CameraView } from "expo-camera";

type DataProps = PropsDetails & {
  cover: string;
};
export default function Market() {
  const params = useLocalSearchParams<{ id: string }>();
  const [data, setData] = useState<DataProps>();
  const [loading, setLoading] = useState(true);
  const [coupon, setCoupon] = useState<string | null>(null); // it's store ID of coupon
  const [isVisibleCameraModal, setIsVisibleCameraModal] = useState(false);
  const [couponIsFetching, setCouponIsFetching] = useState(false); //show loading icon when fetching coupon

  const [_, requestPermission] = useCameraPermissions();

  const qrLock = useRef(false);
  console.log(params.id);

  async function FetchMarket() {
    try {
      const { data } = await api.get(`/markets/${params.id}`);
      setData(data);
      setLoading(false); // I thinked it's so better, because we don't need make a structure (data ? <component /> : <Loading />)
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Erro ao buscar dados do mercado", [
        { text: "ok", onPress: () => router.back() },
      ]);
    }
  }

  async function handleOpenCamera() {
    try {
      const { granted } = await requestPermission(); // what's {grantes} ? where it comes from? it's from useCameraPermissions

      if (!granted) {
        return Alert.alert("permissão negada da camera");
      }

      qrLock.current = false; // unlock qrcode
      setIsVisibleCameraModal(true);
    } catch (error) {
      console.log(error);
      Alert.alert("erro ao abri camera");
    }
  }
  // read QRCODE
  async function getCoupon(id: string) {
    try {
      setCouponIsFetching(true);

      const { data } = await api.patch("/coupons/" + id); // request to get coupon in API

      Alert.alert("Cupom", data.coupon);
      setCoupon(data.coupon);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível utilizar o cupom");
    } finally {
      setCouponIsFetching(false);
    }
  }

  function handleUseCoupon(id: string) {
    setIsVisibleCameraModal(false);

    Alert.alert(
      "Cupom",
      "Não é possivel reutilizar o cupom. Deseja realmente resgatar o cupom?",
      [
        { style: "cancel", text: "Cancelar" },
        { text: "Sim", onPress: () => getCoupon(id) },
      ]
    );
  }
  // every time that ID changes, it will call the function FetchMarket
  useEffect(() => {
    FetchMarket();
  }, [params.id, coupon]);

  if (loading) {
    return <Loading />;
  }

  if (!data) {
    return <Redirect href="/home" />;
  }
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" hidden={isVisibleCameraModal} />
      <Cover uri={data.cover} />
      <Details data={data} />
      {coupon && <Coupon code={coupon} />}{" "}
      {/* we need to verify 'cause cupon can be string | null*/}
      <View style={{ padding: 32 }}>
        <Button onPress={handleOpenCamera}>
          <Button.Title>Ler QR Code</Button.Title>
        </Button>
      </View>
      <Modal style={{ flex: 1 }} visible={isVisibleCameraModal}>
        <CameraView
          style={{ flex: 1 }}
          facing="back" //camera of back
          onBarcodeScanned={({ data }) => {
            if (data && !qrLock.current) {
              //verify if data exists and qrcode is not locked
              qrLock.current = true; // if qrcode don't be locked, so we lock it
              setTimeout(() => handleUseCoupon(data), 500); // after 500ms we unlock the qrcode
            }
          }}
        />

        <View style={{ position: "absolute", bottom: 32, right: 32, left: 32 }}>
          <Button
            onPress={() => setIsVisibleCameraModal(false)} // when press button, it will close the camera
            isLoading={couponIsFetching} // show icon "loading" when fetching coupon
          >
            <Button.Title>Voltar</Button.Title>
          </Button>
        </View>
      </Modal>
    </View>
  );
}
