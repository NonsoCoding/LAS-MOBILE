import PrimaryButton from "@/components/Buttons/PrimaryButton";
import TextInputFields from "@/components/Inputs/TextInputFields";
import SharedLayout from "@/components/Layout/SharedLayout";
import { loginCarrier, resendOtp } from "@/components/services/api/authApi";
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
  Image,
  Platform,
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

export default function UserSignInIndex() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(false);
  const themeColors = Colors[colorScheme ?? "light"];

  const handleLogin = async (values: { email: string; password: string }) => {
    console.log("Login attempt with:", values.email);

    try {
      setLoading(true);
      const res = await loginCarrier(values.email, values.password);
      console.log("Login response:", res);

      if (res.tokens && res.user) {
        if (!res.user.is_email_verified) {
          Alert.alert(
            "Email Not Verified",
            "Please verify your email to continue.",
            [
              {
                text: "Send Code",
                onPress: async () => {
                  try {
                    setLoading(true);
                    const otpRes = await resendOtp(values.email);

                    Alert.alert("Code Sent", "Verification code sent", [
                      {
                        text: "OK",
                        onPress: () => router.push("/screens/Otp"),
                      },
                    ]);
                  } catch (err) {
                    Alert.alert("Error", "Failed to send verification code");
                  } finally {
                    setLoading(false);
                  }
                },
              },
              { text: "Cancel", style: "cancel" },
            ]
          );
        } else {
          await useAuthStore
            .getState()
            .login(res.tokens.access, res.tokens.refresh, res.user);

          router.replace("/(Rider-Drawer)");
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

  const handleGoogleSignIn = () => {
    Alert.alert("Notice", "Google Sign-In coming soon.");
  };

  const handleAppleSignIn = () => {
    Alert.alert("Notice", "Apple Sign-In coming soon.");
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
                  Sign into your Carrier
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
                <TouchableOpacity
                  onPress={handleGoogleSignIn}
                  style={[
                    tw`flex-row items-center justify-center gap-4 py-3 px-4 rounded-lg border border-gray-300`,
                  ]}
                >
                  <Image
                    style={[tw`h-6 w-6`]}
                    source={require("../../../../assets/images/IntroImages/icon/google.png")}
                  />
                  <Text style={[tw`font-light`]}>Continue with Google</Text>
                </TouchableOpacity>

                {Platform.OS === "ios" && (
                  <TouchableOpacity
                    onPress={handleAppleSignIn}
                    style={[
                      tw`flex-row items-center gap-4 justify-center py-3 px-4 rounded-lg border border-gray-300`,
                    ]}
                  >
                    <Image
                      style={[tw`h-6 w-6`]}
                      source={require("../../../../assets/images/IntroImages/icon/apple.png")}
                    />
                    <Text style={[tw`font-light`]}>Continue with Apple</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={[tw`flex-row items-center gap-3`]}>
                <View style={[tw`flex-1 h-px bg-gray-300`]} />
                <Text style={[tw`text-gray-500 text-sm`]}>or</Text>
                <View style={[tw`flex-1 h-px bg-gray-300`]} />
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
                    tw`text-center font-light underline`,
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
