import React, { useState, useEffect, FC, useRef, useCallback, useMemo } from 'react'
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  FlatList,
  LayoutChangeEvent,
  TextInput,
  // Button,
} from 'react-native'
import { Link, useLocalSearchParams } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import { useFonts, Italiana_400Regular } from '@expo-google-fonts/italiana'
import { api } from '@/external/fetch'
import MasonryList from '@react-native-seoul/masonry-list';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ErrorCard from '@/components/ErrorCard'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Button, { DestructiveButton } from '@/components/CustomButton'
import { useUserSession } from '@/components/contexts/sessionContext'
import { Ionicons } from '@expo/vector-icons'

type ImageData = {
  description: string | null;
  id: string;
  albumid: string;
  createdAt: string | null;
  heightpx: number;
  imageUrl: string;
  order: number;
  owner: string;
  thumbnailUrl: string;
  widthpx: number;
}

type Comment = {
  content: string;
  albumid: string;
  dateAdded: string;
  dateCreated: string;
  id: string;
  owner: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
}


const AlbumDetail = () => {
  const [fontsLoaded] = useFonts({
    Italiana_400Regular,
  })

  const { albumId } = useLocalSearchParams()
  const albumIdString = Array.isArray(albumId) ? albumId[0] : albumId
  const [selectedAlbum, setSelectedAlbum] = useState<any>(null)
  const [photos, setPhotos] = useState<ImageData[]>([])
  const [selectedPhoto, setSelectedPhoto] = useState<ImageData|undefined>(undefined)
  const {userId} = useUserSession()

  const { bottom: bottomSafeArea } = useSafeAreaInsets();
  const imageOptionsModalRef = useRef<BottomSheetModal>(null);
  const commentsModalRef = useRef<BottomSheetModal>(null);


  const createPhotoOptionsModal = useCallback(() => {
    imageOptionsModalRef.current?.present();
  }, []);

  const createCommentsModal = useCallback(() => {
    commentsModalRef.current?.present();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      justifyContent: 'center',
    },
    contentContainer: {
      flex: 1,
      padding:18,
      minHeight: 200,
    },
  });
  const contentContainerStyle = useMemo(
    () => ({
      ...styles.contentContainer,
      paddingBottom: bottomSafeArea,
      
    }),
    [bottomSafeArea]
  );


  const fetchAlbumDetails = async () => {
    try {
      // 앨범 정보를 가져오는 API 호출
      const { data, error } = await api.GET('/album/{albumId}', {
        params: {
          path: { albumId: albumIdString },
        },
      })
      if (error) {
        console.error('Failed to fetch album details:', error)
        return
      }

      setSelectedAlbum(data.album) // 앨범 데이터 설정
    } catch (err) {
      console.error('Failed to fetch album details:', err)
    }
  }

  const fetchAlbumPhotos = async () => {
    try {
      const { data, error } = await api.GET('/image/all/{albumId}', {
        params: {
          path: { albumId: albumIdString },
        },
      })

      if (error) {
        console.error('Failed to fetch album photos:', error)
        return
      }
      console.log("urls",
        photos.map(p => p.imageUrl)
      )

      setPhotos(data)
    } catch (err) {
      console.error('Failed to fetch album photos:', err)
    }
  }

  useEffect(() => {
    if (albumId) {
      fetchAlbumDetails()
      fetchAlbumPhotos()
    }
  }, [albumId])

  if (!selectedAlbum) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading album details...</Text>
      </View>
    )
  }

  if (!selectedAlbum) {
    return (
      <View>
        <Text>Album not found</Text>
      </View>
    )
  }

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync()
    if (!permissionResult.granted) {
      alert('Permission to access camera is required!')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0,
      base64:true
    })

    if (!result.canceled && result.assets && result.assets[0]) {
      const selectedPhoto = result.assets[0]
      const newPhotoData = selectedPhoto.base64 as string
      const mimeType = selectedPhoto.mimeType || 'image/jpeg'
      const width = selectedPhoto.width
      const height = selectedPhoto.height 
      

      const {data,error} = await api.POST('/image',{
        body:{
          albumId:albumIdString,//todo: use context
          image: newPhotoData,
          mimeType: mimeType,
          widthPx:width,
          heightPx: height,
          ownerId: userId || '',
          order: photos.length + 1
          }
      })

      if(error) {
        console.log('issue uploading image:',error.message)
        return//TODO: handle
      }

      if(data){
        fetchAlbumPhotos()
      }
    }
  }



  const ImageComponent: FC<{ image: ImageData }> = ({ image }) => {
    const [imageWidth, setImageWidth] = useState(0);
  
    // This function is called when the layout of the outer View changes, to get the correct width
    const onLayout = (event: LayoutChangeEvent) => {
      const { width } = event.nativeEvent.layout;
      setImageWidth(width); // Update the width of the component
    };
  
    // Calculate the height based on the image's aspect ratio
    const imageAspectRatio = image.widthpx / image.heightpx;
    const calculatedHeight = imageWidth / imageAspectRatio;

    const callback = () => {
      setSelectedPhoto(image)
      createPhotoOptionsModal()
    }
    const gesture = Gesture.LongPress().onStart(callback)
  
    return (
      <GestureDetector gesture={gesture}>
        <View className="w-full my-1" onLayout={onLayout}>
          <View className=''>
            <Image
              key={image.id}
              source={{ uri: image.imageUrl }}
              style={{
                width: imageWidth - 8,
                height: calculatedHeight,
                borderRadius:12,
              }}
              resizeMode={'cover'}
            />
          </View>
    
          {image.description && (
            <Text className="text-left flex-wrap font-thin ml-2 mt-1">
            {image.description}
            </Text>
          )}
        </View>
      </GestureDetector>
    );
  };

  const ImageList = () => {
    return (
      <MasonryList
        data={photos}
        keyExtractor={(item:ImageData):string => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => <ImageComponent image={item as ImageData} />}
        refreshControl={false}
      />
    );
  };

  const ImageActions = () => {
    const [newImageDesc,setNewImageDesc] = useState<string>("");
    const [isError, setIsError] = useState(false);

    const deleteSelectedImage = async () => {
      const {data,error} = await api.DELETE('/image/{id}',{
        params:{path:{id: selectedPhoto?.id ||''}}
      })

      if(error) setIsError(true);
      imageOptionsModalRef.current?.dismiss()
      fetchAlbumPhotos();
    };

    const handleImageUpdate = async () => {
      const description = newImageDesc.trim() == '' ? null : newImageDesc.trim()
      const {data, error} = await api.PATCH('/image/{id}',{
        params:{path:{id:selectedPhoto?.id ||''}},
        body:{
          description: description
        }
      })

      if(error) setIsError(true);
      imageOptionsModalRef.current?.dismiss()
      fetchAlbumPhotos();
    }

    return (
      
      <View>
        <TextInput
          style={{ fontFamily: 'Nunito_400Regular' }}
          className="bg-white border-gray-200 border-solid border-2 p-4 mb-4 rounded-lg w-full"
          placeholder="Image Description"
          placeholderTextColor="#6b7280"
          autoCapitalize="none"
          value={newImageDesc}
          onChangeText={(value:string) => setNewImageDesc(value)}
        ></TextInput>
        <Button title='Save' onPress={handleImageUpdate}/>

        <View className='my-4 w-full h-[1px] border-solid border-[1px] border-gray-200'></View>
        {/* TODO: Add separator */}
        <DestructiveButton title='Delete Image' onPress={deleteSelectedImage}></DestructiveButton>
        { isError && <ErrorCard/>}
      </View>
    )
  }


  const CommentListItem: FC<{ comment: Comment }> = ({ comment }) => {

    return (
      <View className='flex flex-row w-full my-3'>
        {comment.profileImage &&
          <Image className='m-1 w-12 h-12 rounded-full' source={{uri:comment.profileImage}}/>
        }
        <View className='ml-2 flex flex-col justify-center'>
          <Text className='text-sm'>{comment.firstName} {comment.lastName}</Text>
          <Text className='text-lg' >{comment.content}</Text>
        </View>
      </View>
    )
  }

  const CommentSection = () => {
    const [comments, setComments] = useState<Comment[]>([])
    const [newComment, setNewComment] = useState<string>('')

    useEffect(()=>{
      fetchComments();
    },[albumIdString])

    const fetchComments = async () => {
      const {data,error} = await api.GET('/comment/{albumId}',{
        params:{path:{ albumId: albumIdString }}
      });

      if(error){ 
        console.log(error)
        return;
      }
      setComments(data.comments)

    }

    const addComment = async () => {
      if(newComment.trim() == '') return;

      const {data,error} = await api.POST('/comment',{
        body:{
          albumId:albumIdString,
          ownerId:userId || '',
          content: newComment
        }
      });

      if(error) return;

      fetchComments();
    }

    return (
      <View className='flex flex-col'>
        <View className='flex flex-row'>
        <TextInput
          style={{ fontFamily: 'Nunito_400Regular' }}
          className="bg-white border-gray-200 border-solid border-2 p-4 mb-4 rounded-lg w-4/5"
          placeholder="Comment"
          placeholderTextColor="#6b7280"
          autoCapitalize="none"
          value={newComment}
          onChangeText={(value:string) => setNewComment(value)}
        />
          <TouchableOpacity className='ml-4 w-13 aspect-square bg-black rounded-lg justify-center items-center' onPress={addComment}>
            <Ionicons name="paper-plane-outline" color={'#FFFFFF'} size={25}/>
          </TouchableOpacity>
  
        </View>
        {/* <View className='flex-grow'> */}
          <FlatList 
            className='h-2/3 shadow-inner-md bg-white'
            data={comments}
            numColumns={1}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <CommentListItem key={item.id} comment={item}/>}
            contentContainerStyle={{ paddingBottom: 16 }}
            />
          {/* </View> */}
      </View>
    )
  }


  return (
    <View className="flex-1 p-4 bg-white ">
      <View className="px-4 items-center justify-center">
        <Text className="text-5xl text-center w-5/6 tracking-wider" style={{ fontFamily: 'Italiana_400Regular' }}>
          {selectedAlbum.name}
        </Text>
        <Text className="my-4 text-base text-center text-gray-600 ">
          {selectedAlbum.description}
        </Text>
      </View>

      <TouchableOpacity className="w-full items-end" onPress={takePhoto}>
        <Text className="text-md text-gray-400 m-3 flex items-end">
          +Add Photo
        </Text>
      </TouchableOpacity>

    <ImageList />

    <BottomSheetModal 
    ref={imageOptionsModalRef} 
    index={0}
    snapPoints={['50%']}
    style={{shadowRadius:6,shadowColor:'#000',shadowOpacity:0.15}} 
    >
    <BottomSheetView style={contentContainerStyle}>
      <Text className="mb-8 text-4xl font-bold tracking-wider" style={{ fontFamily: 'Italiana_400Regular' }}>Edit Image</Text>
      <ImageActions/>
    </BottomSheetView>
  </BottomSheetModal>


  <BottomSheetModal 
    ref={commentsModalRef} 
    index={0}
    snapPoints={['60%']}
    style={{shadowRadius:6,shadowColor:'#000',shadowOpacity:0.15}} 
    >
    <BottomSheetView style={contentContainerStyle}>
      <Text className="mb-8 text-4xl font-bold tracking-wider" style={{ fontFamily: 'Italiana_400Regular' }}>Comments</Text>
      <CommentSection/>
    </BottomSheetView>
  </BottomSheetModal>


  <TouchableOpacity className="w-full items-end" onPress={createCommentsModal}>
    <View className='absolute bottom-10 right-10 rounded-full p-3 shadow-md shadow-gray-300 bg-white'>
      <Ionicons name="chatbubbles-outline" size={40}/>
    </View>
  </TouchableOpacity>

  </View>
  )
}

export default AlbumDetail
