import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import React, { FC } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../ContexApi';



interface LoginData {
  email: string;
  password: string;
}

const LoginScreen: FC<{ navigation: any }> = ({ navigation }) => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const { handleLogin } = useAuth();

  const onSubmit = async (data) => {
    const loginData: LoginData = {
      email: data.email,
      password: data.password
    };

    try {
      await handleLogin(loginData.email, loginData.password);
    } catch (error: any) {
      console.error("Login error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>

      <View style={styles.inputContainer}>
        <Text>Email</Text>
        <Controller
          control={control}
          rules={{ required: 'Email is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Enter username"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
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

      <Button title="Login" onPress={handleSubmit(onSubmit)} />
      <Button
        title="Don't have an account? Register"
        onPress={() => navigation.navigate('Register')}
      />
    </View>
  );
};

export default LoginScreen;

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
