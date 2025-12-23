import Colors from "@/constants/Colors";
import tw from "@/constants/tailwind";
import {
  Check,
  CheckCircle,
  ChevronDown,
  Package,
  Truck,
  X,
} from "lucide-react-native";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

interface StatusModalProps {
  visible: boolean;
  onClose: () => void;
  currentStatus: string;
  onStatusChange: (status: string) => void;
}

const StatusModal = ({
  visible,
  onClose,
  currentStatus,
  onStatusChange,
}: StatusModalProps) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];

  const statusOptions = [
    {
      id: "accepted",
      title: "Order Accepted",
      description: "Confirm you will pick up this order",
      icon: Check,
      color: "#FFF4E6",
      iconColor: "#F2994A",
    },
    {
      id: "picked-up",
      title: "Picked Up",
      description: "Confirm you will pick up this order",
      icon: Package,
      color: "#FFF4E6",
      iconColor: "#F2994A",
    },
    {
      id: "in-transit",
      title: "In Transit",
      description: "On the way to destination",
      icon: Truck,
      color: "#FFF4E6",
      iconColor: "#F2994A",
    },
    {
      id: "delivered",
      title: "Delivered",
      description: "Package handed to customer",
      icon: CheckCircle,
      color: "#FFF4E6",
      iconColor: "#F2994A",
    },
  ];

  const handleStatusSelect = (statusId: string) => {
    setSelectedStatus(statusId);
    onStatusChange(statusId);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={[
          tw`flex-1 justify-center p-4`,
          { backgroundColor: "rgba(0, 0, 0, 0.5)" },
        ]}
      >
        <View
          style={[
            tw`bg-white gap-4 rounded-3xl px-5 pb-8 pt-6`,
            { maxHeight: "85%" },
          ]}
        >
          <TouchableOpacity
            onPress={onClose}
            style={[
              tw`rounded-full self-end p-1`,
              {
                backgroundColor: themeColors.tintLight,
              },
            ]}
          >
            <X color={themeColors.primaryColor} />
          </TouchableOpacity>
          {/* Current Status Section */}
          <View style={[tw`mb-6`]}>
            <View style={[tw`flex-row items-center justify-between mb-3`]}>
              <Text style={[tw`text-lg font-semibold`]}>Current Status</Text>
              <ChevronDown size={20} color="#666" />
            </View>

            <View
              style={[
                tw`flex-row items-center p-4 rounded-2xl`,
                { backgroundColor: "#E8F5E9" },
              ]}
            >
              <View
                style={[
                  tw`h-12 w-12 rounded-full items-center justify-center mr-3`,
                  { backgroundColor: "#C8E6C9" },
                ]}
              >
                <Truck size={24} color="#27AE60" />
              </View>
              <View style={[tw`flex-1`]}>
                <Text style={[tw`font-semibold text-base mb-0.5`]}>
                  In Transit
                </Text>
                <Text style={[tw`text-sm text-gray-600`]}>
                  Diver on the way to destination
                </Text>
              </View>
            </View>
          </View>

          {/* Select New Status Section */}
          <View style={[tw`mb-4`]}>
            <View style={[tw`flex-row items-center justify-between mb-3`]}>
              <Text style={[tw`text-lg font-semibold`]}>Select new status</Text>
              <ChevronDown size={20} color="#666" />
            </View>

            <ScrollView
              style={[tw`max-h-96`]}
              showsVerticalScrollIndicator={false}
            >
              <View style={[tw`gap-3`]}>
                {statusOptions.map((status) => {
                  const IconComponent = status.icon;
                  return (
                    <TouchableOpacity
                      key={status.id}
                      onPress={() => handleStatusSelect(status.id)}
                      style={[
                        tw`flex-row items-center p-4 rounded-2xl border`,
                        {
                          backgroundColor: status.color,
                          borderColor:
                            selectedStatus === status.id
                              ? status.iconColor
                              : "transparent",
                          borderWidth: selectedStatus === status.id ? 2 : 0,
                        },
                      ]}
                    >
                      <View
                        style={[
                          tw`h-12 w-12 rounded-full items-center justify-center mr-3`,
                          { backgroundColor: "white" },
                        ]}
                      >
                        <IconComponent size={24} color={status.iconColor} />
                      </View>
                      <View style={[tw`flex-1`]}>
                        <Text style={[tw`font-semibold text-base mb-0.5`]}>
                          {status.title}
                        </Text>
                        <Text style={[tw`text-sm text-gray-600`]}>
                          {status.description}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default StatusModal;
