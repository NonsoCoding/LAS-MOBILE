import PrimaryButton from "@/components/Buttons/PrimaryButton";
import PasswordTextInputFields from "@/components/Inputs/PasswordTextInputField";
import SharedLayout from "@/components/Layout/SharedLayout";
import Colors from "@/constants/Colors";
import tw from "@/constants/tailwind";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";

interface ProfileSupportProps {}

const ChangePassword = ({}: ProfileSupportProps) => {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];
  const router = useRouter();
  return (
    <SharedLayout>
      <View style={[tw`py-5 gap-20`]}>
        <View style={[tw`gap-8`, {}]}>
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
            style={[
              tw`p-3 self-start rounded-full bg-white`,
              {
                // iOS shadow properties
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                // Android shadow
                elevation: 3,
              },
            ]}
          >
            <ChevronLeft color={themeColors.tint} />
          </TouchableOpacity>
          <View style={[tw`gap-3`]}>
            <Text style={[tw`font-semibold text-xl`]}>Change Password</Text>
            <Text style={[tw`text-gray-500 text-xl`]}>
              Fill in the details to chnage your password
            </Text>
          </View>
          <View style={[tw`gap-10`]}>
            <View>
              <Text style={[tw`text-gray-400`]}>Old password</Text>
              <PasswordTextInputFields onChangeText={() => {}} />
            </View>
            <View>
              <Text style={[tw`text-gray-400`]}>New pssword</Text>
              <PasswordTextInputFields onChangeText={() => {}} />
            </View>
            <View>
              <Text style={[tw`text-gray-400`]}>Confirm new password</Text>
              <PasswordTextInputFields onChangeText={() => {}} />
            </View>
          </View>
        </View>
        <PrimaryButton
          height={55}
          bgColors={themeColors.tint}
          text="save changes"
          textColor={themeColors.text}
        />
      </View>
    </SharedLayout>
  );
};

export default ChangePassword;
