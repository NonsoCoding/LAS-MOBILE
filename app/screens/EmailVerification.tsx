import PrimaryButton from "@/components/Buttons/PrimaryButton";
import SharedLayout from "@/components/Layout/SharedLayout";
import Colors from "@/constants/Colors";
import tw from "@/constants/tailwind";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Mail } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  useColorScheme,
  View,
} from "react-native";

export default function EmailVerification() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];

  const params = useLocalSearchParams();
  const { email } = params;

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const checkVerificationStatus = async () => {
    setLoading(true);
    try {
      // Call your API to check if email is verified
      const response = await fetch(
        `${process.env.EXPO_BASE_URL}/api/auth/check-verification/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (data.is_verified || data.verified) {
        Alert.alert(
          "Email Verified!",
          "Your email has been verified successfully.",
          [
            {
              text: "Continue",
              onPress: () => router.replace("/(Rider-Drawer)"),
            },
          ]
        );
      } else {
        Alert.alert(
          "Not Verified Yet",
          "Please check your email and click the verification link. It may take a few moments to arrive."
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        "Could not check verification status. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    setResending(true);
    try {
      const response = await fetch(
        `${process.env.EXPO_BASE_URL}/api/auth/resend-verification/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          "Email Sent",
          "Verification email has been resent. Please check your inbox."
        );
      } else {
        Alert.alert(
          "Error",
          data.message || "Could not resend verification email."
        );
      }
    } catch (error: any) {
      Alert.alert("Error", "Network error. Please try again later.");
    } finally {
      setResending(false);
    }
  };

  return (
    <SharedLayout>
      <View style={[tw`flex-1 justify-center items-center gap-8 px-4`]}>
        <View style={[tw`items-center gap-4`]}>
          <View
            style={[
              tw`w-24 h-24 rounded-full bg-blue-100 items-center justify-center`,
            ]}
          >
            <Mail size={48} color={themeColors.primaryColor} />
          </View>

          <Text style={[tw`text-3xl font-semibold text-center text-[#003C7A]`]}>
            Verify Your Email
          </Text>

          <Text style={[tw`text-center text-gray-600 font-light`]}>
            We've sent a verification link to
          </Text>

          <Text style={[tw`text-center font-semibold text-[#CC1A21]`]}>
            {email}
          </Text>

          <Text style={[tw`text-center text-gray-600 font-light`]}>
            Please check your inbox and click the verification link to activate
            your account.
          </Text>
        </View>

        <View style={[tw`w-full gap-3`]}>
          <PrimaryButton
            bgColors={themeColors.primaryColor}
            height={50}
            textColor="white"
            text={loading ? "Checking..." : "I've Verified My Email"}
            onpress={checkVerificationStatus}
            disabled={loading || resending}
          />

          <PrimaryButton
            bgColors="transparent"
            height={50}
            textColor={themeColors.primaryColor}
            text={resending ? "Resending..." : "Resend Verification Email"}
            onpress={resendVerificationEmail}
            disabled={loading || resending}
          />

          {(loading || resending) && (
            <View style={[tw`items-center mt-2`]}>
              <ActivityIndicator
                size="small"
                color={themeColors.primaryColor}
              />
            </View>
          )}
        </View>

        <Text style={[tw`text-center text-gray-500 text-xs font-light`]}>
          Didn't receive the email? Check your spam folder or click resend.
        </Text>
      </View>
    </SharedLayout>
  );
}
