import PrimaryButton from "@/components/Buttons/PrimaryButton";
import Colors from "@/constants/Colors";
import tw from "@/constants/tailwind";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import { AlignCenter, ArrowLeft, Bell, Box, Phone } from "lucide-react-native";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";

interface NewOrdersProps {}

const OrderDetails = ({}: NewOrdersProps) => {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];
  const navigation = useNavigation();
  const router = useRouter();

  const orderDetails = [
    { name: "item", info: "Load scanner device" },
    { name: "Distance", info: "5.6 Km" },
    { name: "Delivery Fee", info: "₦2,000" },
    { name: "Service Fee", info: "₦200" },
  ];

  return (
    <View style={[tw`flex-1 bg-gray-200`]}>
      <View
        style={[
          tw`h-[27%] rounded-b-[30px]`,
          {
            backgroundColor: themeColors.primaryColor,
          },
        ]}
      >
        <View style={[tw`flex-1 px-5 py-15 justify-between`]}>
          <View style={[tw`flex-row items-center gap-3 justify-between`, {}]}>
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
            <TouchableOpacity>
              <Bell color={"white"} />
            </TouchableOpacity>
          </View>
          <View style={[tw`gap-2`]}>
            <View style={[tw`flex-row items-center gap-3`, {}]}>
              <TouchableOpacity
                onPress={() => {
                  router.back();
                }}
              >
                <ArrowLeft color={themeColors.text} />
              </TouchableOpacity>
              <Text style={[tw`text-3xl font-bold text-white`, {}]}>
                Payment
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={[tw`flex-1 gap-4`]}>
        <View style={[tw`gap-3 px-5 bottom-10`]}>
          <View style={[tw`bg-white gap-6 rounded- p-5`]}>
            <View style={[tw`gap-4`]}>
              <View style={[tw`flex-row justify-between items-center`]}>
                <Text style={[tw`text-2xl`]}>Order details</Text>
                <Phone color={themeColors.primaryColor} />
              </View>
              <View style={[tw`border-b`]} />
            </View>
            <View style={[]}>
              <View>
                {orderDetails.map((items, index) => {
                  return (
                    <View key={index} style={[tw``, {}]}>
                      <View style={[tw`flex-row justify-between`]}>
                        <Text style={[tw`py-3 text-gray-500`]}>
                          {items.name}
                        </Text>
                        <Text>{items.info}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
              <View style={[tw`flex-row justify-between`]}>
                <Text style={[tw`text-xl text-gray-500`]}>Total</Text>
                <Text>₦2,000</Text>
              </View>
            </View>
          </View>
          <View style={[tw`bg-white p-5 rounded-lg gap-5`]}>
            <View style={[tw`gap-4`]}>
              <View style={[tw`flex-row justify-between items-center`]}>
                <Text style={[tw`text-2xl`]}>Order details</Text>
                <Phone color={themeColors.primaryColor} />
              </View>
              <View style={[tw`border-b`]} />
            </View>
            <View style={[tw`gap-3 flex-row items-center`]}>
              <View
                style={[
                  tw`self-start p-2 rounded-full`,
                  {
                    backgroundColor: "#4CB05033",
                  },
                ]}
              >
                <Box color={"#4CB050"} />
              </View>
              <View>
                <Text style={[tw``]}>Card Payment</Text>
                <Text style={[tw`font-light`]}>
                  Pay with credit or debit card
                </Text>
              </View>
            </View>
            <View style={[tw`gap-3 flex-row items-center`]}>
              <View
                style={[
                  tw`self-start p-2 rounded-full`,
                  {
                    backgroundColor: "#4CB05033",
                  },
                ]}
              >
                <Box color={"#4CB050"} />
              </View>
              <View>
                <Text style={[tw``]}>Mobile Wallet</Text>
                <Text style={[tw`font-light`]}>Pay with mobile money</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={[tw`bg-white flex-1 h-100 justify-center px-5`]}>
          <PrimaryButton
            bgColors={themeColors.primaryColor}
            height={50}
            onpress={() => {
              router.push("/(drawer)/TrackOrders");
            }}
            text={"Continue to payment"}
            textColor="white"
          />
        </View>
      </View>
    </View>
  );
};

export default OrderDetails;
