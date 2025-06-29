import { View, Text, Image } from 'react-native'
import React from 'react'

const Card: React.FC<{
  source: any
  width: number
  aspectratio: number
  caption: string
}> = ({ source, width, aspectratio, caption }) => {
  return (
    <View>
      <Image
        source={source}
        style={{
          width: width,
          height: width * aspectratio,
          marginBottom: 5,
          borderRadius: 10,
          marginTop: 20,
        }}
      />
      <Text className="text-start text-gray-400">{caption}</Text>
    </View>
  )
}
export default Card
