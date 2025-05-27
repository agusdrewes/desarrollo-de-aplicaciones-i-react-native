import React, { useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const OtpInput = ({ value = '', onChange }) => {
    const inputs = useRef([]);

    const handleChange = (text, idx) => {
        const otpArray = value.split('');
        otpArray[idx] = text.replace(/[^0-9]/g, '');
        const newValue = otpArray.join('').slice(0, 6);
        onChange && onChange(newValue);

        if (text && idx < 5) {
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
                    keyboardType="number-pad"
                    maxLength={1}
                    value={value[idx] || ''}
                    onChangeText={text => handleChange(text, idx)}
                    onKeyPress={e => handleKeyPress(e, idx)}
                    returnKeyType="next"
                    autoFocus={idx === 0}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    input: {
        width: 40,
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        textAlign: 'center',
        fontSize: 24,
        marginHorizontal: 4,
        backgroundColor: '#fff',
    },
});

export default OtpInput;