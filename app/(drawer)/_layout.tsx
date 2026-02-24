import LogoutModalTwo from "@/components/Modals/LogoutModal";
import useAuthStore from "@/components/store/authStore";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { fontFamily } from "@/constants/fonts";
import tw from "@/constants/tailwind";
import { MaterialIcons } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { CarFront, ChevronRight, LogOut } from "lucide-react-native";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

function CustomDrawerContent(props: any) {
  const { user, logout } = useAuthStore();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  return (  
    <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
      {/* Custom Profile Header */}
      <View style={[tw`pt-15 pb-5 bg-[${themeColors.background}]`]}>
        <View style={[tw`flex-row items-center justify-between pr-10`]}>
          <View style={[tw`flex-row items-center gap-4`]}>
            <Image 
                source={require("../../assets/images/pfp.png")}
                style={[tw`h-14 w-14 rounded-full bg-gray-200`]}
            />
            <View>
                <Text style={[tw`text-lg uppercase`, { fontFamily: fontFamily.MontserratEasyBold }]}>
                    {user?.full_name || "Rider Name"}
              </Text>
              <View style={[tw`flex-row items-center gap-1`]}>
                <MaterialIcons name="star" size={
                  17
                } color={"#F9C806"}/>
                <Text style={[tw`text-xs`, {
                  fontFamily: fontFamily.MontserratEasyRegular
                }]}>4.97(270)</Text>
              </View>
            </View>
          </View>
                <TouchableOpacity onPress={() => props.navigation.navigate("profile")}>
                    <ChevronRight/>
                </TouchableOpacity>
        </View>
      </View>

      {/* Drawer Items */}
      <View style={[tw`flex-1 pt-5`]}>
        <DrawerItemList {...props} />
      </View>

      {/* Logout Button */}
      <View style={[tw`px-5 py-8 border-t border-gray-100`]}>
        <TouchableOpacity 
          style={[tw`flex-row items-center gap-3`]}
          onPress={handleLogout}
        >
          <LogOut size={20} color="#FF3B30" />
          <Text style={[tw`text-[#FF3B30] text-sm`, { fontFamily: fontFamily.MontserratEasyMedium }]}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
       <LogoutModalTwo
        visible={logoutModalVisible}
        onClose={() => {
          setLogoutModalVisible(false);
        }}
        onLogout={() => {
          logout();
          router.replace("/login");
        }}
      />
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
        drawerType: "front",
        drawerStyle: {
          backgroundColor: themeColors.background,
        },
        drawerLabelStyle: {
          fontFamily: fontFamily.MontserratEasyRegular,
          fontSize: 13
        },
        drawerActiveTintColor: "black",
        drawerItemStyle: {
          borderRadius: 0,
        },
      }}
    >
       <Drawer.Screen
        name="index"
        options={{
          drawerLabel: "Home",
          title: "Rider Home",
          drawerIcon: ({ color, size }) => <CarFront color={color} size={18} />,
        }}
      />
      
    </Drawer>
  );
}
