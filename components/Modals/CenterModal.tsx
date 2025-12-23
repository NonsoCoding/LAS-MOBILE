import Colors from "@/constants/Colors";
import tw from "@/constants/tailwind";
import { Modal, Text, useColorScheme, View } from "react-native";
import PrimaryButton from "../Buttons/PrimaryButton";

interface CenterModalProps {
  visible?: boolean;
  onClose?: () => void;
  title: string;
  titleSubInfo: string;
}

const LogoutModal = ({
  visible,
  onClose,
  title,
  titleSubInfo,
}: CenterModalProps) => {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];

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
      <View
        style={[
          tw`justify-end flex-1`,
          {
            backgroundColor: `rgba(0, 0, 0, 0.5)`,
          },
        ]}
      >
        <View style={[tw`bg-white h-60 rounded-2xl p-5 gap-6 justify-center`]}>
          <View style={[tw`items-center gap-4`]}>
            <Text style={[tw`text-xl font-semibold`]}>{title}</Text>
            <Text>{titleSubInfo}?</Text>
          </View>
          <View style={[tw`gap-4`]}>
            <PrimaryButton
              onpress={onClose}
              text="continue"
              textColor="white"
              height={45}
              bgColors={themeColors.primaryColor}
            />
            <PrimaryButton
              onpress={onClose}
              height={45}
              text="Cancel"
              textColor="red"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutModal;
