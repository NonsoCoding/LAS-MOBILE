import Colors from "@/constants/Colors";
import { fontFamily } from "@/constants/fonts";
import tw from "@/constants/tailwind";
import { FontAwesome5 } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ImageSourcePropType, TextInput, TextInputProps, useColorScheme, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

interface Country {
    name: string;
    flag: ImageSourcePropType;
    code: string;
}

interface SearchTextInputProps {
    placeholderText: string;
    value?: string;
    onChangeText?: (text: string) => void;
    onBlur?: TextInputProps['onBlur'];
    onFocus?: TextInputProps['onFocus'];
    onCountrySelect?: (country: Country) => void;
}

const CustomTextInput = ({
    value,
    placeholderText,
    onChangeText,
    onBlur,
    onFocus,
    onCountrySelect
}: SearchTextInputProps) => {
    const colorScheme = useColorScheme();
    const themeColors = Colors[colorScheme ?? "light"];
    const [isFocusedInternal, setIsFocusedInternal] = useState(false);
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
    const animatedValue = useSharedValue(value || isFocusedInternal ? 1 : 0);
    const countryDropdownHeight = useSharedValue(0);
    const chevronRotation = useSharedValue(0);

    useEffect(() => {
        animatedValue.value = withTiming(value || isFocusedInternal ? 1 : 0, { duration: 200 });
    }, [value, isFocusedInternal]);

    const animatedLabelStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateY: animatedValue.value === 1 ? -1 : 0 },
            ],
            fontSize: animatedValue.value === 1 ? 9 : 12,
            opacity: animatedValue.value === 1 ? 1 : 0.6,
            position: 'absolute',
            top: animatedValue.value === 1 ? 0 : 8,
        };
    });

    const animatedInputStyle = useAnimatedStyle(() => {
        return {
            paddingTop: animatedValue.value === 1 ? 12 : 0,
        };
    });

    const animatedCountryListStyle = useAnimatedStyle(() => {
        return {
            height: countryDropdownHeight.value,
            opacity: countryDropdownHeight.value > 0 ? 1 : 0,
        };
    });

    const animatedChevronStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${chevronRotation.value}deg` }],
        };
    });

    return (
        <View style={tw`relative`}>
            <View style={tw`border-1 border rounded-full items-center flex-row px-4 py-2 gap-3 border-[#19488A] h-12`}>
                <View style={[tw`w-9 items-center justify-center`]}>
                    <FontAwesome5 name="address-book" size={15} color={themeColors.primaryColor} />
               </View>
                <View style={[tw`h-5 border border-[1px] border-[#19488A22]`]} />
                <View style={[tw`flex-1 relative justify-center`]}>
                    <Animated.Text 
                        style={[
                            tw`uppercase text-[#00000050]`,
                            animatedLabelStyle
                        ]}
                    >
                        {placeholderText}
                    </Animated.Text>
                    <Animated.View style={animatedInputStyle}>
                        <TextInput
                            placeholder={isFocusedInternal ? "" : ""}
                            placeholderTextColor={"#00000044"}
                            value={value}
                            onChangeText={onChangeText}
                            keyboardType="phone-pad"
                            onFocus={(e) => {
                                setIsFocusedInternal(true);
                                onFocus?.(e);
                            }}
                            onBlur={(e) => {
                                setIsFocusedInternal(false);
                                onBlur?.(e);
                            }}
                            style={[tw`text-[10px] uppercase`, {
                                fontFamily: fontFamily.MontserratEasyRegular,
                                color: "black",
                                height: 30,
                            }]}
                        />
                    </Animated.View>
                </View>
                <View>
                    <FontAwesome5 name="address-book" size={15} color={themeColors.primaryColor} />
                </View>
            </View>

            {/* Country Dropdown */}
            <Animated.View
                style={[
                    tw`absolute top-14 left-0 right-0 bg-white rounded-2xl overflow-hidden`,
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
                    animatedCountryListStyle
                ]}
            >
            </Animated.View>
        </View>
    );
};

export default CustomTextInput;