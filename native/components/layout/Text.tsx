import {
  Text as RNText,
  TextInput as RNTextInput,
  StyleSheet,
  TextInputProps,
  TextProps,
  TextStyle,
} from 'react-native';
import usePreferencesContext from '~/context/PreferencesProvider';
import { getLocale } from '~/services';
import t from '~/utils/text';

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
      {children}
    </TextComponent>
  );
}

export function Text({ children, ...props }: TextProps) {
  const { preferences } = usePreferencesContext();

  return (
    <BaseText TextComponent={RNText} {...props}>
      {typeof children === 'string' ? t(children, getLocale(preferences)) : children}
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
