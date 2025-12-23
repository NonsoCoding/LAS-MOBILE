import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

function CustomDrawerContent(props: any) {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];
  return (
    <DrawerContentScrollView
      contentContainerStyle={{
        flex: 1,
      }}
      {...props}
    >
      <View style={styles.closeButtonContainer}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => props.navigation.closeDrawer()}
        >
          <Ionicons name="close" size={28} color={themeColors.tint} />
        </TouchableOpacity>
      </View>
      <View style={styles.drawerItemsContainer}>
        <DrawerItemList {...props} />
      </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: themeColors.primaryColor,
          width: "100%",
        },
        drawerLabelStyle: {
          textAlign: "center",
          color: "white",
          fontWeight: "600",
          marginLeft: 20,
        },
        drawerActiveTintColor: "white",
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: "Home",
          title: "Rider Home",
        }}
      />
      <Drawer.Screen
        name="NewOrders"
        options={{
          drawerLabel: "New Orders",
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  closeButtonContainer: {
    alignItems: "flex-start",
    padding: 16,
    paddingTop: 5,
  },
  closeButton: {
    padding: 8,
    backgroundColor: "white",
    borderRadius: 30,
  },
  drawerItemsContainer: {
    marginTop: 100,
    width: 200,
    alignSelf: "center",
  },
});
