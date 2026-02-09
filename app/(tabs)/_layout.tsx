import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { fontFamily } from '@/constants/fonts';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

function TabIcon({ 
  name, 
  iconFamily, 
  focused, 
  label 
}: { 
  name: any, 
  iconFamily: 'Ionicons' | 'MaterialCommunityIcons', 
  focused: boolean, 
  label: string 
}) {
  const IconComponent = iconFamily === 'Ionicons' ? Ionicons : MaterialCommunityIcons;

  if (focused) {
    return (
      <View style={styles.activeTabPill}>
        <Text style={styles.activeTabText}>{label}</Text>
        <IconComponent name={name} size={20} color="#003C7A" />
      </View>
    );
  }

  return (
    <View style={styles.inactiveTabContainer}>
      <IconComponent name={name} size={26} color="#FFFFFF" />
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const primaryColor = Colors[colorScheme ?? 'light'].primaryColor || "#003C7A";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: primaryColor,
          height: 70,
          borderRadius: 45,
          width: "95%",
          bottom: 25,
          borderTopWidth: 0,
          paddingHorizontal: 25,
          paddingVertical: 10,
          marginHorizontal: 10,
        
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 16
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              name={focused ? "home" : "home-outline"} 
              iconFamily="Ionicons" 
              focused={focused} 
              label="Home" 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              name="history" 
              iconFamily="MaterialCommunityIcons" 
              focused={focused} 
              label="History" 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="shipping"
        options={{
          title: 'Shipping',
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              name={focused ? "cube" : "cube-outline"} 
              iconFamily="Ionicons" 
              focused={focused} 
              label="Shipping" 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          title: 'Support',
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              name={focused ? "chatbubble-ellipses" : "chatbubble-ellipses-outline"} 
              iconFamily="Ionicons" 
              focused={focused} 
              label="Chat" 
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activeTabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 2,
    width: 110,
    borderRadius: 35,
    minHeight: 40,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  activeTabText: {
    color: '#003C7A',
    fontWeight: '700',
    fontSize: 12,
    fontFamily: fontFamily.Bold,
  },
  inactiveTabContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
  },
});