import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const Profile: React.FC = () => {
  const router = useRouter();
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // State to manage edit mode

  // User information states
  const [userInfo, setUserInfo] = useState({
    email: 'example@example.com',
    phone: '+123456789',
    location: 'Country Side',
  });

  const handleAvatarPress = () => {
    setShowOptions(true); // Show the options when avatar is pressed
  };

  const handleOptionSelect = async (option: 'gallery' | 'camera') => {
    setShowOptions(false); // Hide the options after selection

    if (option === 'gallery') {
      // Open the image gallery
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setAvatarUri(result.assets[0].uri); // Update the avatar URI with the selected image
      }
    } else if (option === 'camera') {
      // Open the camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setAvatarUri(result.assets[0].uri); // Update the avatar URI with the taken photo
      }
    }
  };

  // Function to handle sign out
  const handleSignOut = () => {
    router.replace('/login'); // Navigate to the login screen after signing out
  };

  // Function to toggle editing mode
  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      {/* User Avatar */}
      <TouchableOpacity onPress={handleAvatarPress}>
        <Image
          source={avatarUri ? { uri: avatarUri } : require('@/assets/images/avatar.jpg')} // Default avatar
          style={styles.avatar}
        />
      </TouchableOpacity>

      {/* Options to Change Avatar */}
      {showOptions && (
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.option} onPress={() => handleOptionSelect('gallery')}>
            <Text style={styles.optionText}>Upload from Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={() => handleOptionSelect('camera')}>
            <Text style={styles.optionText}>Take a Photo</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Personal Info Section */}
      <View style={styles.infoContainer}>
        <View style={styles.personalInfoHeader}>
          <Text style={styles.personalInfoTitle}>Personal Info</Text>
          <TouchableOpacity onPress={handleEditToggle}>
            <Text style={styles.editButton}>{isEditing ? 'Save' : 'Edit'}</Text>
          </TouchableOpacity>
        </View>

        {/* Editable fields */}
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Email:</Text>
          <TextInput
            style={styles.infoText}
            editable={isEditing}
            value={userInfo.email}
            onChangeText={(text) => setUserInfo((prev) => ({ ...prev, email: text }))}
          />
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Phone:</Text>
          <TextInput
            style={styles.infoText}
            editable={isEditing}
            value={userInfo.phone}
            onChangeText={(text) => setUserInfo((prev) => ({ ...prev, phone: text }))}
          />
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Location:</Text>
          <TextInput
            style={styles.infoText}
            editable={isEditing}
            value={userInfo.location}
            onChangeText={(text) => setUserInfo((prev) => ({ ...prev, location: text }))}
          />
        </View>
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Ionicons name="log-out-outline" size={24} color="red" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  optionsContainer: {
    position: 'absolute',
    top: 120,
    left: '50%',
    transform: [{ translateX: -75 }],
    width: 150,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  optionText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
  },
  infoContainer: {
    marginTop: 20,
  },
  personalInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  personalInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    fontSize: 16,
    color: '#007BFF',
  },
  infoBox: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginTop: 5,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8d7da',
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
  },
  signOutText: {
    fontSize: 18,
    color: 'red',
    marginLeft: 10,
  },
});

export default Profile;
