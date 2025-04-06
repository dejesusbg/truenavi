import { Platform, Text as RNText, TextInput as RNTextInput, TextProps, TextInputProps, TextStyle, StyleSheet } from 'react-native';

interface BaseTextProps extends TextProps {
  TextComponent: React.ElementType;
}

const BaseText = ({ TextComponent, children, style, ...props }: BaseTextProps) => {
  const fontFamily = {
    fontFamily: Platform.OS === 'android'
      ? "Ubuntu-" + ((style as TextStyle)?.fontWeight || "500")
      : 'Inter'
  };

  return (
    <TextComponent style={[styles.text, fontFamily, style]} {...props}>
      {children}
    </TextComponent>
  );
};

const Text = ({ children, ...props }: TextProps) => {
  return <BaseText TextComponent={RNText} {...props}>{children}</BaseText>;
}

export const TextInput = ({ children, ...props }: TextInputProps) => {
  return <BaseText TextComponent={RNTextInput} {...props}>{children}</BaseText>;
}

export const fontStyle = {
  fontFeatureSettings: "'cv01', 'cv02', 'cv06', 'cv11', 'cv12', 'cv13'",
  letterSpacing: Platform.OS === 'android' ? -0.5 : 0,
};

const styles = StyleSheet.create({
  text: fontStyle,
});

export default Text;
