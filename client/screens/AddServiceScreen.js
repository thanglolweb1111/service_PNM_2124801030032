import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, TouchableOpacity, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddServiceScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [userId, setUserId] = useState(null);
    const [emailuser, setEmailUser] = useState(null);

    useEffect(() => {
        const getUserId = async () => {
            try {
                const userJson = await AsyncStorage.getItem('user');
                const user = userJson ? JSON.parse(userJson) : null;
                if (user) {
                    setUserId(user._id);
                    setEmailUser(user.email);
                }
            } catch (error) {
                console.error('Error retrieving user from AsyncStorage:', error);
            }
        };
        getUserId();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        if (!name || !price || !description || !image) {
            Alert.alert('Error', 'Vui lòng điền đầy đủ thông tin.');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('uemail', emailuser);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('image', {
            uri: image,
            name: 'service_image.jpg',
            type: 'image/jpeg',
        });
        formData.append('userId', userId);

        try {
            const response = await fetch('http://192.168.1.6:5000/services/create', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const result = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Thêm Thành Công');
                // navigation.navigate('Home');
            } else {
                console.error('Error:', result);
            }
        } catch (error) {
            console.error('API Error:', error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Thêm Dịch Vụ</Text>

            <Text style={styles.label}>Tên dịch vụ</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Nhập tên dịch vụ"
                placeholderTextColor="#888"
            />

            <Text style={styles.label}>Giá</Text>
            <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                placeholder="Nhập giá"
                placeholderTextColor="#888"
                keyboardType="numeric"
            />

            <Text style={styles.label}>Mô tả</Text>
            <TextInput
                style={styles.textArea}
                value={description}
                onChangeText={setDescription}
                placeholder="Nhập mô tả"
                placeholderTextColor="#888"
                multiline
                numberOfLines={4}
            />

            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                <Text style={styles.imagePickerText}>Chọn Ảnh</Text>
            </TouchableOpacity>

            {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Thêm Dịch Vụ</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        color: '#2C3E50',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#34495E',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 16,
        borderRadius: 8,
        backgroundColor: '#fff',
        color: '#333',
    },
    textArea: {
        height: 100,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 8,
        textAlignVertical: 'top',
        backgroundColor: '#fff',
        marginBottom: 16,
    },
    imagePickerButton: {
        backgroundColor: '#3498DB',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    imagePickerText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    imagePreview: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 16,
        resizeMode: 'cover',
    },
    submitButton: {
        backgroundColor: '#27AE60',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default AddServiceScreen;
