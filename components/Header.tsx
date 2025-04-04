import { View } from 'react-native';
import Text from './Text';

const Header = ({ title }: { title: string }) => {
  return (
    <View className="flex-row items-center justify-between w-full h-16 px-4 bg-tn-purple backdrop-blur">
      <Text className="text-xl font-medium tracking-tight text-tn-white">{title}</Text>
      <Text className="text-xl font-medium tracking-tight text-tn-white">X</Text>
    </View>
  );
};

export default Header;
