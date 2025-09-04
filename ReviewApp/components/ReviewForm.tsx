import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  ActivityIndicator
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import CameraComponent from "../components/CameraComponent";
import { useNavigation, NavigationProp } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from "axios";
import { API_URL } from "@env";
import { useAuth } from '../ContexApi';
import { tasteGroupsFormValues, toggleSelectedTaste, selectColor } from '../helpers/tastegroup';


interface ReviewFormValues {
  reviewname: string;
  reviewRating: number | null;
  reviewDescription: string;
  category: string | null;
  reviewTaste: string[];
  priceRange: string;
  id_review?: number;
}

interface ReviewFormProps {
  initialData?: Partial<ReviewFormValues>;
  initialImage?: string | null;
  isUpdate?: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ initialData, initialImage, isUpdate = false }) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { control, handleSubmit, reset, formState: { errors } } = useForm<ReviewFormValues>({
    defaultValues: {
      reviewname: initialData?.reviewname || '',
      reviewDescription: initialData?.reviewDescription || '',
      priceRange: initialData?.priceRange || '',
      reviewRating: initialData?.reviewRating ? Number(initialData.reviewRating) : null,
      category: initialData?.category || null,
      reviewTaste: initialData?.reviewTaste || [],
    }
  });

  const [imageUrl, setImageUrl] = useState<string | null>(initialImage || null);
  const [loading, setLoading] = useState<boolean>(false)
  const { userInfo, getReviews, allReviewsFetch } = useAuth();

  const onImageCaptured = (url: string) => setImageUrl(url);

  const discardImage = () => {
    setImageUrl(null)
  }

  const onSubmit = async (data: ReviewFormValues) => {
    if (loading) return;

    if (!imageUrl) {
      alert('Please take or select an image first');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append('reviewname', data.reviewname);
      formData.append('reviewDescription', data.reviewDescription);
      formData.append('reviewRating', String(data.reviewRating));
      formData.append('category', data.category || '');
      formData.append('priceRange', data.priceRange);
      formData.append('id_user', String(userInfo?.id_user));

      data.reviewTaste.forEach((taste) => formData.append('reviewTaste[]', taste));

      if (imageUrl.startsWith('file://')) {
        // Local file: use FileSystem
        const fileName = imageUrl.split('/').pop() || 'photo.jpg';
        const fileType = fileName.endsWith('png') ? 'image/png' : 'image/jpeg';

        formData.append('file', {
          uri: imageUrl,
          name: fileName,
          type: fileType,
        } as any);
      } else {
        // Already uploaded image / no change
        formData.append('imageUrl', imageUrl);
      }

      if (isUpdate && initialData?.id_review) {
        await axios.patch(`${API_URL}/review/${initialData.id_review}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${userInfo?.access_token}`,
          },
        });
      } else {
        await axios.post(`${API_URL}/review`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${userInfo?.access_token}`,
          },
        });
      }

      reset();
      setImageUrl(null);
      getReviews();
      allReviewsFetch();
      navigation.goBack();
    } catch (error) {
      console.error(error);
    } finally {
      console.log("hello")
      setLoading(false)
    }
  };

  if (!imageUrl) {
    return <CameraComponent onImageCaptured={onImageCaptured} />;
  }
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>{isUpdate ? "Update your review!" : "Create Your Review"}</Text>
        <Image
          source={{ uri: imageUrl || "https://t3.ftcdn.net/jpg/02/36/99/22/360_F_236992283_sNOxCVQeFLd5pdqaKGh8DRGMZy7P4XKm.jpg" }}
          style={styles.imagePreview}
        />
        <Pressable style={styles.discardButton} onPress={discardImage}>
          <Text style={styles.discardButtonText}>Discard Image</Text>
        </Pressable>

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
          name="reviewname"
          rules={{ required: 'Review name is required' }}
        />
        {errors.reviewname && <Text style={styles.error}>{errors.reviewname.message}</Text>}
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
              multiline
              placeholder="Enter review text"
            />
          )}
          name="reviewDescription"
          rules={{ required: 'Review description is required' }}
        />
        {errors.reviewDescription && <Text style={styles.error}>{errors.reviewDescription.message}</Text>}
        <Text style={styles.label}>Review Rating</Text>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <RNPickerSelect
              onValueChange={onChange}
              value={value}
              items={[...Array(9)].map((_, i) => ({ label: (1 + i * 0.5).toString(), value: 1 + i * 0.5 }))}
              placeholder={{ label: "Select a rating", value: null }}
              style={{ inputIOS: styles.pickerInput, inputAndroid: styles.pickerInput, placeholder: { color: "#999" } }}
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
        <Text style={styles.label}>Price range</Text>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <RNPickerSelect
              onValueChange={onChange}
              value={value}
              items={[
                { label: '1-5 euros', value: '1-5' },
                { label: '5-10 euros', value: '5-10' },
                { label: '10-20 euros', value: '10-20' },
                { label: '20-50 euros', value: '20-50' },
                { label: '50-100 euros', value: '50-100' },
                { label: '+100 euros', value: '+100' },
              ]}
              placeholder={{ label: "Select price range", value: null }}
              style={{ inputIOS: styles.pickerInput, inputAndroid: styles.pickerInput }}
            />
          )}
          name="priceRange"
          rules={{ required: 'Price range is required' }}
        />
        {errors.priceRange && <Text style={styles.error}>{errors.priceRange.message}</Text>}
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
                          style={[styles.tasteChip, { backgroundColor: isSelected ? selectColor(taste) : "#eee" }]}
                          onPress={() => onChange(toggleSelectedTaste(value, taste))}
                        >
                          <Text style={{ color: isSelected ? "#fff" : "#333" }}>{taste}</Text>
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
          <Pressable
            disabled={!imageUrl || loading}
            onPress={handleSubmit(onSubmit)}
            style={({ pressed }) => [
              {
                backgroundColor: !imageUrl || loading ? '#ccc' : pressed ? '#45a049' : '#4CAF50',
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 10,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
              },
            ]}
          >
            {loading && <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />}
            <Text style={{ color: !imageUrl ? '#666' : '#fff', fontWeight: '600' }}>
              {loading ? 'Uploading...' : 'Submit Review'}
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
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
  discardButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  discardButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
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
