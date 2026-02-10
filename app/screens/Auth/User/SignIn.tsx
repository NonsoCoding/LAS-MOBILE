import PrimaryButton from "@/components/Buttons/PrimaryButton";
import PasswordTextInputFields from "@/components/Inputs/PasswordTextInputField";
import TextInputFields from "@/components/Inputs/TextInputFields";
import { loginUser, resendOtp } from "@/components/services/api/authApi";
import useAuthStore from "@/components/store/authStore";
import yup from "@/components/utils/formik";
import Colors from "@/constants/Colors";
import tw from "@/constants/tailwind";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View
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
                            onPress: () => router.push({
                              pathname: "/screens/Auth/User/Otp",
                              params: {
                                email: values.email,
                                
                              }
                            }),
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
              onPress: () => router.push("/(drawer)"),
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

  const handleGoogleSignIn = () => {
    // Implement Google Sign-In logic here
    console.log("Google Sign-In");
  };

  const handleAppleSignIn = () => {
    // Implement Apple Sign-In logic here
    console.log("Apple Sign-In");
  };

  return (
    <KeyboardAvoidingView 
      style={[tw`flex-1 bg-[#19488A]`]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[tw`flex-1`]}>
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
              <View style={[tw`flex-1 pt-10 gap-10 justify-end`]}>
                <Image
                  source={require("../../../../assets/images/Intro_logo.png")}
                  style={[tw`self-center h-140 w-140 absolute z-999 -top-15`]}
                  resizeMode="contain"
                />
                <ScrollView
                  contentContainerStyle={[tw`flex-grow justify-end`]}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  <View style={[tw`bg-white px-5 py-10 pb-15 justify-center gap-15`, {
                    borderTopRightRadius: 20,
                    borderTopLeftRadius: 20
                  }]}>
                    <View style={[tw`gap-5`]}>
                      <View style={[tw`items-center gap-3`]}>
                        <Text style={[tw`text-2xl font-semibold`, {
                          fontFamily: "MontserratBold"
                        }]}>Log In</Text>
                        <Text style={[tw`w-[80%] text-center font-light`, {
                          fontFamily: "MontserratLight"
                        }]}>Welcome back to Africa's Trusted Delivery Network.</Text>
                      </View>
                      <View style={[tw`gap-3`]}>
                        <View style={[tw`gap-3`]}>
                          <View>
                            <TextInputFields
                              placeholderText="email or phone"
                              placeholderTextColor={"#19488A"}
                              value={values.email}
                              onChangeText={handleChange("email")}
                              onBlur={handleBlur("email")}
                              keyboardType="email-address"
                              autoCapitalize="none"
                            />
                            {touched.email && errors.email && (
                              <Text style={[tw`text-red-500 text-xs mt-1`, {
                                fontFamily: "MontserratRegular"
                              }]}>
                                {errors.email}
                              </Text>
                            )}
                          </View>
                          <View>
                            <PasswordTextInputFields
                              placeholderText="password"
                              placeholderTextColor="#19488A"
                              value={values.password}
                              onChangeText={handleChange("password")}
                              onBlur={handleBlur("password")}
                              secureTextEntry={true}
                            />
                            {touched.password && errors.password && (
                              <Text style={[tw`text-red-500 text-xs mt-1`, {
                                fontFamily: "MontserratRegular"
                              }]}>
                                {errors.password}
                              </Text>
                            )}
                          </View>
                        </View>
                        <TouchableOpacity
                          style={[tw`self-end`]}
                          onPress={() => {
                            router.push("/screens/forgottenPassword");
                          }}
                        >
                          <Text
                            style={[
                              tw`font-light text-[#CC1A21]`,
                              {
                                fontFamily: "MontserratLight"
                              }
                            ]}
                          >
                            Forgotten Password?
                          </Text>
                        </TouchableOpacity>
                      </View>
                      {/* <View style={[tw`flex-row items-center gap-3`]}>
                        <View style={[tw`flex-1 h-px bg-gray-300`]} />
                        <Text style={[tw`text-gray-500 text-sm`]}>or</Text>
                        <View style={[tw`flex-1 h-px bg-gray-300`]} />
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
                      </View> */}
                      <View style={[tw`gap-2`]}>
                        <View style={[tw`gap-2`]}>
                          <PrimaryButton
                            bgColors={themeColors.primaryColor}
                            height={50}
                            textColor="white"
                            onpress={handleSubmit}
                            text={loading ? "Signing in..." : "Sign In"}
                            disabled={loading}
                          />
                        </View>
                        <View style={[tw`flex-row items-center justify-center gap-1`]}>
                          <Text style={[tw`font-light`, {
                            fontFamily: "MontserratLight"
                          }]}>Don't have an account?</Text>
                          <TouchableOpacity
                            onPress={() => {
                              router.replace("/screens/Auth/User/PersonalDetails"); // Update to your signup route
                            }}
                          >
                            <Text
                              style={[
                                tw`text-center font-semibold`,
                                {
                                  color: themeColors.primaryTextColor,
                                  fontFamily: "MontserratBold"
                                },
                              ]}
                            >
                              Sign Up
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                </ScrollView>
              </View>
            )}
          </Formik>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}