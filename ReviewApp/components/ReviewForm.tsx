import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import CameraComponent from "../components/CameraComponent";
import { NavigationProp } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios, { AxiosError } from "axios";
// @ts-expect-error
import { API_URL } from "@env";
import { useAuth } from '../ContexApi';

interface BeerFormValues {
  reviewName: string;
  reviewRating: number | null;
  reviewText: string;
  category: string | null;
}

interface NavigationProps {
  navigation: NavigationProp<any>;
}

const ReviewForm: React.FC<NavigationProps> = ({ navigation }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<BeerFormValues>({
    defaultValues: {
      reviewName: '',
      reviewText: '',
      reviewRating: null,
      category: null,
    }
  });

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { userInfo, getReviews, allReviewsFetch } = useAuth();

  const onImageCaptured = (url: string) => {
    setImageUrl(url);
  };

  const discardImage = () => {
    setImageUrl(null);
  };

  const onSubmit = async (data: BeerFormValues) => {
    try {
      const reviewData = {
        reviewname: data.reviewName,
        reviewDescription: data.reviewText,
        reviewRating: data.reviewRating,
        category: data.category,
        imageUrl: imageUrl,
        id_user: userInfo?.id_user,
      };
      await axios.post(`${API_URL}/review`, reviewData);
      reset();
      setImageUrl(null);
      navigation.goBack();
      getReviews();
      allReviewsFetch();
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data);
      } else {
        console.error('Unexpected error', error);
      }
    }
  };

  // If no image then go to cameracomponent
  if (!imageUrl) {
    return <CameraComponent navigation={navigation} onImageCaptured={onImageCaptured} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Your Review</Text>

      <Image source={{ uri: imageUrl }} style={styles.imagePreview} />
      <Button title="Discard Image" onPress={discardImage} color="#ff4d4d" />

      <Text style={styles.label}>Review Name</Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Enter review name"
          />
        )}
        name="reviewName"
        rules={{ required: 'Review name is required' }}
      />
      {errors.reviewName && <Text style={styles.error}>{errors.reviewName.message}</Text>}

      <Text style={styles.label}>Review Text</Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, { height: 100 }]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            numberOfLines={4}
            multiline={true}
            placeholder="Enter review text"
          />
        )}
        name="reviewText"
        rules={{ required: 'Review text is required' }}
      />
      {errors.reviewText && <Text style={styles.error}>{errors.reviewText.message}</Text>}

      <Text style={styles.label}>Review Rating</Text>
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <RNPickerSelect
            onValueChange={onChange}
            value={value}
            items={[...Array(17)].map((_, i) => {
              const v = 1 + i * 0.25;
              return { label: v.toString(), value: v };
            })}
            placeholder={{ label: "Select a rating", value: null }}
            style={{ inputIOS: styles.pickerInput, inputAndroid: styles.pickerInput }}
          />
        )}
        name="reviewRating"
        rules={{ required: 'Rating is required' }}
      />
      {errors.reviewRating && <Text style={styles.error}>{errors.reviewRating.message}</Text>}

      <Text style={styles.label}>Category</Text>
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <RNPickerSelect
            onValueChange={onChange}
            value={value}
            items={[
              { label: 'Wine', value: 'wine' },
              { label: 'Beer', value: 'beer' },
              { label: 'Softdrink', value: 'softdrink' },
              { label: 'Hot beverage', value: 'hotbeverage' },
              { label: 'Cocktail', value: 'cocktail' },
              { label: 'Other', value: 'other' },
            ]}
            placeholder={{ label: "Select a category", value: null }}
            style={{ inputIOS: styles.pickerInput, inputAndroid: styles.pickerInput }}
          />
        )}
        name="category"
        rules={{ required: 'Category is required' }}
      />
      {errors.category && <Text style={styles.error}>{errors.category.message}</Text>}

      <View style={styles.buttonContainer}>
        <Button title="Submit Review" onPress={handleSubmit(onSubmit)} color="#4CAF50" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40, backgroundColor: '#fafafa' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  imagePreview: { width: '100%', height: 220, borderRadius: 10, marginBottom: 10 },
  label: { fontSize: 16, marginBottom: 6, fontWeight: '600', color: '#444' },
  input: {
    height: 45,
    borderColor: '#bbb',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 14,
    backgroundColor: '#fff',
  },
  pickerInput: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    color: '#333',
    backgroundColor: '#fff',
    marginBottom: 14,
  },
  error: { color: '#d32f2f', marginBottom: 10 },
  buttonContainer: { marginTop: 10, borderRadius: 8, overflow: 'hidden' },
});

export default ReviewForm;
