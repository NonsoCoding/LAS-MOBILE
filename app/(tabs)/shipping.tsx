
import BackButton from '@/components/Buttons/BackButton';
import PrimaryButton from '@/components/Buttons/PrimaryButton';
import SearchTextInput from '@/components/Inputs/SearchTextInput';
import TextInputFields from '@/components/Inputs/TextInputFields';
import Colors from '@/constants/Colors';
import { fontFamily } from '@/constants/fonts';
import tw from '@/constants/tailwind';
import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import MapView from 'react-native-maps';
export default function ShippingScreen() {

  const [selected, setSelected] = useState<number | null>(null);
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? "light"];
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  const ProgressBar = () => (
    <View style={[tw`flex-row gap-1`]}>
      {[...Array(5)].map((_, i) => (
        <View
          key={i}
          style={[
            tw`flex-1 h-1 rounded-full`,
            { 
              backgroundColor: i < step 
                ? themeColors.primaryColor 
                : `${themeColors.primaryColor}33` 
            }
          ]}
        />
      ))}
    </View>
  );

  const packagelist = [
    { icon: require("../../assets/images/IntroImages/Gift.png"), name: "Gift" },
    { icon: require("../../assets/images/IntroImages/Gift.png"), name: "GROCERIES" },
    { icon: require("../../assets/images/IntroImages/Gift.png"), name: "Gift" },
  ];

  const ParceList = [
    { name: "Light Parcel Rider", price: "₦2,500", weight: "Up to 10kg", icon: <FontAwesome name="bicycle" size={24} color={themeColors.primaryColor} /> },
    { name: "2-Tonne Truck", price: "₦4,500", weight: "Up to 25kg", icon: <Feather name="truck" size={24} color={themeColors.primaryColor} /> },
    { name: "5-Tonne Truck", price: "₦8,500", weight: "Up to 50kg", icon: <Feather name="truck" size={24} color={themeColors.primaryColor} /> },
  ]

  return (
     <View style={[tw`flex-1 bg-[#19488A] justify-end`, {
    }]}>
      {step === 1 && (
      <View style={[tw`p-5 flex-row items-center gap-2`]}>
        <BackButton
          onPress={() => {
            setStep(1);
          }}
        />
        <Text style={[tw`text-white text-2xl uppercase`, {
          fontFamily: fontFamily.Bold
        }]}>Package Details</Text>
      </View>
      )}

      {step === 2 && (
      <View style={[tw`p-5 flex-row items-center gap-2`]}>
        <BackButton
          onPress={() => {
            setStep(1);
          }}
        />
        <Text style={[tw`text-white text-2xl uppercase`, {
          fontFamily: fontFamily.Bold
        }]}>Delivery Address</Text>
      </View>
      )}

      {step === 3 && (
      <View style={[tw`p-5 flex-row items-center gap-2`]}>
        <BackButton
          onPress={() => {
            setStep(2);
          }}
        />
        <Text style={[tw`text-white text-2xl uppercase`, {
          fontFamily: fontFamily.Bold
        }]}>Recipient’s Info</Text>
      </View>
      )}
      {step === 4 && (
      <View style={[tw`p-5 flex-row items-center gap-2`]}>
        <BackButton
          onPress={() => {
            setStep(3);
          }}
        />
        <Text style={[tw`text-white text-2xl uppercase`, {
          fontFamily: fontFamily.Bold
        }]}>Vehicle Type</Text>
      </View>
      )}
      {step === 5 && (
      <View style={[tw`p-5 flex-row items-center gap-2`]}>
        <BackButton
          onPress={() => {
            setStep(4);
          }}
        />
        <Text style={[tw`text-white text-2xl uppercase`, {
          fontFamily: fontFamily.Bold
        }]}>Choose Carrier</Text>
      </View>
      )}
      <View style={[tw`h-[80%] bg-white rounded-t-5 p-5 pb-10`]}>
          {step === 1 && (
            <>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[tw``]}>
              <View style={[tw`gap-7`]}>
              <View style={[tw`gap-2`]}>
                <Text style={[tw`uppercase`, {
                  fontFamily: fontFamily.Bold
                }]}>Package Details</Text>
                <Text style={[tw`text-[10px] uppercase`, {
                  fontFamily: fontFamily.Medium
                }]}>Tell us about your package</Text>
                </View>
               <ProgressBar />
              <View style={[tw`flex-row gap-2`]}>
                          {packagelist.map((items, index) => {
                              const isSelected = selected === index;
                              return (
                                  <TouchableOpacity
                                      key={index}
                                      onPress={() => {
                                          setSelected(index);
                                      }}
                                      style={[
                                          tw`bg-[#003C7A0D] h-20 flex-1 p-3  gap-3 rounded-lg items-center justify-center`,
                                          {
                                              borderWidth: isSelected ? 1 : 1,
                                              borderColor: isSelected
                                                  ? themeColors.tint
                                                  : "#19488A22",
                                              backgroundColor: isSelected ? "#003C7A15" : "transparent",
                                          },
                                      ]}
                                  >
                                      <Image source={items.icon} style={[tw`h-7 w-7`]} />
                                      <Text style={[tw`font-light text-xs`, {
                                          fontFamily: fontFamily.Medium
                                      }]}>{items.name}</Text>
                                  </TouchableOpacity>
                              )
                          })}
              </View>
              <View style={[tw`gap-3`]}>
                <Text style={[tw`uppercase text-[10px]`, {
                fontFamily: fontFamily.Regular
              }]}>Item Description</Text>
                <TextInputFields
                  
                />
                <Text style={[tw`uppercase text-[10px]`, {
                fontFamily: fontFamily.Regular
              }]}>Estimated Weight (kg)</Text>
                <TextInputFields
                  
                />
                <Text style={[tw`uppercase text-[10px]`, {
                fontFamily: fontFamily.Regular
              }]}>Item Value (₦)</Text>
                <TextInputFields
                  
                />
                <Text style={[tw`uppercase text-[10px] text-[#CC1A21] self-end`, {
                fontFamily: fontFamily.Regular
              }]}>For insurance purposes</Text>
                <Text style={[tw`uppercase text-[10px]`, {
                fontFamily: fontFamily.Regular
              }]}>Special Instructions (Optional)</Text>
                <TextInputFields
                  
                />
              </View>
              <PrimaryButton
                height={50}
                  onpress={() => {
                  setStep(2)
                }}
                bgColors={"#003C7A"}
                text="Continue"
                textColor='white'
              />
              </View>
               </ScrollView>
            </>
            
          )}

          {step === 2 && (
          <>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[tw``]}>
              <View style={[tw`gap-7`]}>
                 <View style={[tw`gap-2`]}>
                <Text style={[tw`uppercase`, {
                  fontFamily: fontFamily.Bold
                }]}>Delivery Address</Text>
                <Text style={[tw`text-[10px] uppercase`, {
                  fontFamily: fontFamily.Medium
                }]}>Where should we deliver your package?</Text>
                </View>
                <ProgressBar />
                <View style={[tw`gap-2`]}>
                  <SearchTextInput
                    placeholderText='SEARCH FOR DELIVERY ADDRESS'
                  />
                  <SearchTextInput
                    placeholderText='SEARCH FOR PICKUP ADDRESS'
                  />
                  
                </View>
                <View>
                  <MapView
                    style={[tw`h-[200px] rounded-md`]}
                    region={{
                      latitude: 6.5244,
                      longitude: 3.3792,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }}
                  >
                    
                 </MapView>
                </View>
                <View style={[tw`gap-10`]}>
                <View style={[tw`flex-row gap-5 items-center`]}>
                  <AntDesign name="clock-circle" size={20} color={themeColors.primaryColor} />
                  <View style={[tw`gap-2`]}>
                    <Text style={[tw`uppercase`, {
                      fontFamily: fontFamily.Medium
                    }]}>Stanzel grand resort</Text>
                    <View style={[tw`flex-row items-center gap-1`]}>
                      <Feather name="map-pin"  size={10} />
                      <Text style={[tw`text-[10px] uppercase`, {
                      fontFamily: fontFamily.Regular
                    }]}>Gwarimpa first avenue</Text>
                    </View>
                  </View>
                </View>
                </View>
                 <PrimaryButton
                height={50}
                  onpress={() => {
                  setStep(3)
                }}
                bgColors={"#003C7A"}
                text="Continue"
                textColor='white'
              />
              </View>
              </ScrollView>
            </>
          )}

          {step === 3 && (
          <>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[tw``]}>
              <View style={[tw`gap-7`]}>
                <View style={[tw`gap-2`]}>
                <Text style={[tw`uppercase`, {
                  fontFamily: fontFamily.Bold
                }]}>recipient’s information</Text>
                <Text style={[tw`text-[10px] uppercase`, {
                  fontFamily: fontFamily.Medium
                }]}>Tell us about who will be receiving the package</Text>
                </View>
                <ProgressBar />
                <View style={[tw`gap-3`]}>
                  <Text style={[tw`text-[10px] uppercase`, {
                    fontFamily: fontFamily.Regular
                  }]}>Full Legal Name</Text>
                <TextInputFields

                  />
                  <Text style={[tw`text-[10px] uppercase`, {
                    fontFamily: fontFamily.Regular
                  }]}>Phone No.</Text>
                <TextInputFields
                  />
                  <Text style={[tw`text-[10px] uppercase`, {
                    fontFamily: fontFamily.Regular
                  }]}>Special Instructions (Optional)</Text>
                <TextInputFields
                  />
                </View>
                <PrimaryButton
                height={50}
                  onpress={() => {
                  setStep(4)
                }}
                bgColors={"#003C7A"}
                text="Continue"
                textColor='white'
              />
              </View>
              </ScrollView>
            </>
        )}
        
          {step === 4 && (
          <>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[tw``]}>
              <View style={[tw`gap-7`]}>
                <View style={[tw`gap-2`]}>
                <Text style={[tw`uppercase`, {
                  fontFamily: fontFamily.Bold
                }]}>recipient’s information</Text>
                <Text style={[tw`text-[10px] uppercase`, {
                  fontFamily: fontFamily.Medium
                }]}>Tell us about who will be receiving the package</Text>
                </View>
                <ProgressBar />
                <View style={[tw`gap-10`]}>
                    {ParceList.map((items, index) => {
                      return (
                        <View key={index} style={[tw`flex-row justify-between`]}>
                          <View style={[tw`flex-row gap-4 items-center`]}>
                            {items.icon}
                  <View>
                    <Text style={[tw`uppercase text-[#19488A]`, {
                      fontFamily: fontFamily.Medium
                            }]}>{items.name}</Text>
                    <Text style={[tw`text-[12px]`, {
                      fontFamily: fontFamily.Light
                            }]}>{items.weight}</Text>
                  </View>
                          </View>
                  <Text style={[tw`text-[17px] text-[#CC1A21]`, {
                    fontFamily: fontFamily.Medium
                          }]}>{items.price}</Text>
               </View>
                      )
                    })}
                </View>
                <PrimaryButton
                height={50}
                  onpress={() => {
                  setStep(5)
                }}
                bgColors={"#003C7A"}
                text="Continue"
                textColor='white'
              />
              </View>
              </ScrollView>
            </>
          )}
       
       </View>
    </View>
  );
}