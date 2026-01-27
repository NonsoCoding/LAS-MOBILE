import PrimaryButton from "@/components/Buttons/PrimaryButton";
import { verifyOtp } from "@/components/services/api/authApi";
import useAuthStore from "@/components/store/authStore";
import Colors from "@/constants/Colors";
import { FontTheme } from "@/constants/fonts";
import tw from "@/constants/tailwind";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";
import { OtpInput } from "react-native-otp-entry";

const UserOtpScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];

  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (otp.length !== 6) {
      Alert.alert("Invalid OTP", "Please enter the 6-digit code.");
      return;
    }

    try {
      setLoading(true);
      const res = await verifyOtp(otp);
      if (res?.message === "Email verified successfully.") {
        // Update the user's email verification status in the store
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          await useAuthStore
            .getState()
            .login(
              useAuthStore.getState().accessToken || "",
              useAuthStore.getState().refreshToken || "",
              { ...currentUser, is_email_verified: true }
            );
        }

        console.log("Navigating to rider drawer");
        router.replace("/(drawer)");

        setTimeout(() => {
          Alert.alert("Success", "Email verified successfully!");
        }, 100);
      } else {
        Alert.alert(
          "Verification Failed",
          res?.message || "Invalid OTP code. Please try again."
        );
      }
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[tw`bg-[#19488A] flex-1 justify-end`]}>
      <Image
        source={require("../../../../assets/images/Intro_logo.png")}
        style={[tw`self-center h-160 w-160 absolute z-999 -top-20`]}
        resizeMode="contain"
      />
      <View style={[tw`py-10 pb-15 justify-between bg-white gap-10 px-5`, {
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20
      }]}>
         <View style={[tw`items-center gap-3`]}>
                  <Text style={[tw`text-2xl font-semibold`, {
                  fontFamily: "MontserratBold"
                }]}>Verify your number</Text>
                  <Text style={[tw`w-[80%] text-center font-light`, {
                  fontFamily: "MontserratLight"
                }]}>We sent a 6-digit code to</Text>
                  <Text style={[tw`w-[80%] text-center font-light text-[#CC1A21]`, {
                  fontFamily:FontTheme.font.MontserratBold
                }]}>+234 800 000 0000</Text>
              </View>
        <View style={tw`gap-10`}>
          <OtpInput
            numberOfDigits={6}
            onTextChange={(text) => setOtp(text)}
            theme={{
              containerStyle: {
                gap: 12,
                width: "100%",
                justifyContent: "center",
              },
              pinCodeContainerStyle: {
                backgroundColor: colorScheme === "dark" ? "#1F1F1F" : "#19488A22",
                borderWidth: 1,
                borderColor: colorScheme === "dark" ? "#2A2A2A" : "transparent",
                borderRadius: 10,
                width: 50,
                height: 40,
                elevation: 5,
              },
              focusedPinCodeContainerStyle: {
                borderColor: themeColors.tint,
                borderWidth: 1,
              },
              pinCodeTextStyle: {
                color: themeColors.primaryTextColor,
                fontSize: 26,
                fontWeight: "700",
              },
              // Add this to ensure the text is visible
              filledPinCodeContainerStyle: {
                borderColor: themeColors.tint,
              },
            }}
            textInputProps={{
              // Add these props to ensure text input works properly
              accessibilityLabel: "One-Time Password",
            }}
            focusColor={themeColors.tint}
          />
        </View>
        <View style={[tw`gap-5`]}>
        {/* CONTINUE BUTTON */}
        <PrimaryButton
          bgColors={themeColors.primaryColor}
          height={50}
            onpress={() => {
            router.replace("/RegisterType")
          }}
          textColor={themeColors.text}
          text={loading ? "Verifying..." : "Continue"}
          disabled={otp.length !== 6 || loading}
          />
           <View style={[tw`flex-row items-center justify-center gap-1`]}>
                <Text
                  style={[
                    tw`font-light`,
                    {
                      fontFamily: "MontserratRegular",
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
                      tw`text-center font-semibold`,
                      {
                        color: themeColors.primaryTextColor,
                        fontFamily: "MontserratBold",
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
  );
};

export default UserOtpScreen;
