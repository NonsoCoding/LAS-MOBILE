import PrimaryButton from "@/components/Buttons/PrimaryButton";
import SharedLayout from "@/components/Layout/SharedLayout";
import CompleteModal from "@/components/Modals/CompleteModal";
import { registeredRider } from "@/components/services/api/authApi";
import useAuthStore from "@/components/store/authStore";
import Colors from "@/constants/Colors";
import tw from "@/constants/tailwind";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Upload } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
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

  const [documents, setDocuments] = useState<DocumentState>({
    government_id: null,
    drivers_license: null,
    proof_of_address: null,
    work_authorization: null,
  });

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
      formData.append("phone_number", params.phoneNumber as string);
      formData.append("plate_number", params.plateNumber as string);

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
        phoneNumber: params.phoneNumber,
        plateNumber: params.plateNumber,
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

      const response = await registeredRider(formData);

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
              response.user
            );
        }
        Alert.alert(
          "Success",
          "Your account has been created successfully! Please check your email for verification code.",
          [
            {
              text: "OK",
              onPress: () => router.replace("/screens/Otp"),
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
    <SharedLayout>
      {loading ? (
        <View style={[tw`flex-1 items-center justify-center`]}>
          <ActivityIndicator size="large" color={themeColors.primaryColor} />
        </View>
      ) : (
        <ScrollView
          style={[tw``]}
          contentContainerStyle={[tw`pt-10 flex-1`]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[tw`flex-1 justify-between`]}>
            <View style={[tw`gap-8`]}>
              <View style={[tw`gap-3`]}>
                <View style={[tw`flex-row gap-2`]}>
                  <Text style={[tw`text-3xl font-bold text-[#003C7A]`]}>
                    Account
                  </Text>
                  <Text style={[tw`text-3xl font-bold text-[#CC1A21]`]}>
                    Verification
                  </Text>
                </View>
                <Text style={[tw`font-light text-gray-600`]}>
                  Kindly provide us your legal documentation to complete the
                  verification process
                </Text>
              </View>

              <View style={[tw`gap-4`]}>
                {documentFields.map((field) => (
                  <TouchableOpacity
                    key={field.key}
                    style={[
                      tw`py-4 px-4 bg-gray-50 rounded-lg border border-gray-200`,
                      documents[field.key] && tw`bg-green-50 border-green-300`,
                    ]}
                    onPress={() => pickDocument(field.key)}
                    activeOpacity={0.7}
                  >
                    <View style={[tw`flex-row items-center justify-between`]}>
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
                          color={documents[field.key] ? "#15803d" : "#003C7A"}
                        />
                      </View>
                    </View>
                    {documents[field.key] && (
                      <View style={[tw`flex-row items-center mt-2`]}>
                        <Text style={[tw`text-sm text-green-700`]}>
                          ✓ {documents[field.key].name || `${field.key}.jpg`}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
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
      )}
    </SharedLayout>
  );
};

export default Verification;
