import { View, Text, TextInput } from 'react-native'
import React from 'react'
import { useState, useRef } from 'react'

export default function VerifyAccountScreen() {
  const [code, setCode] = useState(new Array(4).fill(''))
  const inputs = useRef<any>([...Array(4)].map(() => React.createRef()))

  const handleInput = (text: any, index: any) => {
    const newCode = [...code]
    setCode(newCode)

    if (text && index < 3) {
      inputs.current[index + 1].current.focus()
    }
    if (text === '' && index > 0) {
      inputs.current[index - 1].current.focus()
    }
  }
  return (
    <View className="flex-1 items-center justify-center p-4 bg-white">
      <Text className="text-lg font-bold">Verification Code</Text>
      <Text className="text-sm mb-4">
        We have sent verification code to your email address
      </Text>
      <View className="flex-row">
        {code.map((_, index) => (
          <TextInput
            className="border border-gray-300 rounded-lg w-14 h-14 text-center mr-1"
            key={index}
            keyboardType="number-pad"
            maxLength={1}
            onChangeText={(text) => handleInput(text, index)}
            value={code[index]}
            ref={inputs.current[index]}
            returnKeyType="done"
            autoFocus={index === 0}
          />
        ))}
      </View>
    </View>
  )
}
