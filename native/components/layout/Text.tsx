import {
  Text as RNText,
  TextInput as RNTextInput,
  TextProps,
  TextInputProps,
  TextStyle,
  StyleSheet,
} from 'react-native';
import t, { defaultLanguage } from '~/utils/text/translation';

interface BaseTextProps extends TextProps {
  TextComponent: React.ElementType;
}

function BaseText({ TextComponent, children, style, ...props }: BaseTextProps) {
  const styles = StyleSheet.create({
    text: {
      fontFamily: 'Inter-' + ((style as TextStyle)?.fontWeight || '500'),
      letterSpacing: parseInt((style as TextStyle)?.fontWeight as string) > 500 ? -0.75 : -0.25,
    },
  });

  return (
    <TextComponent style={[styles.text, style]} {...props}>
      {typeof children === 'string' ? t(children) : children}
    </TextComponent>
  );
}

export function Text({ children, ...props }: TextProps) {
  return (
    <BaseText TextComponent={RNText} {...props}>
      {children}
    </BaseText>
  );
}

export function TextInput({ children, ...props }: TextInputProps) {
  return (
    <BaseText TextComponent={RNTextInput} {...props}>
      {children}
    </BaseText>
  );
}
