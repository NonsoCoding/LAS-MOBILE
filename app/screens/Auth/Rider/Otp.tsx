import PrimaryButton from "@/components/Buttons/PrimaryButton";
import CompleteModal from "@/components/Modals/CompleteModal";
import { verifyOtp } from "@/components/services/api/authApi";
import useAuthStore from "@/components/store/authStore";
import Colors from "@/constants/Colors";
import { fontFamily } from "@/constants/fonts";
import tw from "@/constants/tailwind";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { OtpInput } from "react-native-otp-entry";


const UserOtpScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];
  const params = useLocalSearchParams();

  // Get login function from Zustand store
  const { login, phoneNumber } = useAuthStore();

  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [completeModalVisible, setCompleteModalVisible] = useState(false);

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
        router.replace("/(Rider-Drawer)");

        setCompleteModalVisible(true);
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
    <View style={[tw`flex-1 bg-[#19488A] justify-end`]}>
      <Image
              source={require("../../../../assets/images/Intro_logo.png")}
              style={[tw`self-center h-150 w-150 absolute -top-20`]}
              resizeMode="contain"
            />
      <View style={tw`bg-white py-10 pb-15 px-5 gap-5 rounded-t-2xl`}>
        <View style={[tw`items-center gap-1`]}>
          <Text style={[tw`text-2xl`, {
            fontFamily: fontFamily.Bold,
          }]}>Verify your Email</Text>
          <Text style={[tw`text-sm`, {
            fontFamily: fontFamily.Regular,
          }]}>Enter the 6-digit code sent to your email</Text>
          <Text style={[tw`text-sm text-[#CC1A21]`, {
            fontFamily: fontFamily.Regular,
          }]}>{phoneNumber || params.email}</Text>
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

        {/* CONTINUE BUTTON */}
        <PrimaryButton
          bgColors={themeColors.primaryColor}
          height={50}
          onpress={handleContinue}
          textColor={themeColors.text}
          text={loading ? "Verifying..." : "Continue"}
          disabled={otp.length !== 6 || loading}
        />
           {/* LOGIN LINK */}
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
                    router.replace("/screens");
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
        <CompleteModal
          visible={completeModalVisible}
          onClose={() => {
            setCompleteModalVisible(false);
          }}
          title="Registration Successful"
          titleSubInfo1="Your account has been successful created."
          titleSubInfo2="After documents approval you can start your Workorders."
        />
      </View>
    </View>
  );
};

export default UserOtpScreen;
