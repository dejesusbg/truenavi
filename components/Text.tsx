import { Text as RNText, TextProps as RNTextProps } from 'react-native';

interface TextProps extends RNTextProps {
  children: React.ReactNode;
  className?: string;
}

const Text = ({ className, children, ...props }: TextProps) => {
  return (
    <RNText
      className={className}
      style={[
        {
          fontFamily: 'Inter',
          fontFeatureSettings: "'cv01', 'cv02', 'cv06', 'cv11', 'cv12', 'cv13'",
        },
        props.style,
      ]}
      {...props}>
      {children}
    </RNText>
  );
};

export default Text;
