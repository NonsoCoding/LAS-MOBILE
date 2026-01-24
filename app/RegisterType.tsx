import PrimaryButton from "@/components/Buttons/PrimaryButton";
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
      name: "I'm a Carrier",
      image: require("../assets/images/IntroImages/OnboardingIcon.png"),
      info: "Send and receive packages across Nigeria, Ghana & Kenya",
      navigation: "/screens/Rider/Carrier-indemnity",
    },
    {
      name: "I'm a Customer",
      image: require("../assets/images/IntroImages/OnboardingIcon2.png"),
      info: "Deliver packages and earn money with your vehicle",
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
    <View style={[tw`pt-8 flex-1 justify-end bg-[#19488A]`]}>
       <Image
                      source={require("../assets/images/Intro_logo.png")}
                      style={[tw`self-center h-150 w-150 absolute z-999 -top-15`]}
                      resizeMode="contain"
            />
      <View style={[tw`gap-6 bg-white h-110 justify-center px-5`, {
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20
      }]}>
        <View style={[tw`items-center gap-2`]}>
          <Text style={[tw`text-xl font-semibold font-lightt`, {
            fontFamily: "MontserratBold"
          }]}>How will you use LAS?</Text>
          <Text style={[tw`font-light`, {
            fontFamily: "MontserratLight"
          }]}>Select your primary role 
(you can add more later)</Text>
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
                    tw`bg-[#003C7A0D] flex-row p-3  gap-2 rounded-lg items-center`,
                    {
                      borderWidth: isSelected ? 1 : 1,
                      borderColor: isSelected
                        ? themeColors.tint
                        : "#19488A22",
                      backgroundColor: isSelected ? "#003C7A15" : "transparent",
                    },
                  ]}
                >
                  <View style={[tw`bg-[#19488A] rounded-md p-1.5`]}>
                  <Image resizeMode="contain" style={[tw`h-15 w-20`]} source={items.image} />
                  </View>
                  <View style={[tw`gap-1.5`]}>
                    <Text style={[tw`font-semibold text-[17px] text-[#19488A]`, {
                    fontFamily: "MontserratBold"
                  }]}>
                    {items.name}
                  </Text>
                  
                    <Text style={[tw`textext-[14px] text-xs w-[70%] font-light`, {
                    fontFamily: "MontserratRegular"
                  }]}>
                    {items.info}
                  </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        <PrimaryButton
          height={50}
          bgColors={selected === null ? "#003C7A33" : "#003C7A"}
          text="Continue"
          textColor="white"
          disabled={selected === null}
          onpress={() => {
            handleNext();
          }}
        />
        </View>
      </View>
  );
};

export default RegisterType;
