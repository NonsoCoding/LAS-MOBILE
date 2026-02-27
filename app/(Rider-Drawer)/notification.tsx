import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import tw from "@/constants/tailwind";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { AlignCenter } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

interface NotificationProps {
    
}

const NotificationScreen = ({ }: NotificationProps) => {
    
    const navigation = useNavigation();
     const colorScheme = useColorScheme();
          const themeColors = Colors[colorScheme ?? "light"];
    return (
        <View>
             <TouchableOpacity
                style={[
                  tw`p-2.5 absolute left-5 top-15 rounded-full self-start`,
                  {
                    backgroundColor: themeColors.background,
                  },
                ]}
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              >
                <AlignCenter color={themeColors.primaryColor} />
        </TouchableOpacity>
        </View>
    )
}

export default NotificationScreen;