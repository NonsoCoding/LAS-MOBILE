import PrimaryButton from "@/components/Buttons/PrimaryButton";
import CompleteModal from "@/components/Modals/CompleteModal";
import { registeredUser } from "@/components/services/api/authApi";
import useAuthStore from "@/components/store/authStore";
import Colors from "@/constants/Colors";
import { fontFamily } from "@/constants/fonts";
import tw from "@/constants/tailwind";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckCircle2, Eye, FileText, Trash2, Upload, X } from "lucide-react-native";
import { useState } from "react";
import {
    Alert,
    Image,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    useColorScheme,
    View
} from "react-native";

interface DocumentState {
  government_id: any;
  drivers_license: any;
  proof_of_address: any;
  work_authorization: any;
}

const Verification = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];
  const [completeModalVisible, setCompleteModalVisible] = useState(false);
  const { phoneNumber, role } = useAuthStore();
  const [documents, setDocuments] = useState<DocumentState>({
    government_id: null,
    drivers_license: null,
    proof_of_address: null,
    work_authorization: null,
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const pickDocument = async (documentType: keyof DocumentState) => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant permission to access your files"
        );
        return;
      }

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

  const handleSubmit = async () => {
    const missingDocs = Object.entries(documents).filter(
      ([_, value]) => value === null
    );

    if (missingDocs.length > 0) {
      Alert.alert(
        "Missing Documents",
        "Please upload all required documents before proceeding."
      );
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      // Add text fields
      formData.append("email", params.email as string);
      formData.append("password", params.password as string);
      formData.append("password_confirm", params.password as string);
      formData.append("first_name", params.firstName as string);
      formData.append("last_name", params.lastName as string);
      formData.append("phone_number", phoneNumber as string);
      formData.append("plate_number", params.plateNumber as string);
      formData.append("role", role as string);

      // Convert indemnity to boolean properly
      // params are always strings from useLocalSearchParams
      const indemnityAccepted = params.indemnityAccepted === "true";

      // Try sending as actual boolean (works with some backends)
      // If this doesn't work, the backend needs to accept "true"/"false" strings
      formData.append("indemnity_accepted", String(indemnityAccepted));

      console.log("Registration data:", {
        email: params.email,
        firstName: params.firstName,
        lastName: params.lastName,
        phoneNumber: phoneNumber,
        plateNumber: params.plateNumber,
        role: role,
        indemnityAccepted: indemnityAccepted,
        indemnityAcceptedType: typeof indemnityAccepted,
      });

      // Add document files
      Object.entries(documents).forEach(([key, doc]) => {
        if (doc) {
          const fileData: any = {
            uri: doc.uri,
            type: doc.mimeType || "image/jpeg",
            name: doc.name || `${key}.jpg`,
          };
          formData.append(key, fileData);
        }
      });

      const response = await registeredUser(formData);

      console.log("Registration response:", response);

      if (
        response.success ||
        response.user ||
        response.token ||
        response.tokens
      ) {
        if (response.tokens && response.user) {
          await useAuthStore
            .getState()
            .login(
              response.tokens.access,
              response.tokens.refresh,
              { ...response.user, role: "carrier" }
            );
        }
        Alert.alert(
          "Success",
          "Your account has been created successfully! Please check your email for verification code.",
          [
            {
              text: "OK",
              onPress: () => router.replace({
                pathname: "/screens/Auth/Rider/Otp",
                params: {
                  email: params.email,
                },
              }),
            },
          ]
        );
      } else {
        Alert.alert(
          "Registration Failed",
          response.message || "Something went wrong. Please try again."
        );
      }
    } catch (error: any) {
      console.error("Registration error:", error);
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
    { key: "drivers_license" as keyof DocumentState, label: "Drivers License" },
    {
      key: "proof_of_address" as keyof DocumentState,
      label: "Proof of Address",
    },
    {
      key: "work_authorization" as keyof DocumentState,
      label: "Work Authorization",
    },
  ];

  return (
    <View style={[tw`flex-1 bg-[#19488A]`]}>
       <Image
              source={require("../../../../assets/images/Intro_logo.png")}
              style={[tw`self-center h-150 w-150 absolute -top-20`]}
              resizeMode="contain"
            />
     
        <ScrollView
          style={[tw``]}
          contentContainerStyle={[tw`pt-10 flex-1 justify-end`]} // Add pb-10 to push content up
          showsVerticalScrollIndicator={false}
        >
          <View style={[tw`px-5 bg-white py-10 pb-15 rounded-t-2xl`]}>
              <View style={[tw`gap-8`]}>
                <View style={[tw`items-center gap-2`]}>
                    <Text style={[tw`text-2xl`, {
                      fontFamily: fontFamily.Bold
                    }]}>Verify your Identity</Text>
                    <Text style={[tw`text-center`, {
                      fontFamily: fontFamily.Light
                    }]}>Add all the required documents it will be reviewed by our team.</Text>
                </View>
              <View style={[tw`gap-4`]}>
                {documentFields.map((field) => {
                  const isSelected = !!documents[field.key];
                  const doc = documents[field.key];
                  const isImage = doc?.type?.startsWith("image") || doc?.mimeType?.startsWith("image") || (doc?.uri && !doc.uri.toLowerCase().endsWith(".pdf"));

                  return (
                    <View key={field.key} style={[tw`mb-0`]}>
                      <TouchableOpacity
                        style={[
                          tw`p-4 bg-white rounded-xl border border-gray-100`,
                          isSelected ? tw`border-blue-500 bg-blue-50/10` : tw`border-gray-200`,
                        ]}
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
                                  { fontFamily: fontFamily.Bold },
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

            <View style={[tw`mt-4`]}>
              <PrimaryButton
                bgColors={themeColors.primaryColor}
                height={50}
                onpress={handleSubmit}
                textColor="white"
                text={
                  loading ? "Verifying Documents..." : "Complete Verification"
                }
                disabled={loading}
              />
            </View>

            {/* Preview Modal */}
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

            <CompleteModal
              visible={completeModalVisible}
              onClose={() => {
                setCompleteModalVisible(false);
              }}
              title="Registration Successful"
              titleSubInfo1="Your account has been successful created."
              titleSubInfo2="After documents approval you can start your Workorders."
            />
          </View>
        </ScrollView>
    </View>
  );
};

export default Verification;
