import {
  Text as RNText,
  TextInput as RNTextInput,
  TextProps,
  TextInputProps,
  TextStyle,
  StyleSheet,
} from 'react-native';

interface BaseTextProps extends TextProps {
  TextComponent: React.ElementType;
}

const BaseText = ({ TextComponent, children, style, ...props }: BaseTextProps) => {
  const styles = StyleSheet.create({
    text: {
      fontFamily: 'Inter-' + ((style as TextStyle)?.fontWeight || '500'),
      letterSpacing: -0.5,
    }
  });

  return (
    <TextComponent style={[styles.text, style]} {...props}>
      {children}
    </TextComponent>
  );
};

const Text = ({ children, ...props }: TextProps) => {
  return (
    <BaseText TextComponent={RNText} {...props}>{children}</BaseText>
  );
};

export const TextInput = ({ children, ...props }: TextInputProps) => {
  return (
    <BaseText TextComponent={RNTextInput} {...props}>{children}</BaseText>
  );
};

export default Text;
