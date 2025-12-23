import SharedLayout from "@/components/Layout/SharedLayout";
import tw from "@/constants/tailwind";
import { Text, View } from "react-native";

interface UserHomePageProps {}

const UserHomePage = ({}: UserHomePageProps) => {
  return (
    <SharedLayout>
      <View style={[tw`flex-1 justify-between`, {}]}>
        <Text>Rider Homepage</Text>
      </View>
    </SharedLayout>
  );
};

export default UserHomePage;
