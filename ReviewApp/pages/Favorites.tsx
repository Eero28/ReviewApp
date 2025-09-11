import { StyleSheet, View, Text } from 'react-native';
import { FC, useEffect, useState } from 'react';
import ReviewFlatlist from '../components/ReviewFlatlist';
import { useAuth } from '../providers/ContexApi';
import { API_URL } from "@env";
import axios from 'axios';
import { errorHandler } from '../helpers/errors/error';
import { ReviewItemIf } from '../interfaces/ReviewItemIf';
import { useTheme } from "../providers/ThemeContext";

type Props = {};

const Favorites: FC = (props: Props) => {
    const { userInfo, reviewsUpdated } = useAuth();
    const { colors, fonts, paddingSpacing } = useTheme();

    const [userFavorites, setUserFavorites] = useState<ReviewItemIf[]>([]);

    useEffect(() => {
        const getUserFavorites = async () => {
            try {
                const response = await axios.get(`${API_URL}/review/user/favorites/${userInfo?.id_user}`);
                setUserFavorites(response.data.data);
            } catch (error) {
                setUserFavorites([]);
                errorHandler(error);
            }
        };
        getUserFavorites();
    }, [userInfo?.id_user, reviewsUpdated]);

    return (
        <View style={[styles.container, { padding: paddingSpacing.md, backgroundColor: colors.bg }]}>
            <View style={styles.favoriteContainer}>
                <Text style={[styles.header, { color: colors.textColorPrimary, fontFamily: fonts.bold }]}>
                    Favorites
                </Text>
            </View>
            <ReviewFlatlist
                disableLongPress
                noReviewsText="You have no favorites yet!"
                reviews={userFavorites}
            />
        </View>
    );
};

export default Favorites;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    favoriteContainer: {
        justifyContent: "center",
        marginBottom: 10,
    },
    header: {
        fontSize: 16,
        textAlign: "center",
    },
});
