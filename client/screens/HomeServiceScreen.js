import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput } from 'react-native';

const HomeServiceScreen = ({ navigation }) => {
    const [services, setServices] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [searchQuery, setSearchQuery] = useState(''); 

    const fetchServices = async () => {
        try {
            const response = await fetch('http://192.168.1.6:5000/services'); 
            const data = await response.json();
            console.log('Dịch vụ:', data);
            setServices(data); 
        } catch (error) {
            console.error('Lỗi khi lấy dịch vụ:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices(); 
    }, []);

    const filteredServices = services.filter((service) =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.itemContainer}
            onPress={() => navigation.navigate('DetailService', { serviceId: item._id })}
        >
            <Image 
                source={{ uri: `http://192.168.1.6:5000${item.image}` }} 
                style={styles.image}
            />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>{item.price.toLocaleString()} VNĐ</Text>
            <Text style={styles.description} numberOfLines={2}>
                {item.description}
            </Text>
        </TouchableOpacity>
    );
    
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6200ee" />
                <Text style={styles.loadingText}>Đang tải dịch vụ...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchBar}
                placeholder="Tìm kiếm dịch vụ..."
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
            />
            <FlatList
                data={filteredServices}
                renderItem={renderItem}
                keyExtractor={item => item._id} 
                contentContainerStyle={{ padding: 10 }}
                showsVerticalScrollIndicator={false} 
                ListEmptyComponent={() => (
                    <Text style={styles.noResultsText}>Không tìm thấy dịch vụ phù hợp.</Text>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f5', // Light background color for contrast
    },
    searchBar: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 12,
        fontSize: 16,
        margin: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#6200ee', // Primary color for loading text
    },
    itemContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    image: {
        width: '100%',
        height: 200, // Adjust height for a better aspect ratio
        borderRadius: 15,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 5,
        color: '#333', // Darker text for readability
    },
    price: {
        fontSize: 18,
        color: '#ff5722', // Highlight price with a distinct color
        marginBottom: 5,
    },
    description: {
        fontSize: 14,
        color: '#666', // Lighter color for description
        marginTop: 5,
        lineHeight: 18,
    },
    noResultsText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#888',
        marginTop: 20,
    },
});

export default HomeServiceScreen;
