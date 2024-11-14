import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CameraComponent from "../components/CameraComponent"
type Props = {}

const TakeImageScreen = (props: Props) => {
  return (
    <View>
      <CameraComponent/>
      <Text>TakeImageScreen</Text>
    </View>
  )
}

export default TakeImageScreen

const styles = StyleSheet.create({})