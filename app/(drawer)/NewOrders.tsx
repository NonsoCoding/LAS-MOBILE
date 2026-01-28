import PrimaryButton from "@/components/Buttons/PrimaryButton";
import TextInputFields from "@/components/Inputs/TextInputFields";
import Colors from "@/constants/Colors";
import { fontFamily } from "@/constants/fonts";
import tw from "@/constants/tailwind";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import {
  AlignCenter,
  ArrowLeft,
  ArrowRight,
  Bell,
  Phone,
} from "lucide-react-native";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";

interface NewOrdersProps {}

const NewOrders = ({}: NewOrdersProps) => {
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
              <TouchableOpacity>
                <ArrowLeft color={themeColors.text} />
              </TouchableOpacity>
              <Text style={[tw`text-3xl text-white`, { fontFamily: fontFamily.Bold }]}>
                New Order
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={[tw`p-5 gap-4 bottom-15`]}>
        <View style={[tw`bg-white gap-6 rounded- p-5`]}>
          <View style={[tw`gap-4`]}>
            <View style={[tw`flex-row justify-between items-center`]}>
              <Text style={[tw`text-xl`, { fontFamily: fontFamily.Bold }]}>Order details</Text>
              <Phone color={themeColors.primaryColor} />
            </View>
            <View style={[tw`border-b`]} />
          </View>
          <TextInputFields placeholderText="Item Name" />
          <TextInputFields placeholderText="Item Name" />
        </View>
        <View
          style={[
            tw`bg-white p-5 rounded-lg items-center flex-row justify-between`,
          ]}
        >
          <View style={[tw`gap-2 w-[80%]`]}>
            <Text style={[tw`text-xl`, { fontFamily: fontFamily.Bold }]}>Pick Location</Text>
            <Text style={[tw``, { fontFamily: fontFamily.Light }]}>
              Danziyal Plaza, Olusegun Obasanjo Way, Central Business District
            </Text>
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
        <View
          style={[
            tw`bg-white p-5 rounded-lg items-center flex-row justify-between`,
          ]}
        >
          <View style={[tw`gap-2 w-[80%]`]}>
            <Text style={[tw`text-xl`, { fontFamily: fontFamily.Bold }]}>Pick Location</Text>
            <Text style={[tw``, { fontFamily: fontFamily.Light }]}>
              Danziyal Plaza, Olusegun Obasanjo Way, Central Business District
            </Text>
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
      <View style={[tw`bg-white flex-1 justify-center px-5`]}>
        <PrimaryButton
          bgColors={themeColors.primaryColor}
          height={50}
          onpress={() => {
            router.navigate("/screens/User/OrderDetails");
          }}
          text={"Continue to payment"}
          textColor="white"
        />
      </View>
    </View>
  );
};

export default NewOrders;
