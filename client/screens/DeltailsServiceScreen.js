import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DetailServiceScreen = ({ route, navigation }) => {
    const { serviceId } = route.params;
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(null);
    const [emailuser, setEmailUser] = useState(null);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
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
    useEffect(() => {
        const fetchServiceDetails = async () => {
            try {
                const response = await fetch(`http://192.168.1.6:5000/services/${serviceId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch service details');
                }
                const data = await response.json();
                setService(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchServiceDetails();
    }, [serviceId]);
    const handleDelete = async (email) => {
        Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa dịch vụ này không?', [
            {
                text: 'Hủy',
                style: 'cancel',
            },
            {
                text: 'Xóa',
                onPress: async () => {
                    try {
                        const response = await fetch(`http://192.168.1.6:5000/services/${serviceId}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                email: email 
                            }),
                        });
                        if (response.ok) {
                            Alert.alert('Dịch vụ đã được xóa.');
                            navigation.goBack(); 
                        } else {
                            Alert.alert('Xóa thất bại.');
                        }
                    } catch (error) {
                        console.error('Error deleting service:', error);
                        Alert.alert('Đã có lỗi xảy ra khi xóa dịch vụ.');
                    }
                },
            },
        ]);
    };
    

    const handleEdit = () => {
        navigation.navigate('EditServiceScreen', { service });
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }
    if (error) {
        return <Text style={styles.error}>{error}</Text>;
    }

    return (
        <View style={styles.container}>
            {service ? (
                <>
                    <Image source={{ uri: `http://192.168.1.6:5000${service.image}` }} style={styles.image} />
                    <Text style={styles.name}>Tên : {service.name}</Text>
                    <Text style={styles.price}>Giá : {service.price.toLocaleString()} VNĐ</Text>
                    <Text style={styles.description}>Mô Tả : {service.description}</Text>
                    <Text style={styles.description}>Ngày tạo : {formatDate(service.createdAt)}</Text>
                    {userId ===  service.createdBy && (
                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                                <Text style={styles.buttonText}>Chỉnh sửa</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                                <Text style={styles.buttonText}>Xóa</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </>
            ) : (
                <Text style={styles.error}>Service not found.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: 250,
        borderRadius: 10,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    price: {
        fontSize: 20,
        color: 'red',
    },
    description: {
        fontSize: 16,
        marginTop: 10,
    },
    error: {
        fontSize: 18,
        color: 'red',
    },
    buttonsContainer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    editButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    deleteButton: {
        backgroundColor: '#f44336',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default DetailServiceScreen;
