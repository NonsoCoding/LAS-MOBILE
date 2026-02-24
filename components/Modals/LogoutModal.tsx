import Colors from "@/constants/Colors";
import { fontFamily } from "@/constants/fonts";
import tw from "@/constants/tailwind";
import { Modal, Text, useColorScheme, View } from "react-native";
import PrimaryButton from "../Buttons/PrimaryButton";

interface LogoutModalProps {
    visible: boolean;
    onClose: () => void;
    onLogout: () => void;
}

const LogoutModalTwo = ({ visible, onClose, onLogout }: LogoutModalProps) => {
    const colorScheme = useColorScheme();
    const themeColors = Colors[colorScheme ?? "light"];

    return (
        <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
        >
            <View style={[tw`bg-[rgba(0,0,0,0.5)] flex-1 justify-end items-center`]}>
                <View style={[tw`bg-white p-4 rounded-lg w-full gap-4 pb-10`]}>
                    <Text style={[tw`text-center font-bold text-lg`, {
                        fontFamily: fontFamily.Bold
                    }]}>Logout</Text>
                    <Text style={[tw`text-center`, {
                        fontFamily: fontFamily.MontserratEasyMedium
                    }]}>Are you sure you want to logout?</Text>
                    <View style={[tw`gap-2`]}>
                        <PrimaryButton
                            bgColors={themeColors.primaryColor}
                            text="Cancel"
                            textColor={"white"}
                            height={50}
                            onpress={onClose}
                        />
                        <PrimaryButton
                            bgColors={"#FF3B30"}
                            text="Logout"
                            textColor={"white"}
                            height={50}
                            onpress={onLogout}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default LogoutModalTwo;