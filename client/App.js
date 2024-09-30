import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MenuProvider, Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SingupScreen';
import HomeScreen from './screens/HomeScreen';
import EditServiceScreen from './screens/EditServiceScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import OtpVerification from './screens/OtpVerification';
import AddServiceScreen from './screens/AddServiceScreen';
import DetailServiceScreen from './screens/DeltailsServiceScreen';
import HomeServiceScreen from './screens/HomeServiceScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const App = () => {
    const handleLogout = async (navigation) => {
        await AsyncStorage.clear();
        Alert.alert("Bạn đã đăng xuất");
        navigation.navigate('Login');  // Điều hướng về Login
    };

    return (
        <MenuProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Login">
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Signup" component={SignupScreen} />
                    <Stack.Screen
                        name="Home"
                        component={HomeScreen}
                        options={({ navigation }) => ({
                            headerTitle: 'Home', // Tiêu đề của Header
                            headerRight: () => (
                                <Menu>
                                    <MenuTrigger>
                                        <Text style={styles.menuTrigger}>⋮</Text>
                                    </MenuTrigger>
                                    <MenuOptions customStyles={menuStyles}>
                                        <MenuOption onSelect={() => navigation.navigate('HomeService')}>
                                            <Text style={styles.menuText}>Dịch Vụ</Text>
                                        </MenuOption>
                                        <MenuOption onSelect={() => handleLogout(navigation)}>
                                            <Text style={styles.menuText}>Đăng xuất</Text>
                                        </MenuOption>
                                    </MenuOptions>
                                </Menu>
                            ),
                        })}
                    />
                    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                    <Stack.Screen name="OtpVerification" component={OtpVerification} />
                    <Stack.Screen name="AddService" component={AddServiceScreen} />
                    <Stack.Screen name="DetailService" component={DetailServiceScreen} />
                    <Stack.Screen
                        name="HomeService"
                        component={HomeServiceScreen}
                        options={({ navigation }) => ({
                            headerTitle: 'Home Service',
                            headerRight: () => (
                                <Menu>
                                    <MenuTrigger>
                                        <Text style={styles.menuTrigger}>⋮</Text>
                                    </MenuTrigger>
                                    <MenuOptions customStyles={menuStyles}>
                                        <MenuOption onSelect={() => navigation.navigate('AddService')}>
                                            <Text style={styles.menuText}>Thêm Dịch Vụ</Text>
                                        </MenuOption>
                                        <MenuOption onSelect={() => handleLogout(navigation)}>
                                            <Text style={styles.menuText}>Đăng xuất</Text>
                                        </MenuOption>
                                    </MenuOptions>
                                </Menu>
                            ),
                        })}
                    />
                <Stack.Screen name="EditServiceScreen" component={EditServiceScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </MenuProvider>
    );
};

const styles = StyleSheet.create({
    menuTrigger: {
        marginRight: 15,
        fontSize: 16,
        color: '#007AFF',  // Màu xanh nhạt của iOS
    },
    menuText: {
        fontSize: 16,
        color: '#333',
    },
});

const menuStyles = {
    optionsContainer: {
        padding: 10,
        backgroundColor: '#f0f0f0',  // Màu nền cho menu
        borderRadius: 10,  // Làm tròn góc
        marginTop: 40,
    },
    optionWrapper: {
        padding: 10,
    },
    optionText: {
        color: '#007AFF',  // Màu chữ của các tùy chọn
    },
};

export default App;
