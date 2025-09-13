import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { API_URL } from "@env";
import { useNavigation } from "@react-navigation/native";
import KeyboardAvoidContainer from "../components/KeyboardAvoidContainer";
import { useTheme } from "../providers/ThemeContext";

const RegisterScreen = () => {
    const { control, handleSubmit, formState: { errors } } = useForm();
    const navigation = useNavigation();
    const { colors, fonts, paddingSpacing } = useTheme();

    const onSubmit = async (data: any) => {
        const registerValues = {
            username: data.username,
            email: data.email,
            password: data.password,
        };
        try {
            await axios.post(`${API_URL}/auth/register`, registerValues);
            navigation.goBack();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <KeyboardAvoidContainer>
            <View style={[styles.container, { backgroundColor: colors.bg, padding: paddingSpacing.md }]}>
                <Text
                    style={[
                        styles.header,
                        { color: colors.textColorPrimary, fontFamily: fonts.bold },
                    ]}
                >
                    Register
                </Text>

                <View style={styles.inputContainer}>
                    <Text style={{ color: colors.textColorPrimary, fontFamily: fonts.medium }}>
                        Username
                    </Text>
                    <Controller
                        control={control}
                        rules={{ required: "Username is required" }}
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
                                placeholder="Enter username"
                                placeholderTextColor={colors.textColorSecondary}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                        name="username"
                    />
                    {errors.username && (
                        <Text style={[styles.error, { color: colors.alerts.danger }]}>
                            {(errors.username as { message?: string }).message}
                        </Text>
                    )}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={{ color: colors.textColorPrimary, fontFamily: fonts.medium }}>
                        Email
                    </Text>
                    <Controller
                        control={control}
                        rules={{ required: "Email is required" }}
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
                            />
                        )}
                        name="email"
                    />
                    {errors.email && (
                        <Text style={[styles.error, { color: colors.alerts.danger }]}>
                            {(errors.email as { message?: string }).message}
                        </Text>
                    )}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={{ color: colors.textColorPrimary, fontFamily: fonts.medium }}>
                        Password
                    </Text>
                    <Controller
                        control={control}
                        rules={{ required: "Password is required" }}
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
                            />
                        )}
                        name="password"
                    />
                    {errors.password && (
                        <Text style={[styles.error, { color: colors.alerts.danger }]}>
                            {(errors.password as { message?: string }).message}
                        </Text>
                    )}
                </View>

                <Button title="Register" onPress={handleSubmit(onSubmit)} />
            </View>
        </KeyboardAvoidContainer>
    );
};

export default RegisterScreen;

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
});
