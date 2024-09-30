import React, { useEffect } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MenuProvider } from 'react-native-popup-menu';

const HomeScreen = ({ navigation }) => {
    useEffect(() => {
        const checkTokens = async () => {
            try {
                const tokenAccess = await AsyncStorage.getItem('tokenAccess');
                const tokenRefresh = await AsyncStorage.getItem('tokenRefresh');
                const userJson = await AsyncStorage.getItem('user');
                const user = userJson ? JSON.parse(userJson) : null;

                if (!tokenAccess || !tokenRefresh || !user) {
                    Alert.alert('Vui lòng đăng nhập lại');
                    navigation.navigate('Login');
                    return;
                }

                const userId = user._id;
                console.log('Checking tokens...');
                console.log('Access Token:', tokenAccess);
                console.log('Refresh Token:', tokenRefresh);
                console.log('User ID:', userId);

                const response = await fetch('http://192.168.1.6:5000/api/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tokenAccess, tokenRefresh, user: userId }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    if (errorData.error === "Token đã hết hạn") {
                        await refreshAccessToken(userId, tokenRefresh);
                    } else {
                        throw new Error(`Verification failed: ${errorData.message || 'Unknown error'}`);
                    }
                } else {
                    const data = await response.json();
                    if (data.message === 'success') {
                        console.log('Tokens are valid');
                    } else {
                        Alert.alert('Token không hợp lệ hoặc đã hết hạn', 'Mở rộng phiên đăng nhập', [
                            { text: 'Cancel', onPress: () => navigation.navigate('Login') },
                            { text: 'OK', onPress: () => refreshAccessToken(userId, tokenRefresh) },
                        ]);
                    }
                }
            } catch (error) {
                console.error('Error during token check:', error);
                Alert.alert('Có lỗi xảy ra:', error.message);
            }
        };

        checkTokens();
        const interval = setInterval(checkTokens, 10 * 60 * 1000);
        return () => clearInterval(interval);
    }, [navigation]);

    const refreshAccessToken = async (userId, tokenRefresh) => {
        try {
            const refreshResponse = await fetch('http://192.168.1.6:5000/api/me', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tokenRefresh, user: userId }),
            });
            if (!refreshResponse.ok) {
                throw new Error('Failed to refresh token');
            }

            const refreshData = await refreshResponse.json();
            if (refreshData.newAccessToken && refreshData.newRefreshToken) {
                await AsyncStorage.setItem('tokenAccess', refreshData.newAccessToken);
                await AsyncStorage.setItem('tokenRefresh', refreshData.newRefreshToken);
                Alert.alert('Cập nhật token thành công');
            } else {
                Alert.alert('Cập nhật token thất bại');
            }
        } catch (error) {
            Alert.alert('Lỗi khi cập nhật token:', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text>Welcome to the Home Screen!</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default HomeScreen;
