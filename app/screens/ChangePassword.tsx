import PrimaryButton from "@/components/Buttons/PrimaryButton";
import TextInputFields from "@/components/Inputs/TextInputFields";
import SharedLayout from "@/components/Layout/SharedLayout";
import { ConfirmPasswordReset } from "@/components/services/api/authApi";
import yup from "@/components/utils/formik";
import Colors from "@/constants/Colors";
import tw from "@/constants/tailwind";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Formik } from "formik";
import { Lock } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, Text, useColorScheme, View } from "react-native";

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export default function ChangePassword() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const otp = params.otp as string; // Get OTP from route params

  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (values: {
    password: string;
    confirmPassword: string;
  }) => {
    if (!otp) {
      Alert.alert("Error", "OTP not found. Please restart the process.");
      router.push("/screens/forgottenPassword");
      return;
    }

    console.log("Change password called with:", {
      otp,
      password: "***hidden***",
      confirmPassword: "***hidden***",
    });

    try {
      setLoading(true);
      const res = await ConfirmPasswordReset(
        otp,
        values.password,
        values.confirmPassword
      );
      console.log("Password reset response:", res);

      // Check if response has message (successful response)
      if (res.message || res.success) {
        Alert.alert(
          "Success",
          res.message ||
            "Password changed successfully. Please login with your new password.",
          [
            {
              text: "OK",
              onPress: () => router.push("/RegisterType"), // Navigate to login
            },
          ]
        );
      } else {
        Alert.alert("Error", "Failed to change password. Please try again.");
      }
    } catch (error: any) {
      console.error("Change password error:", error);

      // Show detailed error message
      let errorMessage = "Something went wrong";
      if (error?.message) {
        errorMessage = error.message;
      }

      // Check for common errors
      if (errorMessage.includes("400")) {
        errorMessage =
          "Invalid request. Please check your password and try again, or request a new OTP code.";
      } else if (errorMessage.includes("expired")) {
        errorMessage = "OTP has expired. Please request a new code.";
      } else if (errorMessage.includes("invalid")) {
        errorMessage = "Invalid OTP code. Please check and try again.";
      }

      Alert.alert("Error", errorMessage, [
        {
          text: "Get New Code",
          onPress: () => router.replace("/screens/forgottenPassword"),
        },
        {
          text: "Try Again",
          style: "cancel",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SharedLayout>
      <Formik
        initialValues={{ password: "", confirmPassword: "" }}
        validationSchema={validationSchema}
        onSubmit={handleChangePassword}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={[tw`flex-1 pt-10 gap-10 justify-between`]}>
            <View style={[tw`gap-5`]}>
              <View style={[tw`gap-3`]}>
                <Text style={[tw`text-4xl font-semibold text-[#003C7A]`]}>
                  Change Password
                </Text>
                <Text style={[tw`font-light`]}>
                  Kindly fill in both details to change your password
                </Text>
              </View>

              <View style={[tw`gap-3`]}>
                <TextInputFields
                  icon={Lock}
                  iconColor={themeColors.primaryColor}
                  placeholderText="New Password"
                  iconSize={18}
                  placeholderTextColor="black"
                  value={values.password}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  secureTextEntry
                />
                {touched.password && errors.password && (
                  <Text style={[tw`text-red-500 text-xs mt-1`]}>
                    {errors.password}
                  </Text>
                )}
              </View>

              <View style={[tw`gap-3`]}>
                <TextInputFields
                  icon={Lock}
                  iconColor={themeColors.primaryColor}
                  placeholderText="Confirm Password"
                  iconSize={18}
                  placeholderTextColor="black"
                  value={values.confirmPassword}
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  secureTextEntry
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <Text style={[tw`text-red-500 text-xs mt-1`]}>
                    {errors.confirmPassword}
                  </Text>
                )}
              </View>
            </View>

            <View style={[tw`gap-2`]}>
              <PrimaryButton
                bgColors={themeColors.primaryColor}
                height={50}
                textColor="white"
                onpress={handleSubmit}
                text={loading ? "Changing..." : "Change Password"}
                disabled={loading}
              />
            </View>
          </View>
        )}
      </Formik>
    </SharedLayout>
  );
}
