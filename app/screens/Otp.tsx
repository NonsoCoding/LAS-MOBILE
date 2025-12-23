import PrimaryButton from "@/components/Buttons/PrimaryButton";
import SharedLayout from "@/components/Layout/SharedLayout";
import { verifyOtp } from "@/components/services/api/authApi";
import useAuthStore from "@/components/store/authStore";
import useRiderAuthStore from "@/components/store/RiderAuthStore";
import Colors from "@/constants/Colors";
import tw from "@/constants/tailwind";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { OtpInput } from "react-native-otp-entry";

const OtpScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];

  // Get login function from Zustand store
  const { login } = useRiderAuthStore();

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
        router.replace("/(Rider-Drawer)");

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
    <SharedLayout>
      <View style={tw`flex-1 pt-10 justify-between`}>
        <View style={tw`gap-10`}>
          <View style={tw`gap-2`}>
            <Text
              style={[
                tw`text-3xl font-semibold`,
                { color: themeColors.primaryTextColor },
              ]}
            >
              Rider Verification
            </Text>

            <Text style={tw`text-gray-400`}>
              Input the six digit verification code sent to your mail
            </Text>
          </View>

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
                backgroundColor: colorScheme === "dark" ? "#1F1F1F" : "#FFFFFF",
                borderWidth: 2,
                borderColor: colorScheme === "dark" ? "#2A2A2A" : "#E5E5E5",
                borderRadius: 10,
                width: 50,
                height: 65,
                elevation: 5,
              },
              focusedPinCodeContainerStyle: {
                borderColor: themeColors.tint,
                borderWidth: 2.5,
              },
              pinCodeTextStyle: {
                color: themeColors.primaryTextColor,
                fontSize: 26,
                fontWeight: "700",
              },
              filledPinCodeContainerStyle: {
                borderColor: themeColors.tint,
              },
            }}
            textInputProps={{
              accessibilityLabel: "One-Time Password",
            }}
            focusColor={themeColors.tint}
          />

          {/* LOGIN LINK */}
          <View style={tw`flex-row gap-1 items-center justify-center`}>
            <Text>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/screens")}>
              <Text
                style={[tw`underline`, { color: themeColors.primaryColor }]}
              >
                Login
              </Text>
            </TouchableOpacity>
          </View>
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
      </View>
    </SharedLayout>
  );
};

export default OtpScreen;
