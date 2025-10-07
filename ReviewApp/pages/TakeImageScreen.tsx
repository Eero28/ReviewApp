import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../interfaces/Navigation';
import KeyboardAvoidContainer from '../components/KeyboardAvoidContainer';
import ReviewForm from '../components/ReviewForm';
type TakeImageProps = NativeStackScreenProps<MainStackParamList, 'TakeImage'>;

const TakeImageScreen = ({ route }: TakeImageProps) => {
  const { isUpdate = false, initialImage = null, initialData } = route.params ?? {};

  return (
    <KeyboardAvoidContainer>
      <ReviewForm
        initialData={initialData ?? undefined}
        isUpdate={isUpdate}
        initialImage={initialImage}
      />
    </KeyboardAvoidContainer>
  );
};

export default TakeImageScreen;
