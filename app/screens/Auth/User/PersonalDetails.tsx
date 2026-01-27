import PrimaryButton from "@/components/Buttons/PrimaryButton";
import TextInputFields from "@/components/Inputs/TextInputFields";
import { registeredUser } from "@/components/services/api/authApi";
import useAuthStore from "@/components/store/authStore";
import Colors from "@/constants/Colors";
import tw from "@/constants/tailwind";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Formik } from "formik";
import { Upload, User } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .required("Last name is required"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10,15}$/, "Please enter a valid phone number")
    .required("Phone number is required"),
});

interface DocumentState {
  government_id: any;
}

export default function UserPersonalDetailsIndex() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];
  const [documents, setDocuments] = useState<DocumentState>({
    government_id: null,
  });

  // Get email and password from previous screen
  const params = useLocalSearchParams();
  const { email, password } = params;

  const [loading, setLoading] = useState(false);

  const pickDocument = async (documentType: keyof DocumentState) => {
    try {
      // Request permissions first
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant permission to access your files"
        );
        return;
      }

      // Show options to pick from gallery or documents
      Alert.alert("Select Document", "Choose source", [
        {
          text: "Photo Library",
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              quality: 0.8,
            });

            if (!result.canceled) {
              setDocuments((prev) => ({
                ...prev,
                [documentType]: result.assets[0],
              }));
            }
          },
        },
        {
          text: "Documents",
          onPress: async () => {
            const result = await DocumentPicker.getDocumentAsync({
              type: ["image/*", "application/pdf"],
              copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
              setDocuments((prev) => ({
                ...prev,
                [documentType]: result.assets[0],
              }));
            }
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]);
    } catch (error) {
      console.error("Error picking document:", error);
      Alert.alert("Error", "Failed to pick document. Please try again.");
    }
  };

  const handleContinue = async (values: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
  }) => {
    // Validate that government ID is uploaded
    if (!documents.government_id) {
      Alert.alert("Missing Document", "Please upload your Government ID");
      return;
    }

    const formData = new FormData();

    // Append text fields
    formData.append("email", email as string);
    formData.append("password", password as string);
    formData.append("password_confirm", password as string);
    formData.append("first_name", values.firstName);
    formData.append("last_name", values.lastName);
    formData.append("phone_number", values.phoneNumber);

    // Append document file
    if (documents.government_id) {
      const fileData: any = {
        uri: documents.government_id.uri,
        type: documents.government_id.mimeType || "image/jpeg",
        name: documents.government_id.name || "government_id.jpg",
      };
      formData.append("government_id", fileData);
    }

    setLoading(true);

    try {
      const response = await registeredUser(formData);

      if (
        response.success ||
        response.user ||
        response.token ||
        response.tokens
      ) {
        // Save tokens and user data to auth store
        if (response.tokens && response.user) {
          await useAuthStore
            .getState()
            .login(
              response.tokens.access,
              response.tokens.refresh,
              response.user
            );
        }

        Alert.alert(
          "Success",
          "An OTP has been sent to your email. Please verify"
        );
        router.replace("/screens/Auth/User/Otp");
      } else {
        Alert.alert(
          "Registration Failed",
          response.message || "Something went wrong. Please try again."
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message ||
          "Network error. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const documentFields = [
    { key: "government_id" as keyof DocumentState, label: "Government ID" },
  ];

  return (
    <>
      {loading ? (
        <View style={[tw`flex-1 items-center justify-center`]}>
          <ActivityIndicator size="large" color={themeColors.tint} />
        </View>
      ) : (
        <View style={[tw`flex-1`]}
        >
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              phoneNumber: "",
            }}
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
                <View style={[tw`flex-1 justify-end gap-8 pt-10 bg-[#19488A]`]}>
                   <Image
                                        source={require("../../../../assets/images/Intro_logo.png")}
                                        style={[tw`self-center h-140 w-140 absolute -top-15`]}
                                        resizeMode="contain"
                  />
                  <View style={[tw`px-5 bg-white py-10 pb-15 gap-10 justify-center`, {
                    borderTopRightRadius: 20,
                    borderTopLeftRadius: 20,
                  }]}>
                     <View style={[tw`items-center gap-2`]}>
              <Text
                style={[
                  tw`text-xl font-semibold`,
                  {
                    fontFamily: "MontserratBold",
                  },
                ]}
              >
                Complete Your Profile
              </Text>
              <Text
                style={[
                  tw`font-light`,
                  {
                    fontFamily: "MontserratLight",
                  },
                ]}
              >
                Complete your profile to start your journey!
              </Text>
            </View>
                <View style={[tw`gap-10`]}>
                  <View style={[tw`gap-4`]}>
                    <View>
                      <TextInputFields
                        icon={User}
                        iconColor={themeColors.primaryTextColor}
                        iconSize={18}
                        value={values.firstName}
                        onChangeText={handleChange("firstName")}
                        onBlur={handleBlur("firstName")}
                        placeholderText="FirstName"
                      />
                      {touched.firstName && errors.firstName && (
                        <Text style={[tw`text-red-500 text-xs mt-1`]}>
                          {errors.firstName}
                        </Text>
                      )}
                    </View>
                    <View>
                      <TextInputFields
                        icon={User}
                        iconColor={themeColors.primaryColor}
                        iconSize={18}
                        value={values.lastName}
                        onChangeText={handleChange("lastName")}
                        onBlur={handleBlur("lastName")}
                        placeholderText="LastName"
                      />
                      {touched.lastName && errors.lastName && (
                        <Text style={[tw`text-red-500 text-xs mt-1`]}>
                          {errors.lastName}
                        </Text>
                      )}
                    </View>
                    {/* <View>
                      <TextInputFields
                        icon={Phone}
                        iconColor={themeColors.primaryColor}
                        iconSize={18}
                        value={values.phoneNumber}
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
                    </View> */}
                    <View style={[tw`gap-4`]}>
                      {documentFields.map((field) => (
                        <TouchableOpacity
                          key={field.key}
                          style={[
                            tw` py-3 px-4 bg-gray-50 rounded-sm border border-gray-200`,
                            documents[field.key] &&
                              tw`bg-green-50 border-green-300`,
                          ]}
                          onPress={() => pickDocument(field.key)}
                          activeOpacity={0.7}
                        >
                          <View
                            style={[tw`flex-row items-center justify-between`]}
                          >
                            <Text
                              style={[
                                tw`text-base`,
                                documents[field.key]
                                  ? tw`text-green-700 font-medium`
                                  : tw`text-gray-700`,
                              ]}
                            >
                              {field.label}
                            </Text>

                            <View
                              style={[
                                tw`p-2 rounded-full`,
                                documents[field.key]
                                  ? tw`bg-green-100`
                                  : tw`bg-blue-100`,
                              ]}
                            >
                              <Upload
                                size={20}
                                color={
                                  documents[field.key] ? "#15803d" : "#003C7A"
                                }
                              />
                            </View>
                          </View>
                          {Object.entries(documents).map(([key, doc]) =>
                            doc ? (
                              <View
                                key={key}
                                style={[tw`flex-row items-center`]}
                              >
                                <Text style={[tw`text-sm text-green-700`]}>
                                  {doc.name || `${key}.jpg`}
                                </Text>
                              </View>
                            ) : null
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
                <View>
                  <PrimaryButton
                    bgColors={themeColors.primaryColor}
                    height={50}
                        onpress={() => {
                      router.replace("/(tabs)")
                    }}
                    textColor={themeColors.text}
                    text={loading ? "Creating Account..." : "Create Account"}
                    disabled={loading}
                  />
                </View>
                  </View>
              </View>
            )}
          </Formik>
        </View>
      )}
    </>
  );
}
