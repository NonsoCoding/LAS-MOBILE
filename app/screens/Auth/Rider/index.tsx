import PrimaryButton from "@/components/Buttons/PrimaryButton";
import PasswordTextInputFields from "@/components/Inputs/PasswordTextInputField";
import TextInputFields from "@/components/Inputs/TextInputFields";
import { checkCarrierExists } from "@/components/services/api/authApi";
import Colors from "@/constants/Colors";
import { fontFamily } from "@/constants/fonts";
import tw from "@/constants/tailwind";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Formik } from "formik";
import { AtSign, Lock } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
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

export default function RiderAuthIndex() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (params.indemnityAccepted !== "true") {
      Alert.alert(
        "Agreement Required",
        "You must accept the indemnity agreement first.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    }
  }, []);

  // const handleSubmit = async (values: {
  //   email: string;
  //   password: string;
  //   firstName: string;
  //   lastName: string;
  //   phoneNumber: string;
  //   plateNumber: string;
  // }) => {
  //   try {
  //     setLoading(true);

  //     const exists = await checkCarrierExists(values.email);

  //     if (exists) {
  //       Alert.alert(
  //         "Account Already Exists",
  //         "An account with this email and plate number already exists. Please sign in instead"
  //       );
  //       return;
  //     }
  //     router.push({
  //       pathname: "/screens/Auth/Rider/Verification",
  //       params: {
  //         email: values.email,
  //         password: values.password,
  //         firstName: values.firstName,
  //         lastName: values.lastName,
  //         phoneNumber: values.phoneNumber,
  //         plateNumber: values.plateNumber,
  //         indemnityAccepted: params.indemnityAccepted,
  //         indemnityAcceptedAt: params.indemnityAcceptedAt,
  //         indemnityVersion: params.indemnityVersion,
  //       },
  //     });
  //   } catch (error: any) {
  //     Alert.alert(
  //       "Error",
  //       error.message || "Unable to validate account. Please try again."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
  
  const handleSubmit = async (values: {
    email: string;
    password: string;
  }) => {
    try {
      setLoading(true);

      const exists = await checkCarrierExists(values.email);

      if (exists) {
        Alert.alert(
          "Account Already Exists",
          "An account with this email and plate number already exists. Please sign in instead"
        );
        return;
      }
      router.push({
        pathname: "/screens/Auth/Rider/PersonalDetails",
        params: {
          email: values.email,
          password: values.password,
          indemnityAccepted: params.indemnityAccepted,
          indemnityAcceptedAt: params.indemnityAcceptedAt,
          indemnityVersion: params.indemnityVersion,
        },
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
    <View style={[tw`flex-1 bg-[#19488A]`]}>
      <Image
              source={require("../../../../assets/images/Intro_logo.png")}
              style={[tw`self-center h-150 w-150 absolute -top-20`]}
              resizeMode="contain"
            />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[tw`flex-1 justify-end`]}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
     
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View style={[tw`pt-10 pb-15 gap-6 bg-white px-5 rounded-t-2xl`]}>
              
                {/* Form Fields */}
                <View style={[tw`gap-6`]}>
                  <View style={[tw`items-center gap-2`]}>
                    <Text style={[tw`text-2xl`, {
                      fontFamily: fontFamily.Bold
                    }]}>Create an account</Text>
                    <Text style={[tw`text-center`, {
                      fontFamily: fontFamily.Light
                    }]}>Welcome back to Africa's Trusted Delivery Network.</Text>
                </View>
                <View style={[tw`gap-3`]}>
                  <View>
                    <TextInputFields
                      icon={AtSign}
                      iconColor={themeColors.primaryColor}
                      placeholderText="email"
                      iconSize={18}
                      value={values.email}
                      placeholderTextColor={"#19488A"}
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                    {touched.email && errors.email && (
                      <Text style={[tw`text-red-500 text-xs mt-1 ml-4`, { fontFamily: fontFamily.Regular }]}>
                        {errors.email}
                      </Text>
                    )}
                  </View>

                  <View>
                    <PasswordTextInputFields
                      icon={Lock}
                      iconColor={themeColors.primaryColor}
                      placeholderText="password"
                      iconSize={18}
                       placeholderTextColor={"#19488A"}
                      value={values.password}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      secureTextEntry={true}
                    />
                    {touched.password && errors.password && (
                      <Text style={[tw`text-red-500 text-xs mt-1 ml-4`, { fontFamily: fontFamily.Regular }]}>
                        {errors.password}
                      </Text>
                    )}
                  </View>
                </View>
                </View>

                <View style={[tw`flex-row items-center gap-3`]}>
                  <View style={[tw`flex-1 h-px bg-gray-300`]} />
                  <Text style={[tw`text-gray-500 text-xs`, { fontFamily: fontFamily.Regular }]}>or</Text>
                  <View style={[tw`flex-1 h-px bg-gray-300`]} />
                </View>

                {/* Social Login Buttons */}
                <View style={[tw`gap-2 flex-row`]}>
                  <TouchableOpacity
                    onPress={handleGoogleSignIn}
                    style={[
                      tw`flex-row items-center justify-center gap-1.5 py-2.5 flex-1 rounded-lg border border-gray-300`,
                    ]}
                  >
                    <Image
                      style={[tw`h-5 w-5`]}
                      source={require("../../../../assets/images/IntroImages/icon/google.png")}
                    />
                    <Text style={[tw`text-sm`, { fontFamily: fontFamily.Light }]}>Google</Text>
                  </TouchableOpacity>

                  {Platform.OS === "ios" && (
                    <TouchableOpacity
                      onPress={handleAppleSignIn}
                      style={[
                        tw`flex-row items-center gap-1.5 justify-center py-2.5 flex-1 rounded-lg border border-gray-300`,
                      ]}
                    >
                      <Image
                        style={[tw`h-5 w-5`]}
                        source={require("../../../../assets/images/IntroImages/icon/apple.png")}
                      />
                      <Text style={[tw`text-sm`, { fontFamily: fontFamily.Light }]}>Apple</Text>
                    </TouchableOpacity>
                  )}
              </View>
               <View style={[tw`gap-2`]}>
                <PrimaryButton
                  bgColors={themeColors.primaryColor}
                  height={50}
                  textColor="white"
                  onpress={() => {
                    handleSubmit();
                  }}
                  text={loading ? "Loading..." : "Continue"}
                  disabled={loading}
                />
              </View>
               <View style={[tw`flex-row items-center justify-center gap-1`]}>
                    <Text style={[tw``, {
                  fontFamily: fontFamily.Light
                }]}>Already have an account?</Text>
              <TouchableOpacity
                onPress={() => {
                   router.replace("/screens/Auth/Rider/RiderSignIn"); // Update to your signup route
                }}
              >
                <Text
                  style={[
                    tw`text-center`,
                    {
                      color: themeColors.primaryTextColor,
                      fontFamily: fontFamily.Bold
                    },
                  ]}
                >
                  Sign In
                </Text>
              </TouchableOpacity>
              </View>
              </View>
            )}
          </Formik>
       
      </KeyboardAvoidingView>
    </View>
  );
}
