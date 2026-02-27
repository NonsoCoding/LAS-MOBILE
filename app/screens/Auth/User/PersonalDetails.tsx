import PrimaryButton from "@/components/Buttons/PrimaryButton";
import TextInputFields from "@/components/Inputs/TextInputFields";
import { registeredUser } from "@/components/services/api/authApi";
import useAuthStore from "@/components/store/authStore";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { fontFamily } from "@/constants/fonts";
import tw from "@/constants/tailwind";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Formik } from "formik";
import { CheckCircle2, Eye, FileText, Trash2, Upload, User, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .required("Last name is required"),
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
  const {phoneNumber, role} = useAuthStore();

  // Get email and password from previous screen
  const params = useLocalSearchParams();
  const { email, password } = params;
  const [previewImage, setPreviewImage] = useState<string | null>(null);


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
    formData.append("first_name", values.firstName as string);
    formData.append("last_name", values.lastName as string);
    formData.append("phone_number", phoneNumber as string);
    formData.append("role", role as string);

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
              { ...response.user, role: "shipper" }
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
        <View style={[tw`flex-1`]}
        >
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
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
            <View style={[tw`px-5 py-10 pb-15 gap-10 justify-center`, {
                    backgroundColor: themeColors.background,
                    borderTopRightRadius: 20,
                    borderTopLeftRadius: 20,
                  }]}>
                     <View style={[tw`items-center gap-2`]}>
              <Text
                style={[
                  tw`text-xl`,
                  {
                    fontFamily: fontFamily.Bold,
                    color: themeColors.text,
                  },
                ]}
              >
                Complete Your Profile
              </Text>
              <Text
                style={[
                  tw``,
                    {
                    color: themeColors.text,
                    fontFamily: fontFamily.Light,
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
                        iconColor={themeColors.text}
                        iconSize={18}
                        value={values.firstName}
                        onChangeText={handleChange("firstName")}
                        onBlur={handleBlur("firstName")}
                        placeholderText="FirstName"
                      />
                      {touched.firstName && errors.firstName && (
                        <Text style={[tw`text-red-500 text-xs mt-1`, { fontFamily: fontFamily.Regular }]}>
                          {errors.firstName}
                        </Text>
                      )}
                    </View>
                    <View>
                      <TextInputFields
                        icon={User}
                        iconColor={themeColors.text}
                        iconSize={18}
                        value={values.lastName}
                        onChangeText={handleChange("lastName")}
                        onBlur={handleBlur("lastName")}
                        placeholderText="LastName"
                      />
                      {touched.lastName && errors.lastName && (
                        <Text style={[tw`text-red-500 text-xs mt-1`, { fontFamily: fontFamily.Regular }]}>
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
                {documentFields.map((field) => {
                  const isSelected = !!documents[field.key];
                  const doc = documents[field.key];
                  const isImage = doc?.type?.startsWith("image") || doc?.mimeType?.startsWith("image") || (doc?.uri && !doc.uri.toLowerCase().endsWith(".pdf"));

                  return (
                    <View key={field.key} style={[tw`mb-0`]}>
                      <TouchableOpacity
                        style={[
                          tw`p-4 rounded-xl border border-gray-100`,
                          isSelected ? tw`border-blue-500 bg-blue-50/10` : tw`border-gray-200`,
                          , {
                          backgroundColor: themeColors.background,
                        }]}
                        onPress={() => {
                          if (!isSelected) {
                            pickDocument(field.key);
                          } else if (isImage) {
                            setPreviewImage(doc.uri);
                          }
                        }}
                        activeOpacity={0.7}
                      >
                        <View style={[tw`flex-row items-center justify-between`]}>
                          <View style={[tw`flex-row items-center flex-1`]}>
                            <View
                              style={[
                                tw`w-12 h-12 rounded-full items-center justify-center mr-4`,
                                isSelected ? tw`bg-blue-100` : tw`bg-gray-50`,
                              ]}
                            >
                              {isSelected ? (
                                isImage ? (
                                  <Image 
                                    source={{ uri: doc.uri }} 
                                    style={[tw`w-12 h-12 rounded-full`]} 
                                  />
                                ) : (
                                  <CheckCircle2 size={24} color="#3b82f6" />
                                )
                              ) : (
                                <FileText size={24} color="#64748b" />
                              )}
                            </View>

                            <View style={[tw`flex-1`]}>
                              <Text
                                style={[
                                  tw`text-base text-gray-900`,
                                  { color: themeColors.text, fontFamily: fontFamily.Bold },
                                ]}
                              >
                                {field.label}
                              </Text>
                              <Text
                                style={[
                                  tw`text-xs text-gray-500 mt-0.5`,
                                  { fontFamily: fontFamily.Regular },
                                ]}
                                numberOfLines={1}
                              >
                                {isSelected
                                  ? doc.name || `${field.label} uploaded`
                                  : `Upload your ${field.label.toLowerCase()}`}
                              </Text>
                            </View>
                          </View>

                          <View style={[tw`flex-row items-center gap-3`]}>
                            {isSelected && isImage && (
                              <TouchableOpacity 
                                onPress={() => setPreviewImage(doc.uri)}
                                style={[tw`p-2 bg-blue-100 rounded-full`]}
                              >
                                <Eye size={18} color="#3b82f6" />
                              </TouchableOpacity>
                            )}
                            
                            {!isSelected ? (
                              <Upload size={20} color="#94a3b8" />
                            ) : (
                              <TouchableOpacity
                                onPress={() =>
                                  setDocuments((prev) => ({
                                    ...prev,
                                    [field.key]: null,
                                  }))
                                }
                                style={[tw`p-2 bg-red-50 rounded-full`]}
                              >
                                <Trash2 size={18} color="#ef4444" />
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
                  </View>
                </View>
                <View>
                  <PrimaryButton
                    bgColors={themeColors.primaryColor}
                    height={50}
                        onpress={() => {
                          handleSubmit();
                    }}
                    textColor={themeColors.text}
                    text={loading ? "Creating Account..." : "Create Account"}
                    disabled={loading}
                  />
                    </View>
                    <Modal
              visible={!!previewImage}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setPreviewImage(null)}
            >
              <View style={[tw`flex-1 bg-black/90 justify-center items-center`]}>
                <TouchableOpacity
                  style={[tw`absolute top-12 right-6 z-10 p-2 bg-white/20 rounded-full`]}
                  onPress={() => setPreviewImage(null)}
                >
                  <X size={24} color="white" />
                </TouchableOpacity>
                {previewImage && (
                  <Image
                    source={{ uri: previewImage }}
                    style={[tw`w-full h-3/4`]}
                    resizeMode="contain"
                  />
                )}
              </View>
            </Modal>
                  </View>
              </View>
            )}
          </Formik>
        </View>
  );
}
