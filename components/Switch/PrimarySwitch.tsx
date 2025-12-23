import { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface PrimarySwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  activeColor?: string;
  inactiveColor?: string;
  activeButtonColor?: string;
  inactiveButtonColor?: string;
  activeTextColor?: string;
  inactiveTextColor?: string;
  disabled?: boolean;
  onText?: string;
  offText?: string;
}

const PrimarySwitch = ({
  value,
  onValueChange,
  activeColor = "#2f95dc33",
  inactiveColor = "#2f95dc33",
  activeButtonColor = "#7C5CFF",
  inactiveButtonColor = "#FFFFFF",
  activeTextColor = "#FFFFFF",
  inactiveTextColor = "#1F1F1F",
  disabled = false,
  onText = "ON",
  offText = "OFF",
}: PrimarySwitchProps) => {
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: value ? 1 : 0,
      useNativeDriver: false,
      friction: 8,
      tension: 40,
    }).start();
  }, [value]);

  const buttonTranslateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 50],
  });

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      disabled={disabled}
      style={[styles.container, { opacity: disabled ? 0.5 : 1 }]}
    >
      <View
        style={[
          styles.track,
          { backgroundColor: value ? activeColor : inactiveColor },
        ]}
      >
        <View style={styles.labelsContainer}>
          <Text
            style={[
              styles.label,
              { color: !value ? inactiveTextColor : inactiveTextColor },
            ]}
          >
            {offText}
          </Text>
          <Text
            style={[
              styles.label,
              { color: value ? activeTextColor : inactiveTextColor },
            ]}
          >
            {onText}
          </Text>
        </View>
        <Animated.View
          style={[
            styles.button,
            {
              backgroundColor: value ? activeButtonColor : inactiveButtonColor,
              transform: [{ translateX: buttonTranslateX }],
            },
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              { color: value ? activeTextColor : inactiveTextColor },
            ]}
          >
            {value ? onText : offText}
          </Text>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
  track: {
    width: 100,
    height: 40,
    borderRadius: 10,
    position: "relative",
    overflow: "hidden",
  },
  labelsContainer: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 100,
    height: 40,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
  },
  button: {
    marginTop: 5,
    marginLeft: 5,
    position: "absolute",
    width: 40,
    height: 30,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "700",
  },
});

export default PrimarySwitch;
