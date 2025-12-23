import Colors from "@/constants/Colors";
import tw from "@/constants/tailwind";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import {
  AlignCenter,
  ArrowLeft,
  ArrowRight,
  Bell,
  Car,
  Phone,
  Star,
} from "lucide-react-native";
import {
  ImageBackground,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

interface NewOrdersProps {}

const TrackOrders = ({}: NewOrdersProps) => {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];
  const navigation = useNavigation();
  const router = useRouter();

  return (
    <View style={[tw`flex-1`]}>
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
                Track Order
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={[tw`flex-1 justify-between`]}>
        <View style={[tw`p-5 gap-4 bottom-15`]}>
          <View style={[tw`bg-white gap-6 rounded- p-5`]}>
            <View
              style={[tw`flex-row border-b pb-2 items-center justify-between`]}
            >
              <Text>ORDER #ORD-1248</Text>
              <Phone color={themeColors.primaryColor} />
            </View>
            <View style={[tw`flex-row items-center gap-4`]}>
              <View
                style={[
                  tw`bg-[#4CB05022] h-12 w-12 rounded-full justify-center items-center`,
                ]}
              >
                <Car color={"#4CB050"} />
              </View>
              <View>
                <Text style={[tw`text-xl`]}>In Transit</Text>
                <Text style={[tw`font-light`]}>Driver on the way</Text>
              </View>
            </View>
          </View>
          <View>
            <ImageBackground
              source={require("../../assets/images/IntroImages/maps1.png")}
              style={[tw`h-30 rounded-lg overflow-hidden`]}
            >
              {/* Dark overlay */}
              <View
                style={[
                  tw`absolute inset-0 bg-black`,
                  {
                    opacity: 0.4, // Adjust this value: 0.3 for lighter, 0.5 for darker
                  },
                ]}
              />

              {/* Content */}
              <View style={[tw`flex-1 items-center gap-2 justify-center`]}>
                <TouchableOpacity
                  style={[
                    tw`rounded-full h-10 w-10 items-center justify-center`,
                    {
                      backgroundColor: themeColors.primaryColor,
                    },
                  ]}
                >
                  <ArrowRight color={"white"} />
                </TouchableOpacity>
                <Text style={[tw`font-light text-xl`]}>Live Tracking</Text>
              </View>
            </ImageBackground>
          </View>
          <View
            style={[
              tw`bg-white p-5 rounded-lg items-center flex-row justify-between`,
            ]}
          >
            <View style={[tw`flex-row items-center gap-4`]}>
              <View
                style={[
                  tw`bg-[#4CB05022] h-12 w-12 rounded-full justify-center items-center`,
                ]}
              >
                <Car color={"#4CB050"} />
              </View>
              <View>
                <Text style={[tw`text-xl`]}>Michael Johnson</Text>
                <View style={[tw`flex-row items-center gap-1`]}>
                  <Star color={"black"} size={16} />
                  <Text style={[tw`font-light text-xs`]}>
                    4.9 (324 deliveries)
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={[
                tw`self-end p-2 rounded-full`,
                {
                  backgroundColor: themeColors.primaryColor,
                },
              ]}
            >
              <ArrowRight color={themeColors.text} />
            </View>
          </View>
        </View>
        {/* <View style={[tw`bg-white h-30 justify-center px-5`]}>
          <PrimaryButton
            bgColors={themeColors.primaryColor}
            height={50}
            onpress={() => {
              router.navigate("/screens/User/OrderDetails");
            }}
            text={"Continue to payment"}
            textColor="white"
          />
        </View> */}
      </View>
    </View>
  );
};

export default TrackOrders;
