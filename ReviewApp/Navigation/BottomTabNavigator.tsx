import { FC } from 'react'
import { useAuth } from '../providers/ContexApi';
import MainTabs from './MainTabs';
import AuthTabs from './AuthTabs';
import LoadingScreen from '../components/LoadingScreen';

const BottomTabNavigator: FC = () => {
  const { userInfo, loading } = useAuth()
  if (loading) {
    return <LoadingScreen />
  }
  return userInfo ? <MainTabs /> : <AuthTabs />
}

export default BottomTabNavigator

