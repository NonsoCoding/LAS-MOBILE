import PrimaryButton from "@/components/Buttons/PrimaryButton";
import TextInputFields from "@/components/Inputs/TextInputFields";
import SharedLayout from "@/components/Layout/SharedLayout";
import { forgottenPassword } from "@/components/services/api/authApi";
import yup from "@/components/utils/formik";
import Colors from "@/constants/Colors";
import tw from "@/constants/tailwind";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import { AtSign } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, Text, useColorScheme, View } from "react-native";

const validationShema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
});

export default function ForgottenPassword() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];
  const [loading, setLoading] = useState(false);

  const forgotPassword = async (values: { email: string }) => {
    console.log("Forgot password called with:", values.email);

    try {
      setLoading(true);
      const res = await forgottenPassword(values.email);
      console.log("Forgot password response:", res);

      // Check if response has message (successful response from backend)
      if (res.message) {
        Alert.alert(
          "Success",
          "Password reset code sent to your email. Please check your inbox.",
          [
            {
              text: "OK",
              onPress: () => router.push("/screens/PasswordOtp"),
            },
          ]
        );
      } else {
        Alert.alert("Error", "Failed to send reset code. Please try again.");
      }
    } catch (error: any) {
      console.error("Forgot password error:", error);
      Alert.alert(
        "Error",
        error?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SharedLayout>
      <Formik
        initialValues={{ email: "" }}
        validationSchema={validationShema}
        onSubmit={forgotPassword}
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
            <View style={[tw`gap-10`]}>
              <View style={[tw`gap-3`]}>
                <Text style={[tw`text-4xl font-semibold text-[#003C7A]`]}>
                  Forgotten Password
                </Text>
                <Text style={[tw`font-light`]}>
                  Kindly provide your valid email address to receive a
                  verification code in your mail
                </Text>
              </View>
              <View style={[tw`gap-3`]}>
                <TextInputFields
                  icon={AtSign}
                  iconColor={themeColors.primaryColor}
                  placeholderText="Email"
                  iconSize={18}
                  placeholderTextColor="black"
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {touched.email && errors.email && (
                  <Text style={[tw`text-red-500 text-xs mt-1`]}>
                    {errors.email}
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
                text={loading ? "Sending..." : "Continue"}
                disabled={loading}
              />
            </View>
          </View>
        )}
      </Formik>
    </SharedLayout>
  );
}
