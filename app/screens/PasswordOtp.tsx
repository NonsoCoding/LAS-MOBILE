import PrimaryButton from "@/components/Buttons/PrimaryButton";
import SharedLayout from "@/components/Layout/SharedLayout";
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

const PasswordOtp = () => {
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

    // Navigate to ChangePassword screen with OTP
    router.push({
      pathname: "/screens/ChangePassword",
      params: { otp },
    });
  };

  const handleResendCode = async () => {
    // TODO: Implement resend code functionality
    Alert.alert("Info", "Resend code functionality to be implemented");
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
              Password Reset Verification
            </Text>

            <Text style={tw`text-gray-400`}>
              Input the six digit verification code sent to your email
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

          {/* RESEND CODE LINK */}
          <View style={tw`flex-row gap-1 items-center justify-center`}>
            <Text>Didn't receive the code?</Text>
            <TouchableOpacity onPress={handleResendCode}>
              <Text
                style={[tw`underline`, { color: themeColors.primaryColor }]}
              >
                Resend
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

export default PasswordOtp;
