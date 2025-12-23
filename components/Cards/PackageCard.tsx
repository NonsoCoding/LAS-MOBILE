import Colors from "@/constants/Colors";
import tw from "@/constants/tailwind";
import { Motorbike } from "lucide-react-native";
import { Text, useColorScheme, View } from "react-native";

interface PackageCardProps {}

const PackageCard = ({}: PackageCardProps) => {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];

  return (
    <View
      style={[
        tw`bg-white items-center flex-1 p-4 rounded-lg flex-row justify-between`,
        {
          // iOS shadow properties
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          // Android shadow
          elevation: 3,
        },
      ]}
    >
      <View style={[tw`flex-row items-center gap-4`, {}]}>
        <View
          style={[
            tw`h-15 w-15 items-center justify-center rounded-lg`,
            {
              backgroundColor: themeColors.tint,
            },
          ]}
        >
          <Motorbike size={30} color={"white"} />
        </View>
        <Text style={[tw`font-semibold`, {}]}>Ref ID: 12747599</Text>
      </View>
      <View>
        <Text style={[tw`text-gray-400`]}>28 Aug, 4.39 PM</Text>
      </View>
    </View>
  );
};

export default PackageCard;
