import Colors from "@/constants/Colors";
import tw from "@/constants/tailwind";
import { useRouter } from "expo-router";
import { Image, Modal, Text, useColorScheme, View } from "react-native";
import PrimaryButton from "../Buttons/PrimaryButton";

interface CenterModalProps {
  visible?: boolean;
  onClose?: () => void;
  title: string;
  titleSubInfo1: string;
  titleSubInfo2?: string;
}

const CompleteModal = ({
  visible,
  onClose,
  title,
  titleSubInfo1,
  titleSubInfo2,
}: CenterModalProps) => {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];
  const router = useRouter();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      statusBarTranslucent={true}
      onRequestClose={() => {
        onClose && onClose();
      }}
    >
      <View style={[tw`justify-end flex-1`]}>
        <View
          style={[
            tw`bg-white h-full rounded-2xl p-5 gap-6 justify-center items-center gap-6`,
          ]}
        >
          <View style={[tw`gap-2 items-center`]}>
            <Image
              style={[tw`h-30 w-30`]}
              source={require("../../assets/images/IntroImages/icon/check.png")}
            />
            <Text style={[tw`text-3xl`]}>{title}</Text>
            <Text style={[tw`font-light text-gray-500`]}>{titleSubInfo1}</Text>
          </View>
          <Text style={[tw`font-light text-center text-gray-500`]}>
            {titleSubInfo2}
          </Text>
        </View>
        <View style={[tw`absolute bottom-15 w-full px-5`]}>
          <PrimaryButton
            bgColors={themeColors.primaryColor}
            height={50}
            textColor={themeColors.text}
            onpress={onClose}
            text="Continue"
          />
        </View>
      </View>
    </Modal>
  );
};

export default CompleteModal;
