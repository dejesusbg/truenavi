import React from 'react';
import { View, SafeAreaView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Text from '../components/Text';

const Home = () => {
  return (
    <SafeAreaView className="items-center justify-center flex-1">
      {/* Content */}
      <View className="items-center justify-between flex-1 w-full p-5 bg-transparent">
        {/* Close button */}
        <TouchableOpacity className="items-center self-end justify-center w-8 h-8">
          <Text className="text-xl text-white opacity-80">✕</Text>
        </TouchableOpacity>

        {/* Glowing orb visualization */}
        <View className="items-center justify-center mt-10 h-44 w-44">
          <View className="absolute h-44 w-44 rounded-full bg-[#8a5aff] opacity-30" />
          <View className="shadow-offset-0 shadow-opacity-80 shadow-radius-5 shadow-elevation-10 h-36 w-36 items-center justify-center rounded-full shadow-[#8a5aff]">
            <LinearGradient
              colors={['#9a6aff', '#5d30d3']}
              className="border-4 rounded-full h-36 w-36 border-white/10"
              start={{ x: 0.1, y: 0.1 }}
              end={{ x: 0.9, y: 0.9 }}
            />
          </View>
        </View>

        {/* Text content */}
        <View className="items-center mt-12 mb-auto">
          <Text className="text-2xl font-semibold leading-8 text-center text-white">
            {'Where would you like\n me to take you?'}
          </Text>
        </View>

        {/* Bottom wave */}
        <View className="opacity absolute bottom-0 h-24 w-[75%] self-center rounded-t-full bg-[#6a39ff]/10">
          {/* Play button */}
          <TouchableOpacity className="px-5 py-2 mt-10">
            <Text className="text-base text-white/60">play a song</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;
