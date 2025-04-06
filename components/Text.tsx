import { Platform, Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';

interface TextProps extends RNTextProps {
  children: React.ReactNode;
}

const Text = ({ children, ...props }: TextProps) => {
  return (
    <RNText style={[styles.text, props.style]} {...props}>
      {children}
    </RNText>
  );
};

export const fontStyle = {
  fontFamily: Platform.OS === 'web' ? 'Inter' : 'Ubuntu',
  fontFeatureSettings: "'cv01', 'cv02', 'cv06', 'cv11', 'cv12', 'cv13'",
  letterSpacing: Platform.OS === 'android' ? -0.5 : 0,
};

const styles = StyleSheet.create({
  text: fontStyle,
});

export default Text;
