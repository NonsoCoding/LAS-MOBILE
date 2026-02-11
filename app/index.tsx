import PrimaryButton from "@/components/Buttons/PrimaryButton";
import { fontFamily } from "@/constants/fonts";
import tw from "@/constants/tailwind";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Platform, useColorScheme, View } from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  withTiming
} from "react-native-reanimated";
import Colors from "../constants/Colors";
import { useAppMode } from "../context/AppModeContext";

interface IntroScreenProps {}

const IntroScreen = ({}: IntroScreenProps) => {
  const { setMode } = useAppMode();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];

  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title1: "Send & Receive Anything",
      info: "From small parcels to large cargo. Gifts, groceries, furniture, and more delivered safely to your doorstep.",
    },
    {
      title1: "Track in Real-Time",
      info: "Know exactly where your package is. Live tracking with estimated arrival times and driver details.",
    },
    {
      title1: "Multiple Vehicle Options",
      info: "Choose from bikes, vans, and trucks. From 10kg parcels to 17-tonne cargo - we've got you covered.",
    },
    {
      title1: "Earn as a Carrier",
      info: "Own a bike or truck? Join our carrier network and start earning money with flexible schedules.",
    },
    {
      title1: "LAS MOBILE",
      info: "Own a bike or truck? Join our carrier network and start earning money with flexible schedules.",
    },
  ] as const;

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  return (
    <View
      style={[
        tw`flex-1 pt-10 justify-end`,
        {
          backgroundColor: "#19488A",
          ...Platform.select({
                  ios: {
                    paddingTop: 0
                  },
                  android: {
                    paddingTop: 20
                  }
                })
        },
      ]}
    >
      <Image
        source={require("../assets/images/Intro_logo.png")}
        style={[tw`self-center h-160 w-160 absolute z-999 top-0`]}
        resizeMode="contain"
      />
      <View
        style={[
          tw`relative bg-white h-85 justify-center px-5`,
          {
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            ...Platform.select({
                  ios: {
                    paddingBottom: 20
                  },
                  android: {
                    paddingBottom: 40
                  }
                })
          },
        ]}
      >
        <View style={tw`flex-1 justify-center items-center relative mt-10`}>
          {slides.map((item, index) => {
            const animatedStyle = useAnimatedStyle(() => {
              return {
                opacity: withTiming(currentSlide === index ? 1 : 0, {
                  duration: 500,
                }),
                zIndex: currentSlide === index ? 1 : 0,
              };
            });

            return (
              <Animated.View
                key={index}
                style={[
                  tw`absolute w-full justify-center items-center`,
                  animatedStyle,
                ]}
              >
                <Animated.Text
                  style={[tw`text-2xl text-center mb-3`, {
                    fontFamily: fontFamily.Bold
                  }]}
                  entering={FadeIn.delay(200)}
                  key={`title-${index}`}
                >
                  {item.title1} 
                </Animated.Text>
                <Animated.Text
                  style={[tw`text-center text-gray-600`, {
                    fontFamily: fontFamily.Light
                  }]}
                  entering={FadeIn.delay(300)}
                  key={`info-${index}`}
                >
                  {item.info}
                </Animated.Text>
              </Animated.View>
            );
          })}
        </View>

        <View style={[tw`flex-row mt-10 justify-center gap-2 mb-4`]}>
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

        <View style={[tw`gap-2`]}>
          <PrimaryButton
            height={50}
            bgColors="#19488A"
            text={currentSlide === slides.length - 1 ? "Login" : "Next"}
            textColor="white"
            onpress={() => {
              if (currentSlide === slides.length - 1) {
                router.navigate("/RegisterType");
              } else {
                handleNext();
              }
            }}
          />
          <PrimaryButton
            height={50}
            text={
              currentSlide === slides.length - 1 ? "Create an account!" : "Skip"
            }
            bgColors={
              currentSlide === slides.length - 1 ? "#19488A66" : "transparent"
            }
            textColor={
              currentSlide === slides.length - 1 ? "white" : "#19488A"
            }
            onpress={() => {
              if (currentSlide === slides.length - 1) {
                // "choose where to route it too" -> RegisterType (Account Type Selection)
                router.navigate("/PhoneLocation");
              } else {
                // Skip -> Last Slide
                setCurrentSlide(slides.length - 1);
              }
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default IntroScreen;
