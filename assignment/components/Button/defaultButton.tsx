import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

const DefaultButton = (props: {
  text: string | undefined;
  onPress: ((event: GestureResponderEvent) => void) | undefined;
}) => {
  const { text, onPress } = props;
  return (
    <TouchableOpacity style={styles.defaultButton} onPress={onPress}>
      <Text style={styles.defaultButtonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  defaultButton: {
    height: 30,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6701',
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  defaultButtonText: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#FFFFFF',
  },
});

export default DefaultButton;
