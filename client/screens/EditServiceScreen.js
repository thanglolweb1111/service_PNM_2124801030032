import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const EditServiceScreen = ({ route, navigation }) => {
    const { service } = route.params; // Get the service passed from previous screen
    const [name, setName] = useState(service.name);
    const [price, setPrice] = useState(service.price.toString());
    const [description, setDescription] = useState(service.description);
    const [image, setImage] = useState(service.image);
    const [selectedImage, setSelectedImage] = useState(null);

    // Function to pick an image
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setSelectedImage(result.uri); // Set the selected image URI
        }
    };

    const handleSave = async () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('description', description);

        if (selectedImage) {
            const fileName = selectedImage.split('/').pop();
            const fileType = fileName.split('.').pop();

            formData.append('image', {
                uri: selectedImage,
                name: fileName,
                type: `image/${fileType}`,
            });
        }

        try {
            const response = await fetch(`http://192.168.1.6:5000/services/${service._id}`, {
                method: 'PUT',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const result = await response.json();

            if (response.ok) {
                Alert.alert('Cập nhật thành công!', 'Dịch vụ đã được cập nhật.');
                navigation.goBack(); // Go back to the previous screen after saving
            } else {
                Alert.alert('Lỗi', 'Cập nhật thất bại.');
            }
        } catch (error) {
            console.error('Error updating service:', error);
            Alert.alert('Lỗi', 'Không thể cập nhật dịch vụ.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Tên dịch vụ:</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Tên dịch vụ"
            />

            <Text style={styles.label}>Giá:</Text>
            <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                placeholder="Giá"
                keyboardType="numeric"
            />

            <Text style={styles.label}>Mô tả:</Text>
            <TextInput
                style={styles.input}
                value={description}
                onChangeText={setDescription}
                placeholder="Mô tả"
                multiline
            />

            <Text style={styles.label}>Hình ảnh:</Text>
            {selectedImage ? (
                <Image source={{ uri: selectedImage }} style={styles.image} />
            ) : (
                <Image source={{ uri: `http://192.168.1.6:5000${image}` }} style={styles.image} />
            )}
            <Button title="Chọn ảnh" onPress={pickImage} />

            <Button title="Lưu thay đổi" onPress={handleSave} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    image: {
        width: '100%',
        height: 200,
        marginBottom: 12,
        borderRadius: 10,
    },
});

export default EditServiceScreen;
