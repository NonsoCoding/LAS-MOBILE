import Colors from "@/constants/Colors";
import { fontFamily } from "@/constants/fonts";
import tw from "@/constants/tailwind";
import { ChevronRight, MapPin, SearchIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { FlatList, Pressable, Text, TextInput, useColorScheme, View } from "react-native";

interface SearchTextInputProps {
  direction: "FROM" | "TO";
  value?: string;
  placeholder?: string;
  GoogleApiKey: string;
  onFocus?: () => void;
  onPlaceSelected: (details: {
    description: string;
    latitude: number;
    longitude: number;
  }) => void;
}

const RouteSearchTextInput = ({
  direction,
  placeholder = "Search location...",
  value = "",
  onFocus,
  onPlaceSelected,
  GoogleApiKey,
}: SearchTextInputProps) => {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  // Sync internal query with prop value if needed (e.g. when sheet re-opens)
  useEffect(() => {
    if (value && value !== query) {
      setQuery(value);
    }
  }, [value]);

  const searchPlaces = async (text: string) => {
    setQuery(text);
    if (text.length < 3) {
      setResults([]);
      return;
    }

    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(text)}&key=${GoogleApiKey}&language=en`
      );
      const json = await res.json();
      setResults(json.predictions || []);
    } catch (error) {
      console.error("Autocomplete error:", error);
    }
  };

  const handleSelectPlace = async (placeId: string, description: string) => {
    setQuery(description);
    setResults([]);
    setIsFocused(false);

    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry&key=${GoogleApiKey}`
      );
      const json = await res.json();
      
      if (json.result?.geometry?.location) {
        onPlaceSelected({
          description: description,
          latitude: json.result.geometry.location.lat,
          longitude: json.result.geometry.location.lng,
        });
      }
    } catch (error) {
      console.error("Place details error:", error);
    }
  };

  return (
    <View style={tw`z-50`}>
      <View style={[tw`flex-row items-center border px-4 py-2 rounded-full bg-white h-12`, {
        borderColor: themeColors.primaryColor,
      }]}>
        <SearchIcon size={18} color={themeColors.primaryColor} />
        <View style={[tw`h-6 border-l border-gray-300 mx-3`]} />
        <View style={tw`flex-1 justify-center`}>
          <Text style={[tw`text-[10px] text-gray-400 uppercase`, { fontFamily: fontFamily.MontserratEasyMedium }]}>
            {direction}
          </Text>
          <TextInput
            style={[tw`text-sm p-0 h-5 lowercase`, { 
              fontFamily: fontFamily.MontserratEasyMedium, 
              color: "black",
              includeFontPadding: false
            }]}
            value={query}
            onChangeText={searchPlaces}
            onFocus={() => {
              setIsFocused(true);
              onFocus?.();
            }}
            placeholder={placeholder}
            placeholderTextColor="#9ca3af"
          />
        </View>
        <ChevronRight size={18} color="black" />
      </View>

      {isFocused && results.length > 0 && (
        <View style={[tw`absolute top-17 left-0 right-0 bg-white rounded-xl border border-gray-100 shadow-xl overflow-hidden z-50`]}>
          <FlatList
            data={results}
            keyExtractor={(item: any) => item.place_id}
            renderItem={({ item }) => (
              <Pressable 
                onPress={() => handleSelectPlace(item.place_id, item.description)}
                style={({ pressed }) => [
                  tw`flex-row items-center gap-3 p-4 border-b border-gray-50`,
                  pressed && tw`bg-gray-50`
                ]}
              >
                <View style={tw`p-2 bg-gray-100 rounded-full`}>
                  <MapPin size={16} color="black" />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={[tw`text-xs uppercase`, { fontFamily: fontFamily.MontserratEasyBold }]}>
                    {item.structured_formatting?.main_text || item.description}
                  </Text>
                  <Text style={[tw`text-[10px] text-gray-400 uppercase`, { fontFamily: fontFamily.MontserratEasyMedium }]} numberOfLines={1}>
                    {item.structured_formatting?.secondary_text || ""}
                  </Text>
                </View>
                <Text style={[tw`text-[10px] text-gray-400`, { fontFamily: fontFamily.MontserratEasyMedium }]}>
                  1.8KM
                </Text>
              </Pressable>
            )}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}
    </View>
  );
};

export default RouteSearchTextInput;
