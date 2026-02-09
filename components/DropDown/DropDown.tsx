import Colors from "@/constants/Colors";
import { fontFamily } from "@/constants/fonts";
import tw from "@/constants/tailwind";
import { ChevronDown } from "lucide-react-native";
import { useState } from "react";
import { Image, ImageSourcePropType, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

interface DropDownProps {
    label?: string;
    placeholder?: string;
    options: string[];
    value?: string;
    onSelect?: (value: string) => void;
    disabled?: boolean;
    icon?: ImageSourcePropType;
}

const DropDown = ({
    label,
    placeholder = "Select an option",
    options,
    value,
    icon,
    onSelect,
    disabled = false
}: DropDownProps) => {
    const colorScheme = useColorScheme();
    const themeColors = Colors[colorScheme ?? "light"];
    const [isOpen, setIsOpen] = useState(false);
    const rotation = useSharedValue(0);
    const height = useSharedValue(0);

    const toggleDropdown = () => {
        if (disabled) return;
        
        const newState = !isOpen;
        setIsOpen(newState);
        
        rotation.value = withTiming(newState ? 180 : 0, { duration: 300 });
        height.value = withTiming(newState ? options.length * 50 : 0, { duration: 300 });
    };

    const handleSelect = (option: string) => {
        onSelect?.(option);
        toggleDropdown();
    };

    const animatedChevronStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotation.value}deg` }],
        };
    });

    const animatedListStyle = useAnimatedStyle(() => {
        return {
            height: height.value,
            opacity: height.value > 0 ? 1 : 0,
        };
    });

    return (
        <View style={[tw`gap-2`]}>
            
            
            <View style={[tw`relative`]}>
                {/* Dropdown Header */}
                <TouchableOpacity
                    onPress={toggleDropdown}
                    disabled={disabled}
                    style={[
                        tw`border rounded-full px-4 py-2 flex-row justify-between items-center`,
                        {
                            borderColor: themeColors.primaryColor,
                            borderWidth: 1,
                            backgroundColor: disabled ? "#f5f5f5" : "white",
                            opacity: disabled ? 0.6 : 1,
                        }
                    ]}
                >
                    <View style={[tw`flex-row items-center gap-4`]}>

                           <Image style={[tw`h-3.5 w-3.5`]} source={icon}/>
            <View style={[tw`h-5 border border-[1px] border-[#19488A22]`]} />
                    <View>

                    {label && (
                <Text style={[tw`text-[10px] uppercase text-[#00000066]`, {
                    fontFamily: fontFamily.MontserratEasyMedium
                }]}>
                    {label}
                </Text>
            )}
                    <Text style={[
                        tw`text-[12px] uppercase`,
                        {
                            fontFamily: fontFamily.MontserratEasyRegular,
                            color: value ? "black" : "#00000066"
                        }
                    ]}>
                        {value || placeholder}
                    </Text>
                    </View>
                    
                    </View>
                        
                    <Animated.View style={animatedChevronStyle}>
                        <ChevronDown size={20} color={themeColors.primaryColor} />
                    </Animated.View>
                </TouchableOpacity>

                {/* Dropdown List */}
                <Animated.View
                    style={[
                        tw`absolute top-16 left-0 right-0 bg-white rounded-md overflow-hidden`,
                        {
                            borderColor: themeColors.primaryColor,
                            borderWidth: 1,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.1,
                            shadowRadius: 8,
                            elevation: 5,
                            zIndex: 1000,
                        },
                        animatedListStyle
                    ]}
                >
                    {options.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleSelect(option)}
                            style={[
                                tw`px-4 py-3 border-b border-[#19488A22]`,
                                {
                                    backgroundColor: value === option ? "#19488A11" : "white",
                                },
                                index === options.length - 1 && tw`border-b-0`
                            ]}
                        >
                            <Text style={[
                                tw`text-sm`,
                                {
                                    fontFamily: value === option ? fontFamily.MontserratEasyMedium : fontFamily.MontserratEasyRegular,
                                    color: value === option ? themeColors.primaryColor : "black"
                                }
                            ]}>
                                {option}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </Animated.View>
            </View>
        </View>
    );
};

export default DropDown;
