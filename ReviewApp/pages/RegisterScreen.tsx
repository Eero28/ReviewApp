import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
//@ts-ignore
import { API_URL } from "@env";
import { useNavigation } from "@react-navigation/native";
type Props = {};

interface RegisterData {
    username: string;
    email: string;
    password: string;
}

const RegisterScreen = (props: Props) => {
    const { control, handleSubmit, formState: { errors } } = useForm();
    const navigation = useNavigation();
    const onSubmit = async (data) => {
        const registerValues= {
            username: data.username,
            email: data.email,
            password: data.password
        }
        try {
            await axios.post(`${API_URL}/users/register`,registerValues)
            console.log("worked")
            navigation.goBack()
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Register</Text>

            <View style={styles.inputContainer}>
                <Text>Username</Text>
                <Controller
                    control={control}
                    rules={{ required: 'Username is required' }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Enter username"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                    name="username"
                />
                {errors.username && (
                    <Text style={styles.error}>{(errors.username as { message?: string }).message}</Text>
                )}
            </View>
            <View style={styles.inputContainer}>
                <Text>Email</Text>
                <Controller
                    control={control}
                    rules={{ required: 'Email is required' }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Enter email"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            keyboardType="email-address"
                        />
                    )}
                    name="email"
                />
                {errors.email && (
                    <Text style={styles.error}>{(errors.email as { message?: string }).message}</Text>
                )}
            </View>
            <View style={styles.inputContainer}>
                <Text>Password</Text>
                <Controller
                    control={control}
                    rules={{ required: 'Password is required' }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Enter password"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            secureTextEntry
                        />
                    )}
                    name="password"
                />
                {errors.password && (
                    <Text style={styles.error}>{(errors.password as { message?: string }).message}</Text>
                )}
            </View>
            <Button title="Register" onPress={handleSubmit(onSubmit)} />
        </View>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        borderBottomWidth: 1,
        padding: 8,
        marginTop: 5,
        borderColor: '#ccc',
    },
    error: {
        color: 'red',
        marginTop: 5,
        fontSize: 12,
    },
});
