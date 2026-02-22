import tw from "@/constants/tailwind";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface LogoutModalProps {
    visible: boolean;
    onClose: () => void;
    onLogout: () => void;
}

const LogoutModalTwo = ({ visible, onClose, onLogout }: LogoutModalProps) => {
    return (
        <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
        >
            <View style={[tw`bg-[rgba(0,0,0,0.5)] flex-1 justify-center items-center`]}>
                <View style={[tw`bg-white p-4 rounded-lg`]}>
                    <Text style={[tw`text-center font-bold text-lg`]}>Logout</Text>
                    <Text style={[tw`text-center`]}>Are you sure you want to logout?</Text>
                    <View style={[tw`gap-4`]}>
                        <TouchableOpacity style={[tw`bg-[#19488A] p-2 rounded-lg items-center`]} onPress={onClose}>
                            <Text style={[tw`text-white`]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[tw`bg-[#19488A] p-2 rounded-lg items-center`]} onPress={onLogout}>
                            <Text style={[tw`text-white`]}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default LogoutModalTwo;