import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Đừng quên import AsyncStorage

const OtpVerification = ({ route, navigation }) => {
    const { email, password } = route.params; // Nhận email và mật khẩu từ params
    const [otp, setOtp] = useState(''); // Trạng thái cho OTP

    const handleLogin = async (email, password) => {
        const API_URL = 'http://192.168.1.6:5000/api/auth/login';
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (data.error) {
                Alert.alert('Lỗi', data.error);
            } else {
                // Lưu trữ token và thông tin người dùng
                await AsyncStorage.setItem('tokenAccess', data.tokenAccess);
                await AsyncStorage.setItem('tokenRefresh', data.tokenRefresh);
                await AsyncStorage.setItem('user', JSON.stringify(data.user));
                Alert.alert('Thành công', 'Đăng nhập thành công');
                navigation.navigate('Home'); // Điều hướng đến Home sau khi đăng nhập
            }
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            Alert.alert('Lỗi', 'Đã xảy ra lỗi trong quá trình đăng nhập');
        }
    };

    const handleVerifyOtp = async () => {
        const API_URL = 'http://192.168.1.6:5000/api/auth/verify-otp'; // Thay đổi URL theo API của bạn

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, otp }), // Gửi email, mật khẩu và OTP
            });

            const data = await response.json();

            if (data.error) {
                Alert.alert('Lỗi', data.error);
            } else {
                Alert.alert('Thành công', 'OTP đã được xác thực!');
                // Gọi hàm đăng nhập sau khi xác thực thành công
                await handleLogin(email, password);
            }
        } catch (error) {
            console.error('Lỗi xác thực OTP:', error);
            Alert.alert('Lỗi', 'Đã xảy ra lỗi trong quá trình xác thực OTP');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Xác thực OTP</Text>
            <Text style={styles.instructions}>Mã OTP đã được gửi đến email: {email}</Text>
            <TextInput
                style={styles.input}
                placeholder="Nhập mã OTP"
                keyboardType="numeric"
                value={otp}
                onChangeText={setOtp}
            />
            <TouchableOpacity onPress={handleVerifyOtp} style={styles.button}>
                <Text style={styles.buttonText}>Xác thực</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 10,
        textAlign: 'center',
    },
    instructions: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#ff8c00',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default OtpVerification;
