import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import CameraComponent from '../components/CameraComponent';
import { useAuth } from '../providers/ContexApi';
import { tasteGroupsFormValues, toggleSelectedTaste, selectColor } from '../helpers/tastegroup';
import { errorHandler } from '../helpers/errors/error';
import axios from 'axios';
import { API_URL } from '@env';
import { useTheme } from '../providers/ThemeContext';
import BackButton from './BackButton';

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
  const { colors, fonts } = useTheme();
  const { userInfo, getReviews, allReviewsFetch, handleLogout } = useAuth();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<ReviewFormValues>({
    defaultValues: {
      reviewname: initialData?.reviewname || '',
      reviewDescription: initialData?.reviewDescription || '',
      priceRange: initialData?.priceRange || '',
      reviewRating: initialData?.reviewRating ? Number(initialData.reviewRating) : null,
      category: initialData?.category || null,
      reviewTaste: initialData?.reviewTaste || [],
    },
  });

  const [imageUrl, setImageUrl] = useState<string | null>(initialImage || null);
  const [loading, setLoading] = useState<boolean>(false);

  const onImageCaptured = (url: string) => setImageUrl(url);
  const discardImage = () => setImageUrl(null);

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
        const fileName = imageUrl.split('/').pop() || 'photo.jpg';
        const fileType = fileName.endsWith('png') ? 'image/png' : 'image/jpeg';
        formData.append('file', { uri: imageUrl, name: fileName, type: fileType } as any);
      } else {
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
      errorHandler(error, handleLogout);
    } finally {
      setLoading(false);
    }
  };

  if (!imageUrl) return <CameraComponent onImageCaptured={onImageCaptured} />;

  return (
    <ScrollView style={{ backgroundColor: colors.bg, padding: 10 }}>
      <View style={styles.container}>
        <View style={styles.canselContainer}>
          <BackButton left={1} top={15} />
          <Text style={[styles.title, { color: colors.textColorPrimary, fontFamily: fonts.bold }]}>
            {isUpdate ? 'Update your review!' : 'Create Your Review'}
          </Text>
        </View>

        <Image
          source={{ uri: imageUrl }}
          style={styles.imagePreview}
        />
        <Pressable
          style={[styles.discardButton, { backgroundColor: colors.alerts.danger }]}
          onPress={discardImage}
        >
          <Text style={[styles.discardButtonText, { color: colors.textColorPrimary, fontFamily: fonts.medium }]}>
            Discard Image
          </Text>
        </Pressable>

        <Text style={[styles.label, { color: colors.textColorPrimary, fontFamily: fonts.medium }]}>Review Name</Text>
        <Controller
          control={control}
          name="reviewname"
          rules={{ required: 'Review name is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, { backgroundColor: colors.form.input, color: colors.form.inputTextColor }]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Enter review name"
              placeholderTextColor={colors.textColorSecondary}
            />
          )}
        />
        {errors.reviewname && <Text style={[styles.error, { color: colors.alerts.danger }]}>{errors.reviewname.message}</Text>}

        <Text style={[styles.label, { color: colors.textColorPrimary, fontFamily: fonts.medium }]}>Review Text</Text>
        <Controller
          control={control}
          name="reviewDescription"
          rules={{ required: 'Review description is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, { backgroundColor: colors.form.input, color: colors.form.inputTextColor, height: 100 }]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              multiline
              numberOfLines={4}
              placeholder="Enter review text"
              placeholderTextColor={colors.textColorSecondary}
            />
          )}
        />
        {errors.reviewDescription && <Text style={[styles.error, { color: colors.alerts.danger }]}>{errors.reviewDescription.message}</Text>}

        <Text style={[styles.label, { color: colors.textColorPrimary, fontFamily: fonts.medium }]}>Review Rating</Text>
        <Controller
          control={control}
          name="reviewRating"
          rules={{ required: 'Rating is required' }}
          render={({ field: { onChange, value } }) => (
            <RNPickerSelect
              onValueChange={onChange}
              value={value}
              items={[...Array(9)].map((_, i) => ({ label: (1 + i * 0.5).toString(), value: 1 + i * 0.5 }))}
              placeholder={{ label: 'Select a rating', value: null }}
              style={{
                inputIOS: [styles.pickerInput, { backgroundColor: colors.form.input, color: colors.form.inputTextColor }],
                inputAndroid: [styles.pickerInput, { backgroundColor: colors.form.input, color: colors.form.inputTextColor }],
                placeholder: { color: colors.textColorSecondary },
              }}
            />
          )}
        />
        {errors.reviewRating && <Text style={[styles.error, { color: colors.alerts.danger }]}>{errors.reviewRating.message}</Text>}

        <Text style={[styles.label, { color: colors.textColorPrimary, fontFamily: fonts.medium }]}>Category</Text>
        <Controller
          control={control}
          name="category"
          rules={{ required: 'Category is required' }}
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
              placeholder={{ label: 'Select a category', value: null }}
              style={{
                inputIOS: [styles.pickerInput, { backgroundColor: colors.form.input, color: colors.form.inputTextColor }],
                inputAndroid: [styles.pickerInput, { backgroundColor: colors.form.input, color: colors.form.inputTextColor }],
              }}
            />
          )}
        />
        {errors.category && <Text style={[styles.error, { color: colors.alerts.danger }]}>{errors.category.message}</Text>}

        <Text style={[styles.label, { color: colors.textColorPrimary, fontFamily: fonts.medium }]}>Price range</Text>
        <Controller
          control={control}
          name="priceRange"
          rules={{ required: 'Price range is required' }}
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
              placeholder={{ label: 'Select price range', value: null }}
              style={{
                inputIOS: [styles.pickerInput, { backgroundColor: colors.form.input, color: colors.form.inputTextColor }],
                inputAndroid: [styles.pickerInput, { backgroundColor: colors.form.input, color: colors.form.inputTextColor }],
              }}
            />
          )}
        />
        {errors.priceRange && <Text style={[styles.error, { color: colors.alerts.danger }]}>{errors.priceRange.message}</Text>}
        <Text style={[styles.label, { color: colors.textColorPrimary, fontFamily: fonts.medium }]}>What does it taste like?</Text>
        <Controller
          control={control}
          name="reviewTaste"
          rules={{ required: 'Pick at least one taste' }}
          render={({ field: { onChange, value = [] } }) => (
            <View>
              {tasteGroupsFormValues.map(({ group, tastes }) => (
                <View key={group}>
                  <Text style={[styles.groupLabel, { color: colors.textColorSecondary, fontFamily: fonts.medium }]}>{group}</Text>
                  <View style={styles.tasteContainer}>
                    {tastes.map((taste) => {
                      const { color, textColor } = selectColor(taste);
                      const isSelected = value.includes(taste);

                      return (
                        <Pressable
                          key={taste}
                          style={[
                            styles.tasteChip,
                            { backgroundColor: isSelected ? color : "#eee" },
                          ]}
                          onPress={() => onChange(toggleSelectedTaste(value, taste))}
                        >
                          <Text
                            style={{
                              color: isSelected ? textColor : "#000",
                              fontFamily: fonts.medium,
                            }}
                          >
                            {taste}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              ))}
            </View>
          )}
        />
        {errors.reviewTaste && <Text style={[styles.error, { color: colors.alerts.danger }]}>{errors.reviewTaste.message}</Text>}

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
  container: { flex: 1, padding: 10 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  imagePreview: { width: '100%', height: 450, borderRadius: 12, marginBottom: 12, resizeMode: 'cover' },
  discardButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 25, alignSelf: 'center', marginBottom: 16 },
  discardButtonText: { fontSize: 16, fontWeight: '600', textAlign: 'center' },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  input: { height: 48, borderColor: '#ccc', borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, marginBottom: 16, fontSize: 16 },
  pickerInput: { fontSize: 16, paddingVertical: 14, paddingHorizontal: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 10, marginBottom: 16 },
  groupLabel: { fontSize: 15, fontWeight: '600', marginBottom: 6 },
  tasteContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  tasteChip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 25, margin: 4 },
  error: { marginBottom: 10, fontSize: 13 },
  buttonContainer: { paddingBottom: 20, borderRadius: 10 },
  canselContainer: { padding: 20 }
});

export default ReviewForm;
