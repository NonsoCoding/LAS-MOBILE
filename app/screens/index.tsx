import PrimaryButton from "@/components/Buttons/PrimaryButton";
import TextInputFields from "@/components/Inputs/TextInputFields";
import SharedLayout from "@/components/Layout/SharedLayout";
import { loginUser, resendOtp } from "@/components/services/api/authApi";
import useAuthStore from "@/components/store/authStore";
import yup from "@/components/utils/formik";
import Colors from "@/constants/Colors";
import tw from "@/constants/tailwind";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import { AtSign, Lock } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function SignInIndex() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(false);
  const themeColors = Colors[colorScheme ?? "light"];

  const handleLogin = async (values: { email: string; password: string }) => {
    console.log("Login attempt with:", values.email);

    try {
      setLoading(true);
      const res = await loginUser(values.email, values.password);
      console.log("Login response:", res);

      if (res.message === "Login successful.") {
        // Check if email is verified
        if (!res.user.is_email_verified) {
          Alert.alert(
            "Email Not Verified",
            "Please verify your email to continue. We'll send you a verification code.",
            [
              {
                text: "Send Code",
                onPress: async () => {
                  try {
                    setLoading(true);
                    const otpRes = await resendOtp(values.email);
                    console.log("OTP resend response:", otpRes);

                    if (otpRes.success || otpRes.message) {
                      Alert.alert(
                        "Code Sent",
                        "Verification code sent to your email",
                        [
                          {
                            text: "OK",
                            onPress: () => router.push("/screens/Otp"),
                          },
                        ]
                      );
                    } else {
                      Alert.alert("Error", "Failed to send verification code");
                    }
                  } catch (error: any) {
                    console.error("Resend OTP error:", error);
                    Alert.alert("Error", "Failed to send verification code");
                  } finally {
                    setLoading(false);
                  }
                },
              },
              {
                text: "Cancel",
                style: "cancel",
              },
            ]
          );
        } else {
          // Email is verified, save tokens and user data
          await useAuthStore
            .getState()
            .login(res.tokens.access, res.tokens.refresh, res.user);

          Alert.alert("Login Successful", "Welcome to your dashboard", [
            {
              text: "OK",
              onPress: () => router.push("/(Rider-Drawer)"),
            },
          ]);
        }
      } else {
        Alert.alert("Login Failed", res.message || "Invalid credentials");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      Alert.alert("Error", error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SharedLayout>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
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
                <Text style={[tw`text-3xl font-bold text-[#003C7A]`]}>
                  Sign into your
                </Text>
                <Text style={[tw`text-3xl font-bold text-[#CC1A21]`]}>
                  account
                </Text>
                <Text style={[tw`font-light`]}>
                  Kindly provide your valid email/phone number and password to
                  proceed
                </Text>
              </View>
              <View style={[tw`gap-3`]}>
                <View style={[tw`gap-3`]}>
                  <View>
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
                  <View>
                    <TextInputFields
                      icon={Lock}
                      iconColor={themeColors.primaryColor}
                      placeholderText="Password"
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
                </View>
                <TouchableOpacity
                  onPress={() => {
                    router.push("/screens/forgottenPassword");
                  }}
                >
                  <Text
                    style={[
                      tw`font-light`,
                      {
                        color: themeColors.primaryTextColor,
                      },
                    ]}
                  >
                    Forgotten Password
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={[tw`gap-2`]}>
              <View style={[tw`gap-2`]}>
                <PrimaryButton
                  bgColors={themeColors.primaryColor}
                  height={50}
                  textColor="white"
                  onpress={handleSubmit}
                  text={loading ? "Logging in..." : "Continue"}
                  disabled={loading}
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  router.push("/screens"); // Update to your signup route
                }}
              >
                <Text
                  style={[
                    tw`text-center font-light`,
                    {
                      color: themeColors.primaryTextColor,
                    },
                  ]}
                >
                  Don't have an account?
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </SharedLayout>
  );
}
