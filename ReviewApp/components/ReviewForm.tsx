// BeerForm.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import CameraComponent from "../components/CameraComponent"

interface BeerFormValues {
  beerName: string;
  beerValue: string;
}

const BeerForm: React.FC = () => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<BeerFormValues>();
  const [imageUrl, setImageUrl] = useState<string | null>(null); 
  const [loading, setLoading] = useState<boolean>(false); 

  const onSubmit = async (data: BeerFormValues) => {
    setLoading(true);
    try {
      const reviewData = {
        reviewname: data.beerName,
        reviewRating: data.beerValue,
        imageUrl: imageUrl, 
      };
      reset();
      setImageUrl(null); 
    } catch (error: any) {
      Alert.alert("Error", "There was an issue submitting your review.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Beer Image:</Text>
      <CameraComponent />
      {imageUrl && <Image source={{ uri: imageUrl }} style={styles.imagePreview} />}

      <Text style={styles.label}>Beer Name:</Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Enter beer name"
          />
        )}
        name="beerName"
        rules={{ required: 'Beer name is required' }}
        defaultValue=""
      />
      {errors.beerName && <Text style={styles.error}>{errors.beerName.message}</Text>}

      <Text style={styles.label}>Beer Value:</Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Enter beer value"
            keyboardType="numeric"
          />
        )}
        name="beerValue"
        rules={{ required: 'Beer value is required' }}
        defaultValue=""
      />
      {errors.beerValue && <Text style={styles.error}>{errors.beerValue.message}</Text>}

      <Button title="Submit" onPress={handleSubmit(onSubmit)} disabled={loading} />
      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    padding: 10,
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginVertical: 16,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  loading: {
    marginTop: 20,
  },
});

export default BeerForm;
