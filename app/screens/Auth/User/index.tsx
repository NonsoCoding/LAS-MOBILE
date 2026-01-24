import PrimaryButton from "@/components/Buttons/PrimaryButton";
import PasswordTextInputFields from "@/components/Inputs/PasswordTextInputField";
import TextInputFields from "@/components/Inputs/TextInputFields";
import { checkCarrierExists } from "@/components/services/api/authApi";
import Colors from "@/constants/Colors";
import tw from "@/constants/tailwind";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from "react-native";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function UserAuthIndex() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];
  const [loading, setLoading] = useState(false);

  const handleContinue = async (values: {
    email: string;
    password: string;
  }) => {
    // Navigate to personal details screen with email and password

    try {
      setLoading(true);

      const exists = await checkCarrierExists(values.email);

      if (exists) {
        Alert.alert(
          "Account Already Exists",
          "An account with this email already exists. Please sign in instead"
        );
        return;
      }
      router.push({
        pathname: "/screens/Auth/User/PersonalDetails",
        params: { email: values.email, password: values.password },
      });
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Unable to validate account. Please try again."
      );
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
    <View style={[tw`flex-1 bg-[#19488A] justify-end`]}>
        <Image
                            source={require("../../../../assets/images/Intro_logo.png")}
                            style={[tw`self-center h-160 w-160 absolute z-999 -top-20`]}
                            resizeMode="contain"
                  />
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleContinue}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={[tw`gap-10 h-110 px-5 justify-center bg-white`, {
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20
          }]}>
              <View style={[tw`items-center gap-2`]}>
              <Text style={[tw`text-xl font-semibold`, {
                  fontFamily: "MontserratBold"
                }]}>Complete Your Profile</Text>
              <Text style={[tw`font-light`, {
                  fontFamily: "MontserratLight"
                }]}>Complete your profile to start your journey!</Text>
              </View>
            <View style={[tw`gap-2`]}>
              <View style={[tw`gap-3`]}>
                <View>
                  <TextInputFields
                    placeholderText="Email"
                    placeholderTextColor="#19488A"
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
                  <PasswordTextInputFields
                    placeholderText="Password"
                    placeholderTextColor="#19488A"
                    value={values.password}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    secureTextEntry={true}
                  />
                  {touched.password && errors.password && (
                    <Text style={[tw`text-red-500 text-xs mt-1`]}>
                      {errors.password}
                    </Text>
                  )}
                </View>
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
            </View>
            <View style={[tw`gap-2`]}>
              <PrimaryButton
                bgColors={themeColors.primaryColor}
                height={50}
                textColor="white"
                text={loading ? "Loading..." : "Continue"}
                onpress={handleSubmit}
                disabled={loading}
              />
              <View style={[tw`flex-row items-center justify-center gap-1`]}>
                <Text style={[tw`font-light`, {
                  fontFamily: "MontserratRegular"
                }]}>Already have an account?</Text>
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
                      fontFamily: "MontserratBold"
                    },
                  ]}
                >
                  Sign In
                </Text>
              </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
}
