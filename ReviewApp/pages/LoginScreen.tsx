import { StyleSheet, Text, View, TextInput, Pressable } from "react-native";
import { FC, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "../providers/ContexApi";
import KeyboardAvoidContainer from "../components/KeyboardAvoidContainer";
import { useTheme } from "../providers/ThemeContext";

interface LoginData {
  email: string;
  password: string;
}

const LoginScreen: FC<{ navigation: any }> = ({ navigation }) => {
  const { control, handleSubmit, formState: { errors } } = useForm<LoginData>();
  const { handleLogin } = useAuth();
  const [loginError, setLoginError] = useState(false);

  const { colors, fonts, paddingSpacing } = useTheme();

  const onSubmit = async ({ email, password }: LoginData) => {
    setLoginError(false);
    try {
      await handleLogin(email, password);
    } catch (error) {
      console.log(error);
      setLoginError(true);
    }
  };

  const renderError = (fieldError?: { message?: string }) =>
    fieldError?.message ? (
      <Text style={[styles.error, { color: colors.alerts.danger }]}>
        {fieldError.message}
      </Text>
    ) : null;

  return (
    <KeyboardAvoidContainer>
      <View style={[styles.container, { backgroundColor: colors.bg, padding: paddingSpacing.md }]}>
        <Text
          style={[
            styles.header,
            { color: colors.textColorPrimary, fontFamily: fonts.bold },
          ]}
        >
          Login
        </Text>

        <View style={styles.inputContainer}>
          <Text style={{ color: colors.textColorPrimary, fontFamily: fonts.medium }}>
            Email
          </Text>
          <Controller
            control={control}
            rules={{ required: "Email is required" }}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.textColorPrimary,
                    borderColor: colors.card.border,
                    backgroundColor: colors.form.input,
                  },
                ]}
                placeholder="Enter email"
                placeholderTextColor={colors.textColorSecondary}
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
          <Text style={{ color: colors.textColorPrimary, fontFamily: fonts.medium }}>
            Password
          </Text>
          <Controller
            control={control}
            rules={{ required: "Password is required" }}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.textColorPrimary,
                    borderColor: colors.card.border,
                    backgroundColor: colors.form.input,
                  },
                ]}
                placeholder="Enter password"
                placeholderTextColor={colors.textColorSecondary}
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

        {loginError && (
          <Text style={[styles.error, styles.errorCredentials, { color: colors.alerts.danger }]}>
            Wrong credentials!
          </Text>
        )}

        <Pressable
          style={[styles.button, { backgroundColor: colors.button.bg }]}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={[styles.buttonText, { fontFamily: fonts.bold }]}>Login</Text>
        </Pressable>

        <Pressable
          style={[styles.button]}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={{ color: colors.textColorPrimary, textAlign: "center", fontFamily: fonts.medium }}>
            Don't have an account? Register
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidContainer>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    padding: 8,
    marginTop: 5,
    borderRadius: 6,
  },
  error: {
    marginTop: 5,
    fontSize: 12,
  },
  errorCredentials: {
    textAlign: "center",
    marginBottom: 10,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
