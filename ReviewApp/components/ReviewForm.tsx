import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import CameraComponent from "../components/CameraComponent";
import { NavigationProp } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios, { AxiosError } from "axios";
// @ts-expect-error
import { API_URL } from "@env";
import { useAuth } from '../ContexApi';
import { tasteGroupsFormValues, toggleSelectedTaste, selectColor } from '../helpers/tastegroup';

interface ReviewFormValues {
  reviewName: string;
  reviewRating: number | null;
  reviewText: string;
  category: string | null;
  reviewTaste: string[];
}

interface NavigationProps {
  navigation: NavigationProp<any>;
}


const ReviewForm: React.FC<NavigationProps> = ({ navigation }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<ReviewFormValues>({
    defaultValues: {
      reviewName: '',
      reviewText: '',
      reviewRating: null,
      category: null,
      reviewTaste: [],
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

  const onSubmit = async (data: ReviewFormValues) => {
    try {
      const reviewData = {
        reviewname: data.reviewName,
        reviewDescription: data.reviewText,
        reviewRating: data.reviewRating,
        category: data.category,
        reviewTaste: data.reviewTaste,
        imageUrl: imageUrl,
        id_user: userInfo?.id_user,
      };
      console.log(reviewData)
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
    <SafeAreaView>
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

        <Text style={styles.label}>What does it taste like?</Text>
        <Controller
          control={control}
          name="reviewTaste"
          rules={{ required: 'Pick at least one taste' }}
          render={({ field: { onChange, value = [] } }) => (
            <View>
              {tasteGroupsFormValues.map(({ group, tastes }) => (
                <View key={group}>
                  <Text style={styles.groupLabel}>{group}</Text>
                  <View style={styles.tasteContainer}>
                    {tastes.map((taste) => {
                      const isSelected = value.includes(taste);
                      return (
                        <Text
                          key={taste}
                          style={[
                            styles.tasteChip,
                            { backgroundColor: isSelected ? selectColor(taste) : "#eee" },
                          ]}
                          onPress={() => onChange(toggleSelectedTaste(value, taste))}
                        >
                          <Text style={{ color: isSelected ? "#fff" : "#333" }}>
                            {taste}
                          </Text>
                        </Text>
                      );
                    })}
                  </View>
                </View>
              ))}
            </View>
          )}
        />
        {errors.reviewTaste && <Text style={styles.error}>{errors.reviewTaste.message}</Text>}

        <View style={styles.buttonContainer}>
          <Button title="Submit Review" onPress={handleSubmit(onSubmit)} color="#4CAF50" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#222',
  },
  imagePreview: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 12,
    resizeMode: 'cover',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  pickerInput: {
    fontSize: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    color: '#333',
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  groupLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
    color: '#555',
  },
  tasteContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tasteChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
    margin: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  error: {
    color: '#e53935',
    marginBottom: 10,
    fontSize: 13,
  },
  buttonContainer: {
    paddingBottom: 20,
    borderRadius: 10,
  },
});


export default ReviewForm;
