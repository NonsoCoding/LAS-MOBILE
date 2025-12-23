import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import * as Notifications from "expo-notifications";

export const requestLocationPermission = async () => {
  const { status }: any = await Location.requestBackgroundPermissionsAsync;
  return status === "granted";
};

export const requestCameraPermissions = async () => {
  const { status }: any = await ImagePicker.requestCameraPermissionsAsync;
  return status === "granted";
};

export const requestGalleryPermissions = async () => {
  const { status }: any = await ImagePicker.requestMediaLibraryPermissionsAsync;
  return status === "granted";
};

export const requestNotificationPermission = async () => {
  const { status }: any = await Notifications.requestPermissionsAsync();
  return status === "granted";
};
