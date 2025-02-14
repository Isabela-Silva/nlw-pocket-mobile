import { StyleSheet } from "react-native";

export const s = StyleSheet.create({
  container: {
    maxHeight: 50,
    position: "absolute", //it wasn't working, but now it does. I'm so happy for it
    zIndex: 1,
    top: 3,
    // marginTop: 12,
  },
  content: {
    gap: 8,
    paddingHorizontal: 16,
  },
});
