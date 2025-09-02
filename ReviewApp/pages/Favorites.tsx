import { StyleSheet, View, Text } from 'react-native'
import { FC, useEffect, useState } from 'react'
import ReviewFlatlist from '../components/ReviewFlatlist'
import { useAuth } from '../ContexApi'
import { API_URL } from "@env";
import axios from 'axios'
import { errorHandler } from '../helpers/errors/error';
import { ReviewItemIf } from '../interfaces/ReviewItemIf';


type Props = {}

const Favorites: FC = (props: Props) => {
    const { userInfo, reviewsUpdated } = useAuth();

    const [userFavorites, setUserFavorites] = useState<ReviewItemIf[]>([])

    useEffect(() => {
        const getUserFavorites = async () => {
            try {
                const response = await axios.get(`${API_URL}/likes/user/favorite/${userInfo?.id_user}`)
                setUserFavorites(response.data.data)
            } catch (error) {
                setUserFavorites([])
                errorHandler(error)
            }

        }
        getUserFavorites()
    }, [userInfo?.id_user, reviewsUpdated])


    return (
        <View style={styles.container}>
            <View style={styles.favoriteContainer}>
                <Text style={styles.header}>Favorites</Text>
            </View>
            <ReviewFlatlist disableLongPress noReviewsText={"You have no favorites yet!"} reviews={userFavorites} />
        </View>
    )
}

export default Favorites

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    favoriteContainer: {
        justifyContent: "center",
    },
    header: {
        fontSize: 16,
        textAlign: "center",
        padding: 10,
        fontFamily: "poppins"
    }
})