import Colors from "@/constants/Colors";
import { fontFamily } from "@/constants/fonts";
import tw from "@/constants/tailwind";
import { FontAwesome5 } from "@expo/vector-icons";
import { ChevronDownIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Image, ImageSourcePropType, Text, TextInput, TextInputProps, TouchableOpacity, useColorScheme, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

interface Country {
    name: string;
    flag: ImageSourcePropType;
    code: string;
}

interface SearchTextInputProps {
    direction: string;
    value?: string;
    onChangeText?: (text: string) => void;
    onBlur?: TextInputProps['onBlur'];
    onFocus?: TextInputProps['onFocus'];
    onCountrySelect?: (country: Country) => void;
}

const RouteNumberTextInput = ({
    value,
    direction,
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

    const countries: Country[] = [
        {name: "Nigeria", flag: require("../../assets/images/IntroImages/icon/nigeria.png"), code: "+234"},
        {name: "Ghana", flag: require("../../assets/images/IntroImages/icon/ghana.png"), code: "+233"},
        {name: "Kenya", flag: require("../../assets/images/IntroImages/icon/kenya.png"), code: "+254"},
        {name: "Uganda", flag: require("../../assets/images/IntroImages/icon/Uganda.png"), code: "+256"},
    ];

    const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);

    useEffect(() => {
        animatedValue.value = withTiming(value || isFocusedInternal ? 1 : 0, { duration: 200 });
    }, [value, isFocusedInternal]);

    useEffect(() => {
        countryDropdownHeight.value = withTiming(isCountryDropdownOpen ? countries.length * 50 : 0, { duration: 300 });
        chevronRotation.value = withTiming(isCountryDropdownOpen ? 180 : 0, { duration: 300 });
    }, [isCountryDropdownOpen]);

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

    const toggleCountryDropdown = () => {
        setIsCountryDropdownOpen(!isCountryDropdownOpen);
    };

    const handleCountrySelect = (country: Country) => {
        setSelectedCountry(country);
        onCountrySelect?.(country);
        setIsCountryDropdownOpen(false);
    };

    return (
        <View style={tw`relative`}>
            <View style={tw`border-1 border rounded-full items-center flex-row px-4 py-2 gap-3 border-[#19488A] h-12`}>
                <TouchableOpacity 
                    style={[tw`flex-row items-center gap-1`]}
                    onPress={toggleCountryDropdown}
                >
                    <Image source={selectedCountry.flag} style={[tw`h-5 w-5`]} />
                    <Animated.View style={animatedChevronStyle}>
                        <ChevronDownIcon size={12} color={themeColors.primaryColor} />
                    </Animated.View>
                </TouchableOpacity>
                <View style={[tw`h-5 border border-[1px] border-[#19488A22]`]} />
                <View style={[tw`flex-1 relative justify-center`]}>
                    <Animated.Text 
                        style={[
                            tw`uppercase text-[#00000050]`,
                            animatedLabelStyle
                        ]}
                    >
                        {direction}
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
                            style={[tw`text-[12px] uppercase`, {
                                fontFamily: fontFamily.Regular,
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
                {countries.map((country, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => handleCountrySelect(country)}
                        style={[
                            tw`px-4 py-3 flex-row items-center gap-3 border-b border-[#19488A22]`,
                            {
                                backgroundColor: selectedCountry.name === country.name ? "#19488A11" : "white",
                            },
                            index === countries.length - 1 && tw`border-b-0`
                        ]}
                    >
                        <Image source={country.flag} style={[tw`h-6 w-6`]} />
                        <Text style={[
                            tw`text-sm flex-1`,
                            {
                                fontFamily: selectedCountry.name === country.name ? fontFamily.Medium : fontFamily.Regular,
                                color: selectedCountry.name === country.name ? themeColors.primaryColor : "black"
                            }
                        ]}>
                            {country.name}
                        </Text>
                        <Text style={[
                            tw`text-xs`,
                            {
                                fontFamily: fontFamily.Regular,
                                color: "#00000066"
                            }
                        ]}>
                            {country.code}
                        </Text>
                    </TouchableOpacity>
                ))}
            </Animated.View>
        </View>
    );
};

export default RouteNumberTextInput;