import PrimaryButton from "@/components/Buttons/PrimaryButton";
import TextInputFields from "@/components/Inputs/TextInputFields";
import Colors from "@/constants/Colors";
import { fontFamily } from "@/constants/fonts";
import tw from "@/constants/tailwind";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Text, TouchableOpacity, useColorScheme, View } from "react-native";

interface PhoneLoactionProps {
    
}

const PhoneLocation = ({ }: PhoneLoactionProps) => {

    const [selected, setSelected] = useState<number | null>(null);
    const colorSheme = useColorScheme();
    const themeColors = Colors[colorSheme ?? "light"];
    const router = useRouter();


    const country = [
        {country: "Nigeria", name: require("../../../../assets/images/IntroImages/flag.png")},
        {country: "Ghana", name: require("../../../../assets/images/IntroImages/ghana.png")},
        {country: "Kenya", name: require("../../../../assets/images/IntroImages/kenya.png")}
    ]

    const handleNext = () => {
        router.navigate("/screens/Auth/User/Otp")
    }

    return (
        <View style={[tw`bg-[#19488A] flex-1 justify-end`, {
        }]}>
             <Image
                      source={require("../../../../assets/images/Intro_logo.png")}
                      style={[tw`self-center h-140 w-140 absolute -top-15`]}
                      resizeMode="contain"
            />
            <View style={[tw`bg-white px-5 py-10 pb-15 gap-7 justify-center`, {
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20
            }]}>
                 <View style={[tw`items-center gap-3 `]}>
                  <Text style={[tw`text-2xl`, {
                  fontFamily: fontFamily.Bold
                }]}>Welcome to LAS Mobile</Text>
                  <Text style={[tw`w-[80%] text-center`, {
                  fontFamily: fontFamily.Light
                }]}>Enter your phone number to continue</Text>
                </View>
                <View style={[tw`gap-5`]}>
                    <Text style={[tw``, {
                        fontFamily: fontFamily.Medium
                    }]}>Select your country</Text>
                <View style={[tw`flex-row gap-2`]}>
                    {country.map((items, index) => {
                        const isSelected = selected === index;
                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={() => {
                                    setSelected(index);
                                }}
                                style={[
                                    tw`bg-[#003C7A0D] h-25 flex-1 p-3  gap-2 rounded-lg items-center justify-center`,
                                    {
                                        borderWidth: isSelected ? 1 : 1,
                                        borderColor: isSelected
                                            ? themeColors.tint
                                            : "#19488A22",
                                        backgroundColor: isSelected ? "#003C7A15" : "transparent",
                                    },
                                ]}
                            >
                                <Image source={items.name} style={[tw`h-10 w-10`]} />
                                <Text style={[tw``, {
                                    fontFamily: fontFamily.Light
                                }]}>{items.country}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
                </View>
                <TextInputFields
                    placeholderText="phone number"
                    />
                <View style={[tw`gap-3`]}>
                    <PrimaryButton
                        bgColors="#003C7A"
                        height={50}
                        text="Continue"
                        textColor="white"
                        disabled={selected === null}
                        onpress={() => {
                            handleNext();
                        }}
                    />
                     <View style={[tw`flex-row items-center justify-center gap-1`]}>
                <Text
                  style={[
                    tw``,
                    {
                      fontFamily: fontFamily.Light,
                    },
                  ]}
                >
                  Already have an account?
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    router.replace("/screens/Auth/User/SignIn");
                  }}
                >
                  <Text
                    style={[
                      tw`text-center`,
                      {
                        color: themeColors.primaryTextColor,
                        fontFamily: fontFamily.Bold,
                      },
                    ]}
                  >
                    Sign In
                  </Text>
                </TouchableOpacity>
              </View>
                </View>
            </View>
        </View>
    )
}

export default PhoneLocation;