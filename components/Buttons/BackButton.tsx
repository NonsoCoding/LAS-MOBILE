import tw from "@/constants/tailwind";
import { ChevronLeft } from "lucide-react-native";
import { TouchableOpacity } from "react-native";



interface BackButtonProps {
    onPress?: () => void;
}


const BackButton = ({ onPress }: BackButtonProps) => {
    return (
        <TouchableOpacity style={[tw`bg-white h-12 w-12 rounded-full items-center justify-center`   , {
        }]} onPress={onPress}>
            <ChevronLeft color="#19488A" />
        </TouchableOpacity>
    );
};

export default BackButton;