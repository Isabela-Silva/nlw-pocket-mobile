import { View } from "react-native";

import { Steps } from "@/components/steps";
import { Welcome } from "@/components/welcome";
import { Button } from "@/components/button";
import { IconPills, IconPlus } from "@tabler/icons-react-native";
import { router } from "expo-router";

export default function Index() {
  return (
    <View style={{ flex: 1, padding: 40, gap: 40 }}>
      <Welcome />
      <Steps />
      <Button onPress={() => router.navigate("/home")}>
        <Button.Title> Começar </Button.Title>
        {/* <Button.Icon icon={IconPlus} /> */}
      </Button>
    </View>
  );
}
