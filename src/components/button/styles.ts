import { StyleSheet } from "react-native";

import { colors, fontFamily } from "@/styles/theme";

export const s = StyleSheet.create({
  container: {
    backgroundColor: colors.green.base,
    // paddingHorizontal: 115,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    flexDirection: "row",
  },
  title: {
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
    color: colors.gray[100],
  },
});
