import { StyleSheet, TextInput, Text, View } from 'react-native'
import React from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import '@/components/Taps'

const SearchInput = () => {
  return (
    <View className="flex-row items-center py-3 px-5">
      <View className="absolute top-5 left-11 z-10">
        <MaterialIcons
          className=""
          name="search"
          size={24}
          color="gray"
          onPress={() => {}}
        />
      </View>
      <TextInput
        // className="text-black flex-1 ml-2 mr-2 py-6 rounded-xl h-10 bg-white"
        className="shadow-sm"
        placeholderTextColor="gray"
        placeholder="Search"
        style={styles.input}
      />
      <View className="absolute top-6 right-10 z-10">
        <MaterialIcons
          name="filter-list"
          size={24}
          color="gray"
          onPress={() => {}}
        />
      </View>
      <View className=""></View>
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    marginLeft: 20,
    marginRight: 10,
    paddingVertical: 6,
    paddingHorizontal: 30,
    borderRadius: 10,
    height: 40,
    backgroundColor: 'white',
    color: 'black',
  },
})

export default SearchInput
