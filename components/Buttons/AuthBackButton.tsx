import tw from "@/constants/tailwind";
import { ArrowLeft } from "lucide-react-native";
import { TouchableOpacity } from "react-native";



interface AuthBackButtonProps {
    onPress?: () => void;
}


const AuthBackButton = ({ onPress }: AuthBackButtonProps) => {
    return (
        <TouchableOpacity style={[tw`bg-white h-11 w-11 rounded-full items-center justify-center`   , {
        }]} onPress={onPress}>
            <ArrowLeft color={"#19488A"} />
        </TouchableOpacity>
    );
};

export default AuthBackButton;