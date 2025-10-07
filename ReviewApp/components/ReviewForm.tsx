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
import { useNavigation, NavigationProp } from '@react-navigation/native';
import CameraComponent from '../components/CameraComponent';
import { useAuth } from '../providers/ContexApi';
import { tasteGroupsFormValues, selectColor, toggleSelectedTaste } from '../helpers/tastegroup';
import { API_URL } from '@env';
import { useTheme } from '../providers/ThemeContext';
import BackButton from './BackButton';
import { errorHandler } from '../helpers/errors/error';
import SelectDropdown from '../components/SelectDropdown';

interface ReviewFormValues {
  reviewname: string;
  reviewRating: number | null;
  reviewDescription: string;
  category: string | null;
  reviewTaste: string[];
  priceRange: string;
  id_review?: number;
  imageUrl?: string;
}

interface ReviewFormProps {
  initialData?: Partial<ReviewFormValues>;
  initialImage?: string | null;
  isUpdate?: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ initialData, initialImage, isUpdate = false }) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { colors, fonts } = useTheme();
  const { userInfo, allReviewsFetch, fetchUserReviews } = useAuth();

  const [imageUrl, setImageUrl] = useState<string | null>(initialImage || null);
  const [loading, setLoading] = useState<boolean>(false);

  const { control, handleSubmit, formState: { errors } } = useForm<ReviewFormValues>({
    defaultValues: {
      reviewname: initialData?.reviewname || '',
      reviewDescription: initialData?.reviewDescription || '',
      priceRange: initialData?.priceRange ?? '',
      reviewRating: initialData?.reviewRating ? Number(initialData.reviewRating) : null,
      category: initialData?.category ?? '',
      reviewTaste: initialData?.reviewTaste || undefined,
    },
  });

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
      formData.append('reviewTaste', JSON.stringify(data.reviewTaste));
      formData.append('file', {
        uri: imageUrl,
        type: "image/png",
        name: `review-image`,
      } as any);

      const url = isUpdate && initialData?.id_review
        ? `${API_URL}/review/${initialData.id_review}`
        : `${API_URL}/review`;
      const method = isUpdate ? 'PATCH' : 'POST';

      await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${userInfo?.access_token}`,
        },
        body: formData,
      });

      await Promise.all([fetchUserReviews(), allReviewsFetch()]);
      setImageUrl(null);
      if (navigation.canGoBack()) navigation.goBack();

    } catch (err) {
      errorHandler(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView style={{ padding: 10 }}>
        <View style={styles.container}>
          <View style={styles.canselContainer}>
            <BackButton left={1} top={15} />
            <Text style={[styles.title, { color: colors.textColorPrimary, fontFamily: fonts.bold }]}>
              {isUpdate ? 'Update your review!' : 'Create Your Review'}
            </Text>
          </View>

          {!imageUrl ? (
            <CameraComponent onImageCaptured={onImageCaptured} />
          ) : (
            <>
              <Image source={{ uri: imageUrl }} style={styles.imagePreview} resizeMode="contain" />
              <Pressable onPress={discardImage} style={styles.discardButton}>
                <Text style={styles.discardButtonText}>Discard Image / Take New</Text>
              </Pressable>
            </>
          )}

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
              <SelectDropdown
                label="Select Rating"
                options={['1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5']}
                selectedValue={value != null ? value.toString() : null}
                onValueChange={(val) => onChange(Number(val))}
                bgColor={colors.form.input}
                textColor={colors.textColorPrimary}
              />
            )}
          />

          {errors.reviewRating && <Text style={[styles.error, { color: colors.alerts.danger }]}>{errors.reviewRating.message}</Text>}

          <Controller
            control={control}
            name="category"
            rules={{ required: 'Category is required' }}
            render={({ field: { onChange, value } }) => {
              const categories = [
                { label: 'Wine', value: 'wine' },
                { label: 'Beer', value: 'beer' },
                { label: 'Softdrink', value: 'softdrink' },
                { label: 'Hot beverage', value: 'hotbeverage' },
                { label: 'Cocktail', value: 'cocktail' },
                { label: 'Other', value: 'other' },
              ];

              return (
                <SelectDropdown
                  label="Select Category"
                  options={categories.map(c => c.label)}
                  selectedValue={
                    value
                      ? categories.find(c => c.value === value)?.label || null
                      : null
                  }
                  onValueChange={(selectedLabel) => {
                    const selected = categories.find(c => c.label === selectedLabel);
                    if (selected) onChange(selected.value);
                  }}
                  bgColor={colors.form.input}
                  textColor={colors.textColorPrimary}
                />
              );
            }}
          />
          {errors.category && <Text style={[styles.error, { color: colors.alerts.danger }]}>{errors.category.message}</Text>}

          <Controller
            control={control}
            name="priceRange"
            rules={{ required: 'Price range is required' }}
            render={({ field: { onChange, value } }) => {
              const ranges = [
                { label: '1-5 euros', value: '1-5' },
                { label: '5-10 euros', value: '5-10' },
                { label: '10-20 euros', value: '10-20' },
                { label: '20-50 euros', value: '20-50' },
                { label: '50-100 euros', value: '50-100' },
                { label: '+100 euros', value: '+100' },
              ];

              return (
                <SelectDropdown
                  label="Select Price Range"
                  options={ranges.map(r => r.label)}
                  selectedValue={
                    value
                      ? ranges.find(r => r.value === value)?.label || null
                      : null
                  }
                  onValueChange={(selectedLabel) => {
                    const selected = ranges.find(r => r.label === selectedLabel);
                    if (selected) onChange(selected.value);
                  }}
                  bgColor={colors.form.input}
                  textColor={colors.textColorPrimary}
                />
              );
            }}
          />

          {errors.priceRange && <Text style={[styles.error, { color: colors.alerts.danger }]}>{errors.priceRange.message}</Text>}

          <Text style={[styles.label, { color: colors.textColorPrimary, fontFamily: fonts.medium }]}>What does it taste like?</Text>
          <Controller
            control={control}
            name="reviewTaste"
            rules={{ required: 'Pick at least one taste' }}
            render={({ field: { onChange, value } }) => {
              const selectedTastes = Array.isArray(value) ? value : [];
              return (
                <View>
                  {tasteGroupsFormValues.map(({ group, tastes }) => (
                    <View key={group}>
                      <Text style={[styles.groupLabel, { color: colors.textColorSecondary, fontFamily: fonts.medium }]}>{group}</Text>
                      <View style={styles.tasteContainer}>
                        {tastes.map((taste) => {
                          const { color, textColor } = selectColor(taste);
                          const isSelected = selectedTastes.includes(taste);
                          return (
                            <Pressable
                              key={taste}
                              style={[styles.tasteChip, { backgroundColor: isSelected ? color : '#eee' }]}
                              onPress={() => onChange(toggleSelectedTaste(selectedTastes, taste))}
                            >
                              <Text style={{ color: isSelected ? textColor : '#000', fontFamily: fonts.medium }}>{taste}</Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </View>
                  ))}
                </View>
              );
            }}
          />
          {errors.reviewTaste && <Text style={[styles.error, { color: colors.alerts.danger }]}>{errors.reviewTaste.message}</Text>}

          <View style={styles.buttonContainer}>
            <Pressable
              disabled={loading}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 450,
    borderRadius: 12,
    marginBottom: 12,
    resizeMode: 'cover',
  },
  discardButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  discardButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
    fontSize: 16,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 16,
  },
  groupLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
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
  },
  error: {
    marginBottom: 10,
    fontSize: 13,
  },
  buttonContainer: {
    paddingBottom: 20,
    borderRadius: 10,
  },
  canselContainer: {
    padding: 20,
  },
});

export default ReviewForm;
