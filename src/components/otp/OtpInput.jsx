import { useRef } from 'react';
import { TextInput } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

const OtpInput = ({ value = '', onChange }) => {
  const inputs = useRef([]);
  const handleChange = (text, idx) => {
    const otpArray = value.split('');
    // Only allow numeric input - reject if no numbers found
    const numericText = text.replace(/[^0-9]/g, '');

    // If text is empty (backspace/delete was pressed)
    if (!text) {
      // Clear current field
      otpArray[idx] = '';
      // Focus previous field if not at the first input
      if (idx > 0) {
        inputs.current[idx - 1].focus();
      }
    } else {
      if (!numericText) {
        // If no numeric characters found, don't update anything
        return;
      }
    }

    otpArray[idx] = text.replace(/[^0-9]/g, '').slice(0, 1);
    const newValue = otpArray.join('').slice(0, 6);

    // Call onChange if it's provided
    if (onChange) {
      onChange(newValue);
    }

    // Move to next field only if we have a valid digit and not at the last input
    if (text && /^\d$/.test(text) && idx < 5) {
      inputs.current[idx + 1].focus();
    }
  };

  const handleKeyPress = (e, idx) => {
    if (e.nativeEvent.key === 'Backspace' && !value[idx] && idx > 0) {
      inputs.current[idx - 1].focus();
    }
  };

  return (
    <View style={styles.container}>
      {[...Array(6)].map((_, idx) => (
        <TextInput
          key={idx}
          ref={ref => (inputs.current[idx] = ref)}
          style={styles.input}
          contentStyle={styles.inputContent}
          keyboardType="number-pad"
          inputMode="numeric"
          value={value[idx] || ''}
          onChangeText={text => handleChange(text, idx)}
          onKeyPress={e => handleKeyPress(e, idx)}
          returnKeyType="next"
          maxLength={1}
          autoFocus={idx === 0}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 24,
    marginHorizontal: 4,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContent: {
    textAlign: 'center',
    width: '100%',
    paddingHorizontal: 0,
  },
});

export default OtpInput;
