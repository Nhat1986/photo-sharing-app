import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Define the type for request items
interface Request {
  id: string;
  name: string;
  avatar: string;
  message: string;
  requestType: string; 
}

// Define the type for notification items
interface Notification {
  id: string;
  message: string;
  timestamp: string;
}

// Define the array of requests with typed items
const initialRequestsData: Request[] = [];

// Define the array of notifications with typed items
const notificationsData: Notification[] = [];

export default function Notifications() {
  const [activeTab, setActiveTab] = useState<'requests' | 'notifications'>('requests');  
  const [requestsData, setRequestsData] = useState<Request[]>(initialRequestsData);
  const [notifications, setNotifications] = useState<Notification[]>(notificationsData);

  // Render each request item in the list
  const renderRequestItem = ({ item }: { item: Request }) => (
    <View style={styles.requestItem}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.messageContainer}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text>{item.message}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => handleAcceptRequest(item)}
        >
          <Ionicons name="checkmark-circle-outline" size={24} color="green" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.declineButton}
          onPress={() => handleRejectRequest(item)}
        >
          <Ionicons name="close-circle-outline" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Handle request acceptance
  const handleAcceptRequest = (request: Request) => {
    let newNotification: Notification;

    // Create notification based on the type of request
    switch (request.requestType) {
      case 'add_friend':
        newNotification = {
          id: `${notifications.length + 1}`,
          message: `You and ${request.name} are now friends!`,
          timestamp: new Date().toLocaleTimeString(),
        };
        break;
      case 'album_request':
        newNotification = {
          id: `${notifications.length + 1}`,
          message: `${request.name} has been added to the 2023 Summer album!`,
          timestamp: new Date().toLocaleTimeString(),
        };
        break;
      case 'share_content':
        newNotification = {
          id: `${notifications.length + 1}`,
          message: `You are now sharing content with ${request.name}.`,
          timestamp: new Date().toLocaleTimeString(),
        };
        break;
      default:
        newNotification = {
          id: `${notifications.length + 1}`,
          message: 'You have a new notification.',
          timestamp: new Date().toLocaleTimeString(),
        };
        break;
    }

    // Update notifications state
    setNotifications((prevNotifications) => [...prevNotifications, newNotification]);

    // Update the requests state
    setRequestsData((prevRequests) =>
      prevRequests.filter((req) => req.id !== request.id) 
    );
  };

  // Handle request rejection
  const handleRejectRequest = (request: Request) => {
    const rejectionNotification: Notification = {
      id: `${notifications.length + 1}`,
      message: `You rejected ${request.name}'s request.`,
      timestamp: new Date().toLocaleTimeString(),
    };

    // Update notifications state
    setNotifications((prevNotifications) => [...prevNotifications, rejectionNotification]);

    // Update the requests state
    setRequestsData((prevRequests) =>
      prevRequests.filter((req) => req.id !== request.id) 
    );
  };

  // Render each notification item in the list
  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <View style={styles.notificationItem}>
      <Text>{item.message}</Text>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
    </View>
  );

  return (
    <View className='flex-1 p-4 bg-white'>

      <Text className="text-4xl tracking-wider" style={{ fontFamily: 'Italiana_400Regular' }}>
        Activity
      </Text>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'requests' && styles.activeTab]}
          onPress={() => setActiveTab('requests')}
        >
          <Text style={[styles.tabText, activeTab === 'requests' && styles.activeTabText]}>
            Requests
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'notifications' && styles.activeTab]}
          onPress={() => setActiveTab('notifications')}
        >
          <Text style={[styles.tabText, activeTab === 'notifications' && styles.activeTabText]}>
            Notifications
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content based on active tab */}
      {activeTab === 'requests' && (
        <FlatList
          data={requestsData}
          renderItem={renderRequestItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}

      {activeTab === 'notifications' && (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: 'black',
  },
  tabText: {
    fontSize: 16,
    color: '#999',
  },
  activeTabText: {
    color: 'black',
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: 16,
  },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,  
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  messageContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  acceptButton: {
    marginRight: 10,
  },
  declineButton: {},
  notificationItem: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});
