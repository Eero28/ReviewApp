import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import CameraComponent from "../components/CameraComponent";
import { NavigationProp } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from "axios"
//@ts-ignore
import {API_URL} from "@env"
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
  const { control, handleSubmit, reset, formState: { errors } } = useForm<BeerFormValues>();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const {userInfo, getReviews, allReviewsFetch} = useAuth()

  const onImageCaptured = (url: string) => {
    setImageUrl(url);
  };

  const onSubmit = async (data: BeerFormValues) => {
    
    try {
      const reviewData = {
        reviewname: data.reviewName,
        reviewDescription: data.reviewText,
        reviewRating: data.reviewRating,
        category: data.category,
        imageUrl: imageUrl,
        id_user: userInfo?.id_user
      };
      await axios.post(`${API_URL}/review`, reviewData);
      reset();
      setImageUrl(null);
      navigation.goBack()
      getReviews()
      allReviewsFetch()
    } catch (error: any) {
      console.error(error.response.data);
    }
  };

  return (
    <View style={styles.container}>
      <CameraComponent navigation={navigation} onImageCaptured={onImageCaptured} />

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
        defaultValue=""
      />
      {errors.reviewName && <Text style={styles.error}>{errors.reviewName.message}</Text>}

      <Text style={styles.label}>Review Text</Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Enter review text"
          />
        )}
        name="reviewText"
        rules={{ required: 'Review text is required' }}
        defaultValue=""
      />
      {errors.reviewText && <Text style={styles.error}>{errors.reviewText.message}</Text>}

      <Text style={styles.label}>Review Rating</Text>
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <RNPickerSelect
            onValueChange={onChange}
            value={value}
            items={[
              { label: '1', value: 1 },
              { label: '1.25', value: 1.25 },
              { label: '1.5', value: 1.5 },
              { label: '1.75', value: 1.75 },
              { label: '2', value: 2 },
              { label: '2.25', value: 2.25 },
              { label: '2.5', value: 2.5 },
              { label: '2.75', value: 2.75 },
              { label: '3', value: 3 },
              { label: '3.25', value: 3.25 },
              { label: '3.5', value: 3.5 },
              { label: '3.75', value: 3.75 },
              { label: '4', value: 4 },
              { label: '4.25', value: 4.25 },
              { label: '4.5', value: 4.5 },
              { label: '4.75', value: 4.75 },
              { label: '5', value: 5 },
            ]}
            placeholder={{ label: "Select a rating", value: null }}
          />
        )}
        name="reviewRating"
        rules={{
          required: 'Rating is required',
          validate: (value) => value !== null || 'Please select a rating',
        }}
        defaultValue={null}
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
            ]}
            placeholder={{ label: "Select a category", value: null }}
          />
        )}
        name="category"
        rules={{
          required: 'Category is required',
          validate: (value) => value !== null || 'Please select a category',
        }}
        defaultValue={null}
      />
      {errors.category && <Text style={styles.error}>{errors.category.message}</Text>}

      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
});

export default ReviewForm;
