import PrimaryButton from "@/components/Buttons/PrimaryButton";
import useAuthStore from "@/components/store/authStore";
import Colors from "@/constants/Colors";
import { fontFamily } from "@/constants/fonts";
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
  const authStore = useAuthStore();

  interface AccountOption {
    name: string;
    image: any;
    info: string;
    navigation: string;
    role: "shipper" | "carrier";
  }

  const AccountType: AccountOption[] = [
    {
      name: "I'm a Carrier",
      image: require("../assets/images/IntroImages/OnboardingIcon.png"),
      info: "Send and receive packages across Nigeria, Ghana & Kenya",
      navigation: "/screens/Auth/Rider/Carrier-indemnity",
      role: "carrier",
    },
    {
      name: "I'm a Customer",
      image: require("../assets/images/IntroImages/OnboardingIcon2.png"),
      info: "Deliver packages and earn money with your vehicle",
      navigation: "/screens/Auth/User",
      role: "shipper",
    },
  ];

  const handleNext = () => {
    if (selected !== null) {
      const selectedAccount = AccountType[selected];
      authStore.setRole(selectedAccount.role);
      console.log("Navigating to:", selectedAccount.navigation); // Debug log
      router.push(selectedAccount.navigation as any);
    }
  };

  return (
    <View style={[tw`pt-8 flex-1 justify-end bg-[#19488A]`]}>
       <Image
                      source={require("../assets/images/Intro_logo.png")}
                      style={[tw`self-center h-150 w-150 absolute z-999 -top-25`]}
                      resizeMode="contain"
            />
      <View style={[tw`gap-6 bg-white py-10 pb-15 justify-center px-5`, {
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20
      }]}>
        <View style={[tw`items-center gap-2`]}>
          <Text style={[tw`text-xl`, {
            fontFamily: fontFamily.Bold
          }]}>How will you use LAS?</Text>
          <Text style={[tw``, {
            fontFamily: fontFamily.Light
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
                    <Text style={[tw`text-[17px] text-[#19488A]`, {
                    fontFamily: fontFamily.Bold
                  }]}>
                    {items.name}
                  </Text>
                  
                    <Text style={[tw`text-xs w-[70%]`, {
                    fontFamily: fontFamily.Regular
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
