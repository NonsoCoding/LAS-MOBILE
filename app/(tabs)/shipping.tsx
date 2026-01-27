
import BackButton from '@/components/Buttons/BackButton';
import PrimaryButton from '@/components/Buttons/PrimaryButton';
import SearchTextInput from '@/components/Inputs/SearchTextInput';
import TextInputFields from '@/components/Inputs/TextInputFields';
import Colors from '@/constants/Colors';
import { FontTheme } from '@/constants/fonts';
import tw from '@/constants/tailwind';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function ShippingScreen() {

  const [selected, setSelected] = useState<number | null>(null);
  const colorSheme = useColorScheme();
  const themeColors = Colors[colorSheme ?? "light"];
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  const packagelist = [
    {icon: require("../../assets/images/IntroImages/Gift.png"), name: "Gift"},
    {icon: require("../../assets/images/IntroImages/Gift.png"), name: "GROCERIES"},
    {icon: require("../../assets/images/IntroImages/Gift.png"), name: "Gift"},
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
          fontFamily: FontTheme.font.MontserratBold
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
          fontFamily: FontTheme.font.MontserratBold
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
          fontFamily: FontTheme.font.MontserratBold
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
          fontFamily: FontTheme.font.MontserratBold
        }]}>Vehicle Type</Text>
      </View>
      )}
      {step === 5 && (
      <View style={[tw`p-5 flex-row items-center gap-2`]}>
        <BackButton
          onPress={() => {
            setStep(3);
          }}
        />
        <Text style={[tw`text-white text-2xl uppercase`, {
          fontFamily: FontTheme.font.MontserratBold
        }]}>Choose Carrier</Text>
      </View>
      )}
      <View style={[tw`h-[80%] bg-white rounded-t-5 p-5`]}>
          {step === 1 && (
            <>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[tw``]}>
              <View style={[tw`gap-7`]}>
              <View style={[tw`gap-2`]}>
                <Text style={[tw`uppercase`, {
                  fontFamily: FontTheme.font.MontserratBold
                }]}>Package Details</Text>
                <Text style={[tw`text-[10px] uppercase`, {
                  fontFamily: FontTheme.font.MontserratMedium
                }]}>Tell us about your package</Text>
                </View>
               <View style={[tw`flex-row gap-1`]}>
              {[...Array(5)].map((_, i) => (
                <View
                  key={i}
                  style={[
                    tw`flex-1 h-1 rounded-full`,
                    { backgroundColor: themeColors.primaryColor }
                  ]}
                />
              ))}
            </View>
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
                                          fontFamily: FontTheme.font.MontserratMedium
                                      }]}>{items.name}</Text>
                                  </TouchableOpacity>
                              )
                          })}
              </View>
              <View style={[tw`gap-3`]}>
                <Text style={[tw`uppercase text-[10px]`, {
                fontFamily: FontTheme.font.MontserratRegular
              }]}>Item Description</Text>
                <TextInputFields
                  
                />
                <Text style={[tw`uppercase text-[10px]`, {
                fontFamily: FontTheme.font.MontserratRegular
              }]}>Estimated Weight (kg)</Text>
                <TextInputFields
                  
                />
                <Text style={[tw`uppercase text-[10px]`, {
                fontFamily: FontTheme.font.MontserratRegular
              }]}>Item Value (₦)</Text>
                <TextInputFields
                  
                />
                <Text style={[tw`uppercase text-[10px] self-end`, {
                fontFamily: FontTheme.font.MontserratRegular
              }]}>For insurance purposes</Text>
                <Text style={[tw`uppercase text-[10px]`, {
                fontFamily: FontTheme.font.MontserratRegular
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
                  fontFamily: FontTheme.font.MontserratBold
                }]}>Delivery Address</Text>
                <Text style={[tw`text-[10px] uppercase`, {
                  fontFamily: FontTheme.font.MontserratMedium
                }]}>Where should we deliver your package?</Text>
                </View>
                <View style={[tw`flex-row gap-1`]}>
              {[...Array(5)].map((_, i) => (
                <View
                  key={i}
                  style={[
                    tw`flex-1 h-1 rounded-full`,
                    { backgroundColor: themeColors.primaryColor }
                  ]}
                />
              ))}
                </View>
                <View style={[tw`gap-2`]}>
                  <SearchTextInput
                    placeholderText='SEARCH FOR DELIVERY ADDRESS'
                  />
                  <SearchTextInput
                    placeholderText='SEARCH FOR PICKUP ADDRESS'
                  />
                  
                </View>
                <View>
                 
                </View>
                <View style={[tw`gap-10`]}>
                <View style={[tw`flex-row gap-5 items-center`]}>
                  <AntDesign name="clock-circle" size={20} />
                  <View style={[tw`gap-2`]}>
                    <Text style={[tw`uppercase`, {
                      fontFamily: FontTheme.font.MontserratBold
                    }]}>Stanzel grand resort</Text>
                    <View style={[tw`flex-row items-center gap-1`]}>
                      <Feather name="map-pin"  size={15} />
                      <Text style={[tw`text-[10px] uppercase`, {
                      fontFamily: FontTheme.font.MontserratMedium
                    }]}>Gwarimpa first avenue</Text>
                    </View>
                  </View>
                </View>
                <View style={[tw`flex-row gap-5 items-center`]}>
                  <AntDesign name="clock-circle" size={20} />
                  <View style={[tw`gap-2`]}>
                    <Text style={[tw`uppercase`, {
                      fontFamily: FontTheme.font.MontserratBold
                    }]}>Stanzel grand resort</Text>
                    <View style={[tw`flex-row items-center gap-1`]}>
                      <Feather name="map-pin"  size={15} />
                      <Text style={[tw`text-[10px] uppercase`, {
                      fontFamily: FontTheme.font.MontserratMedium
                    }]}>Gwarimpa first avenue</Text>
                    </View>
                  </View>
                </View>
                <View style={[tw`flex-row gap-5 items-center`]}>
                  <AntDesign name="clock-circle" size={20} />
                  <View style={[tw`gap-2`]}>
                    <Text style={[tw`uppercase`, {
                      fontFamily: FontTheme.font.MontserratBold
                    }]}>Stanzel grand resort</Text>
                    <View style={[tw`flex-row items-center gap-1`]}>
                      <Feather name="map-pin"  size={15} />
                      <Text style={[tw`text-[10px] uppercase`, {
                      fontFamily: FontTheme.font.MontserratMedium
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
                  fontFamily: FontTheme.font.MontserratBold
                }]}>recipient’s information</Text>
                <Text style={[tw`text-[10px] uppercase`, {
                  fontFamily: FontTheme.font.MontserratMedium
                }]}>Tell us about who will be receiving the package</Text>
                </View>
                <View style={[tw`flex-row gap-1`]}>
              {[...Array(5)].map((_, i) => (
                <View
                  key={i}
                  style={[
                    tw`flex-1 h-1 rounded-full`,
                    { backgroundColor: themeColors.primaryColor }
                  ]}
                />
              ))}
                </View>
                <View style={[tw`gap-3`]}>
                  <Text style={[tw`text-[10px] uppercase`, {
                    fontFamily: FontTheme.font.MontserratRegular
                  }]}>Full Legal Name</Text>
                <TextInputFields

                  />
                  <Text style={[tw`text-[10px] uppercase`, {
                    fontFamily: FontTheme.font.MontserratRegular
                  }]}>Phone No.</Text>
                <TextInputFields
                  />
                  <Text style={[tw`text-[10px] uppercase`, {
                    fontFamily: FontTheme.font.MontserratRegular
                  }]}>pecial Instructions (Optional)</Text>
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
                  fontFamily: FontTheme.font.MontserratBold
                }]}>recipient’s information</Text>
                <Text style={[tw`text-[10px] uppercase`, {
                  fontFamily: FontTheme.font.MontserratMedium
                }]}>Tell us about who will be receiving the package</Text>
                </View>
                <View style={[tw`flex-row gap-1`]}>
              {[...Array(5)].map((_, i) => (
                <View
                  key={i}
                  style={[
                    tw`flex-1 h-1 rounded-full`,
                    { backgroundColor: themeColors.primaryColor }
                  ]}
                />
              ))}
                </View>
                <View style={[tw`gap-10`]}>
                <View style={[tw`flex-row justify-between`]}>
                  <View>
                    <Text style={[tw`uppercase text-[#19488A]`, {
                      fontFamily: FontTheme.font.MontserratBold
                    }]}>Light Parcel Rider</Text>
                    <Text style={[tw`text-[12px]`, {
                      fontFamily: FontTheme.font.MontserratMedium
                    }]}>Up to 10kg</Text>
                  </View>
                  <Text style={[tw`text-xl text-[#CC1A21]`, {
                    fontFamily: FontTheme.font.MontserratBold
                  }]}>₦2,500</Text>
               </View>
                <View style={[tw`flex-row justify-between`]}>
                  <View>
                    <Text style={[tw`uppercase text-[#19488A]`, {
                      fontFamily: FontTheme.font.MontserratBold
                    }]}>Light Parcel Rider</Text>
                    <Text style={[tw`text-[12px]`, {
                      fontFamily: FontTheme.font.MontserratMedium
                    }]}>Up to 10kg</Text>
                  </View>
                  <Text style={[tw`text-xl text-[#CC1A21]`, {
                    fontFamily: FontTheme.font.MontserratBold
                  }]}>₦2,500</Text>
               </View>
                <View style={[tw`flex-row justify-between`]}>
                  <View>
                    <Text style={[tw`uppercase text-[#19488A]`, {
                      fontFamily: FontTheme.font.MontserratBold
                    }]}>Light Parcel Rider</Text>
                    <Text style={[tw`text-[12px]`, {
                      fontFamily: FontTheme.font.MontserratMedium
                    }]}>Up to 10kg</Text>
                  </View>
                  <Text style={[tw`text-xl text-[#CC1A21]`, {
                    fontFamily: FontTheme.font.MontserratBold
                  }]}>₦2,500</Text>
               </View>
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