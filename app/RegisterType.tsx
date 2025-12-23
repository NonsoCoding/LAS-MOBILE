import PrimaryButton from "@/components/Buttons/PrimaryButton";
import SharedLayout from "@/components/Layout/SharedLayout";
import Colors from "@/constants/Colors";
import tw from "@/constants/tailwind";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

interface RegisterTypePropss {}

const RegisterType = ({}: RegisterTypePropss) => {
  const router = useRouter();
  const [selected, setSelected] = useState<number | null>(null);
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];

  const AccountType = [
    {
      name: "CARRIER",
      image: require("../assets/images/IntroImages/OnboardingIcon.png"),
      info: "Turn your miles into money. Enjoy competitive daily earnings and exclusive monthly performance bonuses.",
      navigation: "/screens/Rider/Carrier-indemnity",
    },
    {
      name: "SHIPPER",
      image: require("../assets/images/IntroImages/OnboardingIcon2.png"),
      info: "Move your goods with confidence. Get guaranteed insurance on all deliveries and cashback on wallet transactions.",
      navigation: "/screens/Auth/User",
    },
  ];

  const handleNext = () => {
    if (selected !== null) {
      const selectedRoute = AccountType[selected].navigation;
      console.log("Navigating to:", selectedRoute); // Debug log
      router.push(selectedRoute as any);
    }
  };

  return (
    <SharedLayout>
      <View style={[tw`pt-8 flex-1 justify-between`]}>
        <View style={[tw`gap-6`]}>
          <View style={[tw`gap-3`]}>
            <Text style={[tw`text-4xl font-semibold text-[#003C7A]`]}>
              Select Your
            </Text>
            <Text style={[tw`text-4xl font-semibold text-[#CC1A21]`]}>
              Account Type!
            </Text>
            <Text>
              Welcome to LAS Mobile Sub-headline: Choose how you would like to
              get started today.
            </Text>
          </View>
          <View style={[tw`gap-2`]}>
            {AccountType.map((items, index) => {
              const isSelected = selected === index;
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelected(index);
                  }}
                  style={[
                    tw`bg-[#003C7A0D] py-7 px-10 gap-3 rounded-lg items-center`,
                    {
                      borderWidth: isSelected ? 2 : 0,
                      borderColor: isSelected
                        ? themeColors.tint
                        : "transparent",
                      backgroundColor: isSelected ? "#003C7A15" : "#003C7A0D",
                    },
                  ]}
                >
                  <Text style={[tw`font-semibold text-[17px]`]}>
                    {items.name}
                  </Text>
                  <Image style={[tw`h-20 w-20`]} source={items.image} />
                  <Text style={[tw`text-center text-gray-600`]}>
                    {items.info}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <PrimaryButton
          height={60}
          bgColors={selected === null ? "#003C7A33" : "#003C7A"}
          text="Next"
          textColor="white"
          disabled={selected === null}
          onpress={() => {
            handleNext();
          }}
        />
      </View>
    </SharedLayout>
  );
};

export default RegisterType;
