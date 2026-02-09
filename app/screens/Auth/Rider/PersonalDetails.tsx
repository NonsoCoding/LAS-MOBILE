import PrimaryButton from "@/components/Buttons/PrimaryButton";
import TextInputFields from "@/components/Inputs/TextInputFields";
import Colors from "@/constants/Colors";
import { fontFamily } from "@/constants/fonts";
import tw from "@/constants/tailwind";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Formik } from "formik";
import { Car, User } from "lucide-react-native";
import { useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, Text, useColorScheme, View } from "react-native";
import * as Yup from "yup";

interface PersonalDetailsScreenProps {

}

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .required("Last name is required"),
  plateNumber: Yup.string()
    .min(3, "Plate number must be at least 3 characters")
    .required("Plate number is required"),
});

const PersonalDetailsScreen = ({

}: PersonalDetailsScreenProps) => {
    const router = useRouter();
      const params = useLocalSearchParams();
      const colorScheme = useColorScheme();
      const themeColors = Colors[colorScheme ?? "light"];
    const [loading, setLoading] = useState(false);
    
    const handleSubmit = async (values: {
    firstName: string;
    lastName: string;
    plateNumber: string;
  }) => {
    try {
      setLoading(true);

      router.push({
        pathname: "/screens/Auth/Rider/Verification",
        params: {
          email: params.email,
          password: params.password,
          firstName: values.firstName,
          lastName: values.lastName,
          plateNumber: values.plateNumber,
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
  

    return (
        <View style={[tw`flex-1 bg-[#19488A] justify-end`]}>
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
              firstName: "",
              lastName: "",
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

            <View style={[tw`bg-white py-10 pb-15 px-5 rounded-t-2xl`]}>
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
                    <View style={[tw``]}>
                      <TextInputFields
                        icon={User}
                        iconColor={themeColors.primaryColor}
                        iconSize={18}
                        value={values.firstName}
                        placeholderTextColor={themeColors.primaryColor}
                        onChangeText={handleChange("firstName")}
                        onBlur={handleBlur("firstName")}
                        placeholderText="First Name"
                      />
                      {touched.firstName && errors.firstName && (
                        <Text style={[tw`text-red-500 text-xs mt-1 ml-4`]}>
                          {errors.firstName}
                        </Text>
                      )}
                    </View>

                    <View style={[tw``]}>
                      <TextInputFields
                        icon={User}
                        iconColor={themeColors.primaryColor}
                        iconSize={18}
                        placeholderTextColor={themeColors.primaryColor}
                        value={values.lastName}
                        onChangeText={handleChange("lastName")}
                        onBlur={handleBlur("lastName")}
                        placeholderText="Last Name"
                      />
                      {touched.lastName && errors.lastName && (
                        <Text style={[tw`text-red-500 text-xs mt-1 ml-4`]}>
                          {errors.lastName}
                        </Text>
                      )}
                    </View>
                  <View>
                    <TextInputFields
                      icon={Car}
                      iconColor={themeColors.primaryColor}
                      iconSize={18}
                      placeholderTextColor={themeColors.primaryColor}
                      value={values.plateNumber}
                      onChangeText={handleChange("plateNumber")}
                      onBlur={handleBlur("plateNumber")}
                      placeholderText="Plate Number (e.g., LAS-12345)"
                      autoCapitalize="characters"
                    />
                    {touched.plateNumber && errors.plateNumber && (
                      <Text style={[tw`text-red-500 text-xs mt-1 ml-4`]}>
                        {errors.plateNumber}
                      </Text>
                    )}
                                </View>
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
                            </View>
                            
            </View>
                          )}    
                </Formik>
                </KeyboardAvoidingView>
        </View>
    )
}

export default PersonalDetailsScreen;