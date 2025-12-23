import Colors from "@/constants/Colors";
import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { AlignCenter } from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import tw from "twrnc";

const WalletScreen = () => {
  const [isOnline, setIsOnline] = useState(false);
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];
  const navigation = useNavigation();

  const Transaction = ({ type, title, subtitle, amount, date }: any) => (
    <View
      style={tw`flex-row justify-between items-center py-3 border-b border-gray-100`}
    >
      <View style={tw`flex-row items-center flex-1`}>
        <View
          style={tw`w-10 h-10 rounded-xl justify-center items-center mr-3 ${
            type === "credit" ? "bg-green-100" : "bg-red-100"
          }`}
        >
          <Text style={tw`text-xl text-gray-900`}>
            {type === "credit" ? "↓" : "↑"}
          </Text>
        </View>
        <View style={tw`flex-1`}>
          <Text style={tw`text-sm font-semibold text-gray-900 mb-0.5`}>
            {title}
          </Text>
          <Text style={tw`text-xs text-gray-600 mb-0.5`}>{subtitle}</Text>
          <Text style={tw`text-xs text-gray-400`}>{date}</Text>
        </View>
      </View>
      <Text
        style={tw`text-base font-bold ml-3 ${
          type === "credit" ? "text-green-600" : "text-red-500"
        }`}
      >
        {amount}
      </Text>
    </View>
  );

  return (
    <View
      style={[
        tw`flex-1`,
        {
          backgroundColor: themeColors.primaryColor,
        },
      ]}
    >
      <StatusBar barStyle="light-content" />

      <View
        style={[
          tw`flex-row items-center pt-15 px-6 pb-5 gap-3 justify-between`,
          {},
        ]}
      >
        <View style={[tw`flex-row  gap-3 items-center`]}>
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
        </View>
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

      {/* Wallet Header */}
      <View style={tw`px-6 pb-6`}>
        <Text style={tw`text-3xl font-bold text-white mb-1`}>My Wallet</Text>
        <Text style={tw`text-base text-white/80`}>Track your earnings</Text>
      </View>

      {/* Content */}
      <ScrollView
        style={tw`flex-1 bg-gray-100 rounded-t-3xl`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`p-6`}
      >
        {/* Balance Card */}
        <View style={tw`bg-white rounded-2xl p-6 mb-4 shadow-sm`}>
          <Text style={tw`text-sm text-gray-600 mb-2`}>Available Balance</Text>
          <Text style={tw`text-4xl font-bold text-gray-900 mb-6`}>
            ₦45,280.00
          </Text>

          <View style={tw`flex-row gap-3`}>
            <TouchableOpacity
              style={[
                tw`flex-1 flex-row items-center justify-center py-2 rounded-xl`,
                {
                  backgroundColor: themeColors.primaryColor,
                },
              ]}
            >
              <Text style={tw`text-lg text-white mr-2`}>↗</Text>
              <Text style={tw`text-md font-semibold text-white`}>Withdraw</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                tw`flex-1 flex-row items-center justify-center py-2 rounded-xl`,
                {
                  backgroundColor: themeColors.tintLight,
                },
              ]}
            >
              <Text
                style={[
                  tw`text-lg mr-2 bottom-0.4`,
                  {
                    color: themeColors.primaryColor,
                  },
                ]}
              >
                +
              </Text>
              <Text
                style={[
                  tw`text-md font-semibold `,
                  {
                    color: themeColors.primaryColor,
                  },
                ]}
              >
                Add Card
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Quick Stats */}
        <View style={tw`flex-row gap-3 mb-4`}>
          <View
            style={tw`flex-1 bg-white rounded-2xl p-4 flex-row items-center shadow-sm`}
          >
            <View
              style={[
                tw`w-10 h-10 rounded-xl justify-center items-center mr-3`,
                {
                  backgroundColor: themeColors.tintLight,
                },
              ]}
            >
              <Ionicons
                name="bar-chart-sharp"
                color={themeColors.primaryColor}
                size={20}
              />
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-lg font-bold text-gray-900 mb-0.5`}>
                +₦12,450
              </Text>
              <Text style={tw`text-xs text-gray-600`}>This Week</Text>
            </View>
          </View>

          <View
            style={tw`flex-1 bg-white rounded-2xl p-4 flex-row items-center shadow-sm`}
          >
            <View
              style={tw`w-10 h-10 bg-green-50 rounded-xl justify-center items-center mr-3`}
            >
              <View
                style={[
                  tw`w-10 h-10 rounded-xl justify-center items-center mr-3`,
                  {
                    backgroundColor: themeColors.tintLight,
                  },
                ]}
              >
                <Entypo name="pin" color={themeColors.primaryColor} size={20} />
              </View>
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-lg font-bold text-gray-900 mb-0.5`}>
                ₦89,200
              </Text>
              <Text style={tw`text-xs text-gray-600`}>This Month</Text>
            </View>
          </View>
        </View>
        {/* Transactions */}
        <View style={tw`bg-white rounded-2xl p-5 mb-4 shadow-sm`}>
          <View style={tw`flex-row justify-between items-center mb-5`}>
            <Text style={tw`text-lg font-bold text-gray-900`}>
              Recent Transactions
            </Text>
            <TouchableOpacity>
              <Text style={tw`text-sm font-semibold text-blue-500`}>
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <Transaction
            type="credit"
            title="Delivery Payment"
            subtitle="Johnson Chike • Order #1234"
            amount="+₦2,500"
            date="Today, 02:45 PM"
          />
          <Transaction
            type="credit"
            title="Delivery Payment"
            subtitle="Sarah Williams • Order #1233"
            amount="+₦3,200"
            date="Today, 11:30 AM"
          />
          <Transaction
            type="debit"
            title="Withdrawal"
            subtitle="Bank Transfer to GTBank"
            amount="-₦15,000"
            date="Yesterday, 05:20 PM"
          />
          <Transaction
            type="credit"
            title="Delivery Payment"
            subtitle="Michael Chen • Order #1232"
            amount="+₦1,800"
            date="Yesterday, 02:15 PM"
          />
          <Transaction
            type="credit"
            title="Bonus Reward"
            subtitle="Weekly Performance Bonus"
            amount="+₦5,000"
            date="2 days ago"
          />
        </View>
        Payment Methods
        {/* <View style={tw`bg-white rounded-2xl p-5 shadow-sm`}>
          <Text style={tw`text-lg font-bold text-gray-900 mb-4`}>
            Payment Methods
          </Text>

          <View
            style={tw`flex-row justify-between items-center p-4 bg-gray-50 rounded-xl mb-3`}
          >
            <View style={tw`flex-row items-center`}>
              <View
                style={tw`w-10 h-10 bg-blue-100 rounded-xl justify-center items-center mr-3`}
              >
                <Text style={tw`text-xl`}>💳</Text>
              </View>
              <View>
                <Text style={tw`text-sm font-semibold text-gray-900 mb-0.5`}>
                  GTBank •••• 4532
                </Text>
                <Text style={tw`text-xs text-gray-600`}>Primary Account</Text>
              </View>
            </View>
            <View style={tw`bg-blue-100 px-3 py-1 rounded-lg`}>
              <Text style={tw`text-xs font-semibold text-blue-500`}>
                Primary
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={tw`flex-row items-center justify-center py-3.5 border-2 border-dashed border-gray-300 rounded-xl`}
          >
            <Text style={tw`text-lg text-gray-600 mr-2`}>+</Text>
            <Text style={tw`text-sm font-semibold text-gray-600`}>
              Add Payment Method
            </Text>
          </TouchableOpacity>
        </View> */}
        <View style={tw`h-5`} />
      </ScrollView>
    </View>
  );
};

export default WalletScreen;
