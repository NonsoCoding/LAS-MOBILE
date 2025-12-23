import LogoutModal from "@/components/Modals/CenterModal";
import useAuthStore from "@/components/store/authStore";
import Colors from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { AlignCenter } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import tw from "twrnc";

const ProfileScreen = () => {
  const [isOnline, setIsOnline] = useState(false);
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];
  const navigation = useNavigation();
  const { user, fetchUserProfile, isAuthenticated } = useAuthStore();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProfile().catch(console.error);
    }
  }, [isAuthenticated]);

  const MenuItem = ({ icon, title, color = "#000" }: any) => (
    <TouchableOpacity
      style={tw`flex-row items-center justify-between py-4 px-5 border-b border-gray-100`}
    >
      <View style={tw`flex-row items-center`}>
        <Text style={tw`text-xl mr-3`}>{icon}</Text>
        <Text style={tw`text-base font-medium`}>{title}</Text>
      </View>
      <Text style={tw`text-2xl text-gray-300`}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        tw`flex-1 bg-blue-500`,
        {
          backgroundColor: themeColors.primaryColor,
        },
      ]}
    >
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={tw`flex-row justify-between items-center px-6 pt-15 pb-10`}>
        <TouchableOpacity
          style={[
            tw`p-2.5 rounded-full self-start`,
            {
              backgroundColor: themeColors.tintLight,
            },
          ]}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <AlignCenter color={"white"} />
        </TouchableOpacity>

        <View
          style={[
            tw`px-3.5 flex-row items-center gap-2 py-1 rounded-full`,
            {
              backgroundColor: themeColors.tintLight,
            },
          ]}
        >
          <Text style={[tw`text-white text-xs`]}>
            {" "}
            {isOnline ? "ONLINE" : "OFFLINE"}
          </Text>
          <FontAwesome name="circle" size={14} color={"white"} />
        </View>
      </View>

      {/* Profile Info */}
      <View style={[tw`px-6 pb-0 flex-row items-center justify-between`, {}]}>
        <View>
          <Text style={tw`text-4xl font-bold text-white mb-1`}>
            {user?.full_name}
          </Text>
          <Text style={tw`text-base text-white/80 mb-5`}>
            Manage your profile
          </Text>
        </View>

        <View
          style={[
            tw`flex-row rounded-2xl p-1.5`,
            {
              backgroundColor: themeColors.tintLight,
            },
          ]}
        >
          <TouchableOpacity
            style={tw`px-2 py-1 rounded-2xl ${!isOnline ? "bg-white" : ""}`}
            onPress={() => setIsOnline(false)}
          >
            <Text
              style={tw`text-sm font-light text-xs ${
                !isOnline ? "text-[#CC1A21]" : "text-white"
              }`}
            >
              OFF
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`px-2.5 py-1 rounded-2xl ${isOnline ? "bg-white" : ""}`}
            onPress={() => setIsOnline(true)}
          >
            <Text
              style={tw`text-xs font-light ${
                isOnline ? "text-[#CC1A21]" : "text-white"
              }`}
            >
              ON
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={tw`flex-1 bg-gray-100 rounded-t-3xl`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`p-6`}
      >
        {/* Profile Card */}
        <View style={tw`bg-white rounded-2xl p-6 mb-4 shadow-sm`}>
          <View style={tw`items-center mb-4`}>
            <View
              style={tw`w-20 h-20 rounded-full bg-blue-100 justify-center items-center`}
            >
              <Text style={tw`text-3xl font-bold text-blue-500`}>K</Text>
            </View>
          </View>

          <View style={tw`items-center mb-5`}>
            <Text style={tw`text-2xl font-bold text-gray-900 mb-1`}>
              {user?.full_name}
            </Text>
            <Text style={tw`text-sm text-gray-600 mb-0.5`}>{user?.email}</Text>
            <Text style={tw`text-sm text-gray-600`}>
              +234 {user?.phone_number}
            </Text>
          </View>

          <TouchableOpacity
            style={tw`bg-blue-100 py-3 rounded-xl items-center`}
          >
            <Text style={tw`text-sm font-semibold text-blue-500`}>
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats Card */}
        <View
          style={tw`bg-white rounded-2xl p-6 mb-4 flex-row justify-between shadow-sm`}
        >
          <View style={tw`flex-1 items-center`}>
            <Text style={tw`text-3xl font-bold text-gray-900 mb-1`}>247</Text>
            <Text style={tw`text-xs text-gray-600`}>Deliveries</Text>
          </View>
          <View style={tw`w-px bg-gray-200 mx-2`} />
          <View style={tw`flex-1 items-center`}>
            <Text style={tw`text-3xl font-bold text-gray-900 mb-1`}>4.9</Text>
            <Text style={tw`text-xs text-gray-600`}>Rating</Text>
          </View>
          <View style={tw`w-px bg-gray-200 mx-2`} />
          <View style={tw`flex-1 items-center`}>
            <Text style={tw`text-3xl font-bold text-gray-900 mb-1`}>98%</Text>
            <Text style={tw`text-xs text-gray-600`}>Success Rate</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={tw`bg-white rounded-2xl overflow-hidden shadow-sm`}>
          <MenuItem icon="" title="Settings" />
          <MenuItem icon="" title="Notifications" />
          <MenuItem icon="" title="Privacy & Security" />
          <MenuItem icon="" title="Help & Support" />
          <MenuItem icon="" title="Earnings Report" />
          <TouchableOpacity
            onPress={() => {
              setLogoutModalVisible(true);
            }}
            style={tw`flex-row items-center justify-between py-4 px-5`}
          >
            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-xl mr-3`}></Text>
              <Text style={tw`text-base font-medium text-red-500`}>Logout</Text>
            </View>
            <Text style={tw`text-2xl text-gray-300`}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={tw`h-5`} />
      </ScrollView>
      <LogoutModal
        title="Logout"
        titleSubInfo="Are you sure you want to logout from your account"
        onClose={() => {
          setLogoutModalVisible(false);
        }}
        visible={logoutModalVisible}
      />
    </View>
  );
};

export default ProfileScreen;
