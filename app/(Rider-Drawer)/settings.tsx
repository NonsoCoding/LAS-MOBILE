import useAppStore from "@/components/store/appStore";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { fontFamily } from "@/constants/fonts";
import tw from "@/constants/tailwind";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { AlignCenter, ChevronRight, Moon, Sun } from "lucide-react-native";
import { Platform, SafeAreaView, Switch, Text, TouchableOpacity, View } from "react-native";

const SettingsScreen = () => {
    const navigation = useNavigation();
    const colorScheme = useColorScheme();
    const themeColors = Colors[colorScheme ?? "light"];
    const { theme, toggleTheme } = useAppStore();

    const isDarkMode = theme === "dark";

    return (
        <SafeAreaView style={[tw`flex-1`, { backgroundColor: themeColors.background }]}>
            <View style={[tw`flex-1 px-5`, { paddingTop: Platform.OS === 'android' ? 40 : 10 }]}>
                {/* Header */}
                <View style={[tw`flex-row items-center justify-between mb-10`]}>
                    <TouchableOpacity
                        style={[
                            tw`p-2.5 rounded-full`,
                            { backgroundColor: isDarkMode ? "#1f2937" : "#f3f4f6" },
                        ]}
                        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                    >
                        <AlignCenter color={themeColors.primaryColor} size={24} />
                    </TouchableOpacity>
                    <Text style={[tw`text-xl`, { 
                        fontFamily: fontFamily.MontserratEasyBold, 
                        color: themeColors.primaryColor 
                    }]}>Settings</Text>
                    <View style={tw`w-10`} /> {/* Spacer for balance */}
                </View>

                {/* Appearance Section */}
                <View style={tw`mb-8`}>
                    <Text style={[tw`text-xs uppercase mb-4 opacity-50`, { 
                        fontFamily: fontFamily.MontserratEasyBold, 
                        color: themeColors.text 
                    }]}>Appearance</Text>
                    
                    <View style={[
                        tw`rounded-2xl p-4 flex-row items-center justify-between`,
                        { backgroundColor: isDarkMode ? "#111827" : "#f9fafb" }
                    ]}>
                        <View style={tw`flex-row items-center gap-3`}>
                            <View style={[
                                tw`p-2 rounded-xl`,
                                { backgroundColor: isDarkMode ? "#374151" : "#eff6ff" }
                            ]}>
                                {isDarkMode ? (
                                    <Moon size={20} color="#60a5fa" />
                                ) : (
                                    <Sun size={20} color="#f59e0b" />
                                )}
                            </View>
                            <View>
                                <Text style={[tw`text-base`, { 
                                    fontFamily: fontFamily.MontserratEasyMedium, 
                                    color: themeColors.text 
                                }]}>Dark Mode</Text>
                                <Text style={[tw`text-xs opacity-60`, { 
                                    fontFamily: fontFamily.MontserratEasyRegular, 
                                    color: themeColors.text 
                                }]}>{isDarkMode ? "Enabled" : "Disabled"}</Text>
                            </View>
                        </View>
                        <Switch
                            value={isDarkMode}
                            onValueChange={toggleTheme}
                            trackColor={{ false: "#d1d5db", true: "#3b82f6" }}
                            thumbColor={Platform.OS === 'ios' ? undefined : (isDarkMode ? "#ffffff" : "#f4f3f4")}
                        />
                    </View>
                </View>

                {/* Other Settings (Placeholders for premium feel) */}
                <View>
                    <Text style={[tw`text-xs uppercase mb-4 opacity-50`, { 
                        fontFamily: fontFamily.MontserratEasyBold, 
                        color: themeColors.text 
                    }]}>Account</Text>
                    
                    <TouchableOpacity style={[
                        tw`rounded-2xl p-4 flex-row items-center justify-between mb-3`,
                        { backgroundColor: isDarkMode ? "#111827" : "#f9fafb" }
                    ]}>
                        <View style={tw`flex-row items-center gap-3`}>
                           <Text style={[tw`text-base`, { 
                               fontFamily: fontFamily.MontserratEasyMedium, 
                               color: themeColors.text 
                           }]}>Profile Information</Text>
                        </View>
                        <ChevronRight size={20} color={isDarkMode ? "#4b5563" : "#d1d5db"} />
                    </TouchableOpacity>

                    <TouchableOpacity style={[
                        tw`rounded-2xl p-4 flex-row items-center justify-between`,
                        { backgroundColor: isDarkMode ? "#111827" : "#f9fafb" }
                    ]}>
                        <View style={tw`flex-row items-center gap-3`}>
                           <Text style={[tw`text-base`, { 
                               fontFamily: fontFamily.MontserratEasyMedium, 
                               color: themeColors.text 
                           }]}>Security & Privacy</Text>
                        </View>
                        <ChevronRight size={20} color={isDarkMode ? "#4b5563" : "#d1d5db"} />
                    </TouchableOpacity>
                </View>

                {/* Footer/Version */}
                <View style={tw`mt-auto mb-10 items-center`}>
                    <Text style={[tw`text-xs opacity-30`, { 
                        fontFamily: fontFamily.MontserratEasyRegular, 
                        color: themeColors.text 
                    }]}>Version 1.0.4</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default SettingsScreen;