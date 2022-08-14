import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

const TextButton = (props: {
  text: string | undefined;
  onPress: ((event: GestureResponderEvent) => void) | undefined;
}) => {
  const { text, onPress } = props;
  return (
    <TouchableOpacity style={styles.textButton} onPress={onPress}>
      {text && <Text style={styles.textButtonText}>{text}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  textButton: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButtonText: {
    fontSize: 28,
    fontWeight: 'normal',
    color: '#FF6701',
  },
});

export default TextButton;
