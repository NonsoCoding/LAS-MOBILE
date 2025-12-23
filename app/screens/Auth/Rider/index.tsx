import PrimaryButton from "@/components/Buttons/PrimaryButton";
import PasswordTextInputFields from "@/components/Inputs/PasswordTextInputField";
import TextInputFields from "@/components/Inputs/TextInputFields";
import SharedLayout from "@/components/Layout/SharedLayout";
import Colors from "@/constants/Colors";
import tw from "@/constants/tailwind";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Formik } from "formik";
import { AtSign, Car, Lock, Phone, User } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .required("Last name is required"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10,15}$/, "Please enter a valid phone number")
    .required("Phone number is required"),
  plateNumber: Yup.string()
    .min(3, "Plate number must be at least 3 characters")
    .required("Plate number is required"),
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

  const handleSubmit = async (values: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    plateNumber: string;
  }) => {
    router.push({
      pathname: "/screens/Auth/Rider/Verification",
      params: {
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
        plateNumber: values.plateNumber,
        indemnityAccepted: params.indemnityAccepted,
        indemnityAcceptedAt: params.indemnityAcceptedAt,
        indemnityVersion: params.indemnityVersion,
      },
    });
  };

  const handleGoogleSignIn = () => {
    Alert.alert("Notice", "Google Sign-In coming soon.");
  };

  const handleAppleSignIn = () => {
    Alert.alert("Notice", "Apple Sign-In coming soon.");
  };

  return (
    <>
      {loading ? (
        <View style={[tw`flex-1 items-center justify-center`]}>
          <ActivityIndicator size="large" color={themeColors.tint} />
        </View>
      ) : (
        <SharedLayout>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={[tw`flex-1`]}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[tw`flex-grow`]}
              keyboardShouldPersistTaps="handled"
            >
              <Formik
                initialValues={{
                  email: "",
                  password: "",
                  firstName: "",
                  lastName: "",
                  phoneNumber: "",
                  plateNumber: "",
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
                  <View style={[tw`flex-1 pt-6 pb-6 gap-6`]}>
                    {/* Header Section */}
                    <View style={[tw`gap-2`]}>
                      <Text style={[tw`text-3xl font-bold text-[#003C7A]`]}>
                        Sign Up as a Carrier
                      </Text>
                      <Text style={[tw`text-3xl font-bold text-[#CC1A21]`]}>
                        Create account
                      </Text>
                      <Text style={[tw`font-light text-sm`]}>
                        Fill in your details to create your account
                      </Text>
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
                        <Text style={[tw`font-light text-sm`]}>Google</Text>
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
                          <Text style={[tw`font-light text-sm`]}>Apple</Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    {/* Divider */}
                    <View style={[tw`flex-row items-center gap-3`]}>
                      <View style={[tw`flex-1 h-px bg-gray-300`]} />
                      <Text style={[tw`text-gray-500 text-xs`]}>or</Text>
                      <View style={[tw`flex-1 h-px bg-gray-300`]} />
                    </View>

                    {/* Form Fields */}
                    <View style={[tw`gap-3`]}>
                      <View>
                        <TextInputFields
                          icon={AtSign}
                          iconColor={themeColors.primaryColor}
                          placeholderText="Email"
                          iconSize={18}
                          value={values.email}
                          placeholderTextColor="black"
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
                          icon={Lock}
                          iconColor={themeColors.primaryColor}
                          placeholderText="Password"
                          iconSize={18}
                          placeholderTextColor="black"
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

                      <View style={[tw`flex-row gap-2`]}>
                        <View style={[tw`flex-1`]}>
                          <TextInputFields
                            icon={User}
                            iconColor={themeColors.primaryColor}
                            iconSize={18}
                            value={values.firstName}
                            placeholderTextColor="black"
                            onChangeText={handleChange("firstName")}
                            onBlur={handleBlur("firstName")}
                            placeholderText="First Name"
                          />
                          {touched.firstName && errors.firstName && (
                            <Text style={[tw`text-red-500 text-xs mt-1`]}>
                              {errors.firstName}
                            </Text>
                          )}
                        </View>

                        <View style={[tw`flex-1`]}>
                          <TextInputFields
                            icon={User}
                            iconColor={themeColors.primaryColor}
                            iconSize={18}
                            placeholderTextColor="black"
                            value={values.lastName}
                            onChangeText={handleChange("lastName")}
                            onBlur={handleBlur("lastName")}
                            placeholderText="Last Name"
                          />
                          {touched.lastName && errors.lastName && (
                            <Text style={[tw`text-red-500 text-xs mt-1`]}>
                              {errors.lastName}
                            </Text>
                          )}
                        </View>
                      </View>

                      <View>
                        <TextInputFields
                          icon={Phone}
                          iconColor={themeColors.primaryColor}
                          iconSize={18}
                          value={values.phoneNumber}
                          placeholderTextColor="black"
                          onChangeText={handleChange("phoneNumber")}
                          onBlur={handleBlur("phoneNumber")}
                          placeholderText="+234 9163440787"
                          keyboardType="phone-pad"
                        />
                        {touched.phoneNumber && errors.phoneNumber && (
                          <Text style={[tw`text-red-500 text-xs mt-1`]}>
                            {errors.phoneNumber}
                          </Text>
                        )}
                      </View>

                      <View>
                        <TextInputFields
                          icon={Car}
                          iconColor={themeColors.primaryColor}
                          iconSize={18}
                          placeholderTextColor="black"
                          value={values.plateNumber}
                          onChangeText={handleChange("plateNumber")}
                          onBlur={handleBlur("plateNumber")}
                          placeholderText="Plate Number (e.g., LAS-12345)"
                          autoCapitalize="characters"
                        />
                        {touched.plateNumber && errors.plateNumber && (
                          <Text style={[tw`text-red-500 text-xs mt-1`]}>
                            {errors.plateNumber}
                          </Text>
                        )}
                      </View>
                    </View>

                    {/* Bottom Section */}
                    <View style={[tw`gap-3 mt-4`]}>
                      <PrimaryButton
                        bgColors={themeColors.primaryColor}
                        height={50}
                        textColor="white"
                        text="Continue to Verification"
                        onpress={handleSubmit}
                        disabled={loading}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          router.push("/screens/Auth/Rider/RiderSignIn");
                        }}
                      >
                        <Text
                          style={[
                            tw`text-center font-light underline text-sm`,
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
            </ScrollView>
          </KeyboardAvoidingView>
        </SharedLayout>
      )}
    </>
  );
}
