import PrimaryButton from "@/components/Buttons/PrimaryButton";
import TextInputFields from "@/components/Inputs/TextInputFields";
import SharedLayout from "@/components/Layout/SharedLayout";
import Colors from "@/constants/Colors";
import tw from "@/constants/tailwind";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import { AtSign, Lock } from "lucide-react-native";
import React from "react";
import {
  Alert,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
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

  const handleContinue = (values: { email: string; password: string }) => {
    // Navigate to personal details screen with email and password
    router.push({
      pathname: "/screens/Auth/User/PersonalDetails",
      params: { email: values.email, password: values.password },
    });
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
          <View style={[tw`flex-1 pt-10 gap-10 justify-between`]}>
            <View style={[tw`gap-10`]}>
              <View style={[tw`gap-3`]}>
                <Text style={[tw`text-3xl font-bold text-[#003C7A]`]}>
                  Sign Up as a Shipper
                </Text>
                <Text style={[tw`text-3xl font-bold text-[#CC1A21]`]}>
                  Create account
                </Text>
                <Text style={[tw`font-light`]}>
                  Kindly provide your valid email and password to proceed
                </Text>
              </View>

              {/* Social Login Buttons */}
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

              {/* Divider */}
              <View style={[tw`flex-row items-center gap-3`]}>
                <View style={[tw`flex-1 h-px bg-gray-300`]} />
                <Text style={[tw`text-gray-500 text-sm`]}>or</Text>
                <View style={[tw`flex-1 h-px bg-gray-300`]} />
              </View>

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
            </View>
            <View style={[tw`gap-2`]}>
              <PrimaryButton
                bgColors={themeColors.primaryColor}
                height={50}
                textColor="white"
                text="Continue"
                onpress={handleSubmit}
              />
              <TouchableOpacity
                onPress={() => {
                  router.replace("/screens/Auth/User/SignIn");
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
                  Already have an account?
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </SharedLayout>
  );
}
