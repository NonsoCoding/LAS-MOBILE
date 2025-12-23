import PrimaryButton from "@/components/Buttons/PrimaryButton";
import SharedLayout from "@/components/Layout/SharedLayout";
import tw from "@/constants/tailwind";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Animated, Image, Text, useColorScheme, View } from "react-native";
import Colors from "../constants/Colors";
import { useAppMode } from "../context/AppModeContext";

interface IntroScreenProps {}

const IntroScreen = ({}: IntroScreenProps) => {
  const { setMode } = useAppMode();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];

  const [currentSlide, setCurrentSlide] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const slides = [
    {
      title1: "Land, Air, or Sea?",
      title2: "We Move It.",
      info: "From a document on a bike to heavy freight by sea. Select the perfect carrier for your package size and destination instantly.",
      image: require("../assets/images/IntroImages/Onboarding1.png"),
    },
    {
      title1: "Your Goods,",
      title2: "Fully Insured.",
      info: "Peace of mind comes standard. Every trip includes Goods In Transit (GIT) insurance to protect your valuables from pickup to drop-off.",
      image: require("../assets/images/IntroImages/Onboarding3.png"),
    },
    {
      title1: "Seamless Pay,",
      title2: "Real-Time Track.",
      info: "Fund your in-app wallet for instant payments and watch your delivery move on the map in real-time",
      image: require("../assets/images/IntroImages/Onboarding2.png"),
    },
  ] as const;

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        // Change slide
        setCurrentSlide(currentSlide + 1);
        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    } else {
      // Navigate to next screen after last slide
      router.navigate("/RegisterType");
    }
  };

  const currentSlideData = slides[currentSlide];

  return (
    <SharedLayout>
      <View style={[tw`flex-1 pt-10 justify-between`]}>
        <Animated.View style={[tw`gap-3`, { opacity: fadeAnim }]}>
          <Text style={[tw`text-4xl font-semibold text-[#003C7A]`]}>
            {currentSlideData.title1}
          </Text>
          <Text style={[tw`text-4xl font-semibold text-[#CC1A21]`]}>
            {currentSlideData.title2}
          </Text>
          <Text>{currentSlideData.info}</Text>
        </Animated.View>

        <View style={[tw`relative`]}>
          <Animated.View style={{ opacity: fadeAnim }}>
            <Image
              style={[
                tw`h-120 self-center w-120 -mb-8`,
                {
                  resizeMode: "contain",
                },
              ]}
              source={currentSlideData.image}
            />
          </Animated.View>

          {/* Gradient overlay to blend image with button */}
          <View
            style={[
              tw`absolute bottom-0 left-0 right-0 h-32`,
              {
                background:
                  "linear-gradient(to bottom, transparent, rgba(0, 60, 122, 0.1))",
              },
            ]}
          />

          {/* Pagination dots */}
          <View style={[tw`flex-row justify-center gap-2 mb-4`]}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[
                  tw`h-2 rounded-full`,
                  {
                    width: currentSlide === index ? 24 : 8,
                    backgroundColor:
                      currentSlide === index ? "#003C7A" : "#D1D5DB",
                  },
                ]}
              />
            ))}
          </View>

          <View
            style={[
              {
                shadowColor: "#003C7A",
                shadowOffset: { width: 0, height: -10 },
                shadowOpacity: 0.15,
                shadowRadius: 20,
                elevation: 10,
              },
            ]}
          >
            <PrimaryButton
              height={60}
              bgColors="#003C7A"
              text={currentSlide === slides.length - 1 ? "Get Started" : "Next"}
              textColor="white"
              onpress={() => {
                handleNext();
              }}
            />
          </View>
        </View>
      </View>
    </SharedLayout>
  );
};

export default IntroScreen;
