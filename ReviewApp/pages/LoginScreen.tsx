import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { FC, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../ContexApi';

interface LoginData {
  email: string;
  password: string;
}

const LoginScreen: FC<{ navigation: any }> = ({ navigation }) => {
  const { control, handleSubmit, formState: { errors } } = useForm<LoginData>();
  const { handleLogin } = useAuth();
  const [loginError, setLoginError] = useState(false);

  const onSubmit = async ({ email, password }: LoginData) => {
    setLoginError(false);
    try {
      await handleLogin(email, password);
    } catch {
      setLoginError(true);
    }
  };

  const renderError = (fieldError?: { message?: string }) =>
    fieldError?.message ? <Text style={styles.error}>{fieldError.message}</Text> : null;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>

      <View style={styles.inputContainer}>
        <Text>Email</Text>
        <Controller
          control={control}
          rules={{ required: 'Email is required' }}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Enter email"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />
        {renderError(errors.email)}
      </View>

      <View style={styles.inputContainer}>
        <Text>Password</Text>
        <Controller
          control={control}
          rules={{ required: 'Password is required' }}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
              autoCapitalize="none"
            />
          )}
        />
        {renderError(errors.password)}
      </View>

      {loginError && <Text style={[styles.error, styles.errorCredentials]}>Wrong credentials!</Text>}

      <Button title="Login" onPress={handleSubmit(onSubmit)} />
      <Button title="Don't have an account? Register" onPress={() => navigation.navigate('Register')} />
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
  errorCredentials: {
    textAlign: 'center',
    marginBottom: 10,
  },
});
