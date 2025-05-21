import { Text as RNText, StyleSheet, TextProps, TextStyle, View } from 'react-native';
import Theme from '~/components/theme';
import usePreferencesContext from '~/context/PreferencesProvider';
import { getLocale } from '~/services';
import t from '~/utils/text';

/**
 * Renders a custom text component that adapts its style and content based on user preferences.
 *
 * - If user preferences are not loaded, displays a skeleton placeholder.
 * - Applies a dynamic font family and letter spacing based on the provided style's fontWeight.
 * - If the children prop is a string, it is translated using the user's locale preferences.
 *
 * @param children - The content to display inside the text component. If a string, it will be translated.
 * @param style - Optional style object to customize the text appearance.
 * @param props - Additional props passed to the underlying RNText component.
 * @returns A styled text component or a skeleton placeholder if preferences are not available.
 */
export function Text({ children, style, ...props }: TextProps) {
  const { preferences } = usePreferencesContext();

  const styles = StyleSheet.create({
    text: {
      fontFamily: 'Inter-' + ((style as TextStyle)?.fontWeight || '500'),
      letterSpacing: parseInt((style as TextStyle)?.fontWeight as string) > 500 ? -0.75 : -0.25,
    },
    skeleton: { backgroundColor: Theme.container, borderRadius: 16 },
    skeletonChildren: { opacity: 0 },
  });

  if (preferences === null) {
    return (
      <View style={[styles.skeleton]}>
        <View style={[styles.skeletonChildren]}>
          <RNText>{children}</RNText>
        </View>
      </View>
    );
  }

  return (
    <RNText style={[styles.text, style]} {...props}>
      {typeof children === 'string' ? t(children, getLocale(preferences.spanish!)) : children}
    </RNText>
  );
}
