import PrimaryButton from "@/components/Buttons/PrimaryButton";
import OrderCard from "@/components/Cards/OrderCard";
import SharedLayout from "@/components/Layout/SharedLayout";
import Colors from "@/constants/Colors";
import tw from "@/constants/tailwind";
import { useRouter } from "expo-router";
import { ArrowDown } from "lucide-react-native";
import { Switch, Text, useColorScheme, View } from "react-native";

interface UserHomePageProps {}

const RiderHomePage = ({}: UserHomePageProps) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];
  return (
    <SharedLayout>
      <View style={[tw`flex-1 py-5 gap-10`, {}]}>
        <Text style={[tw`self-center text-xl font-semibold`, {}]}>Hom</Text>
        <View style={[tw`flex-row justify-between`, {}]}>
          <Text style={[tw`text-xl font-semibold`, {}]}>Hey Karim,</Text>
          <Switch />
        </View>
        <OrderCard
          statusTextColor=""
          onPress={() => {
            
          }}
          issuedTo="Customer"
          name="Johnson Chike"
          cardTitle="New Order"
          status="Single trip"
          statusBgColor=""
          date="02 Sept, 2022"
        />
        <View style={[tw`gap-7`]}>
          <View style={[tw`gap-4`, {}]}>
            <Text
              style={[
                tw`font-semibold`,
                {
                  color: themeColors.tint,
                },
              ]}
            >
              Pick up
            </Text>
            <Text style={[tw`w-[70%]`]}>No 2, Balonny Close, Allen Avenue</Text>
          </View>
          <ArrowDown color={themeColors.tint} />
          <View style={[tw`gap-4`, {}]}>
            <Text
              style={[
                tw`font-semibold`,
                {
                  color: themeColors.tint,
                },
              ]}
            >
              Delivery
            </Text>
            <Text style={[tw`w-[70%]`]}>
              87, South Lester Street, London Close Belgium
            </Text>
          </View>
          <View
            style={[
              tw`border-b-gray-300`,
              {
                borderBottomWidth: 1,
              },
            ]}
          />
          <View style={[tw`gap-4`, {}]}>
            <Text style={[tw`font-semibold text-gray-400`]}>Sending</Text>
            <Text style={[tw`w-[70%]`]}>Document 5kg</Text>
          </View>
        </View>
        <View style={[tw`gap-3`]}>
          <PrimaryButton
            height={50}
            text="Accept Order"
            textColor={themeColors.text}
            bgColors={themeColors.tint}
          />
          <PrimaryButton
            height={50}
            text="Decline Order"
            textColor={themeColors.tint}
          />
        </View>
      </View>
    </SharedLayout>
  );
};

export default RiderHomePage;
