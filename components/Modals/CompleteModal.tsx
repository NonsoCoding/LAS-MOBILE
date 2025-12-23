import Colors from "@/constants/Colors";
import tw from "@/constants/tailwind";
import { Image, Modal, Text, useColorScheme, View } from "react-native";

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
            tw`bg-white rounded-2xl p-5 gap-6 justify-center items-center gap-6`,
          ]}
        >
          <View style={[tw`gap-2`]}>
            <Image
              source={require("../../assets/images/IntroImages/icon/check.png")}
            />
            <Text style={[tw`text-4xl`]}>{title}</Text>
            <Text style={[tw`font-light`]}>{titleSubInfo1}</Text>
          </View>
          <Text style={[tw`font-light`]}>{titleSubInfo2}</Text>
        </View>
      </View>
    </Modal>
  );
};

export default CompleteModal;
