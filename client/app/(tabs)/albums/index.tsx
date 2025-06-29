import { Text, View, Image, FlatList, TouchableOpacity, TouchableHighlight, StyleSheet, TextInput } from 'react-native'

import { Link, useLocalSearchParams } from 'expo-router'
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFonts, Italiana_400Regular } from '@expo-google-fonts/italiana'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { api } from '@/external/fetch'
import {
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import ErrorCard from '@/components/ErrorCard'
import Button, { DestructiveButton } from '@/components/CustomButton'
import { useUserSession } from '@/components/contexts/sessionContext'


// type Album = {
//   description: string;
//   name: string;
//   dateCreated: string;
//   id: string;
//   lastUpdated: string;
//   numImages?: number | null;
//   owner: string;
//   thumbnailUrl: string;
// }

type Album = {
  id: string
  name: string
  description?: string
  thumbnailUrl?: string
  images: { id: string; url: string }[]
  numImages?: number
}

export default function Albums() {
  const [fontsLoaded] = useFonts({
    Italiana_400Regular,
  })
  const navigation = useNavigation()
  const [fetchedUrl, setFetchedUrl] = useState('')
  const [albums, setAlbums] = useState<Album[]>([])
  const [selectedAlbum, setSelectedAlbum] = useState<Album|undefined>(undefined)
  const {userId} = useUserSession()



  const { bottom: bottomSafeArea } = useSafeAreaInsets();
  const albumOptionsModalRef = useRef<BottomSheetModal>(null);
  const addAlbumModalRef = useRef<BottomSheetModal>(null);

  const createAlbumOptionsModal = useCallback(() => {
    albumOptionsModalRef.current?.present();
  }, []);

  const createAddAlbumModal = useCallback(() => {
    addAlbumModalRef.current?.present();
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

  //#region styles
  const contentContainerStyle = useMemo(
    () => ({
      ...styles.contentContainer,
      paddingBottom: bottomSafeArea,
      
    }),
    [bottomSafeArea]
  );



  const fetchAlbumDetails = async (albumId: string) => {
    try {
      const { data, error } = await api.GET('/album/{albumId}', {
        params: {
          path: { albumId },
        },
      })

      if (error) {
        console.error(`Failed to fetch album details for ${albumId}:`, error)
        return null
      }
      if(!data.album) return null;

      return {
        id: data.album.id,
        name: data.album.name,
        description: data.album.description,
        thumbnailUrl: data.album.thumbnailUrl || '',
        numImages: data.album.numImages || 0,
      }
    } catch (err) {
      console.error('Failed to fetch album details:', err)
      return null
    }
  }

  const fetchImages = async (albumId: string) => {
    try {
      const { data, error } = await api.GET('/image/all/{albumId}', {
        params: { path: { albumId } },
      })
      if (error) {
        return []
      }

      return (data || []).slice(0, 4).map((image: any) => ({
        id: image.id,
        url: image.imageUrl,
      }))
    } catch (err) {
      return []
    }
  }

  const fetchAlbums = async() => {
    const { data, error } = await api.GET('/album/all/{userId}', {
      params: {
        path: {
          userId: userId || '',
        },
      },
    })
  
    if(error) throw new Error('Unable to Fetch Group Albums');
    if(!data.albumIds) return

    const albumsWithImages = await Promise.all(
      data.albumIds.map(async (albumId) => {
        const albumDetails = await fetchAlbumDetails(albumId)
        if(!albumDetails) return undefined;

        return {
          ...albumDetails,
          images:await fetchImages(albumId)
        }
      })
    )

    const filteredAlbums = albumsWithImages.filter(a => a != undefined)
    
    setAlbums(filteredAlbums)
  }


  useEffect(() => {
    if (userId) fetchAlbums()
  }, [userId])


  //-------
  const CreateAlbumForm = () => {
    const [newAlbumName,setNewAlbumName] = useState<string>("");
    const [newAlbumDesc,setNewAlbumDesc] = useState<string>("");
    const [isError, setIsError] = useState(false);

    async function createNewGroup(){
      if(newAlbumName.trim() == "" || newAlbumDesc.trim() == "" ){
        setIsError(true);
        return;
      }
      //Note: biggest issue here could be ownerid being null somehow
      setIsError(false);
      const {data,error} = await api.POST('/album',{
        body:{
          ownerId: userId || '',
          name:newAlbumName.trim(),
          description:newAlbumDesc.trim(),
        }
      })

      if(error){
        setIsError(true);
      }

      //Sucessful create
      addAlbumModalRef.current?.dismiss()
      fetchAlbums();
    
    }

    return (
      <>
        <TextInput
          style={{ fontFamily: 'Nunito_400Regular' }}
          className="bg-white border-gray-200 border-solid border-2 p-4 mb-4 rounded-lg w-full"
          placeholder="Name"
          placeholderTextColor="#6b7280"
          autoCapitalize="none"
          value={newAlbumName}
          onChangeText={(value:string) => setNewAlbumName(value)}
        ></TextInput>

        <TextInput
          style={{ fontFamily: 'Nunito_400Regular' }}
          className="bg-white border-gray-200 border-solid border-2 p-4 mb-4 rounded-lg w-full"
          placeholder="Description"
          placeholderTextColor="#6b7280"
          autoCapitalize="none"
          value={newAlbumDesc}
          onChangeText={(value:string) => setNewAlbumDesc(value)}
        ></TextInput>

        <Button title='Create' onPress={createNewGroup}></Button>
        { isError && <ErrorCard/>}
        
        <></>
      </>
    )
  }


  const AlbumActions = () => {
    const [isError, setIsError] = useState(false);

    const deleteSelectedAlbum = async () => {
      const {data,error} = await api.DELETE('/album/{albumId}',{
        params:{path:{albumId:selectedAlbum?.id||''}}
      })

      if(error) setIsError(true);
      albumOptionsModalRef.current?.dismiss()
      fetchAlbums();
    };

    return (
      
      <View>
        <DestructiveButton title='Delete Group' onPress={deleteSelectedAlbum}></DestructiveButton>
        { isError && <ErrorCard/>}
      </View>
    )
  }


  const ThumbnailGrid: FC<{images:{ id: string; url: string; }[]}> = ({images}) => {
    return (
      <View className="w-full h-full flex flex-row flex-wrap">
        {images.slice(0, 4).map((image, index) => (
          <View key={index} className='w-1/2 h-1/2 p-0.5'>
            <Image className='w-full h-full rounded-md' source={{ uri: image.url }} resizeMode="cover"/>
          </View>
        ))
        }
  
      </View>
    );
  };


  const AlbumComponent: FC<{album:Album}> = ({album}) => {
    const callback = () => {
      setSelectedAlbum(album)
      createAlbumOptionsModal()
    }
    const gesture = Gesture.LongPress().onStart(callback)

    return (
      <GestureDetector gesture={gesture}>
        <View className="mb-6 w-1/2">
          <Link href={{pathname:"/(routes)/album-detail/[albumId]",params:{ albumId: album.id }}} asChild>
            <TouchableOpacity>
              <View className='w-full aspect-square p-2'>
                <ThumbnailGrid images={album.images}/>
              </View>
            
              <Text className="text-left text-xl flex-wrap font-thin ml-2 mt-1">
                {album.name || 'Album Name'}
              </Text>
              <Text className="text-xs text-gray-400 ml-2">
                {`${album.numImages || 0} photos`}
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </GestureDetector>
    )
  }


  const AlbumList = () => {
    return (
    <FlatList
      data={albums}
      numColumns={2}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <AlbumComponent key={item.id} album={item}/>}
      contentContainerStyle={{ paddingBottom: 16 }}
    />
  );
};



  const AddAlbumButton = () => {
    return (
      // <Pressable>
        <TouchableHighlight className='justify-center rounded-full aspect-square align-middle' activeOpacity={0.1} underlayColor="#DDDDDD" 
          onPress={createAddAlbumModal}
          >
          <Ionicons name="add-outline" size={40}/>
        </TouchableHighlight>
      // </Pressable>
    )
  }


  return (
    <View className="flex-1 p-4 bg-white">
    <View className='flex flex-row mb-6'>
      <Text className="flex-grow text-4xl tracking-wider" style={{ fontFamily: 'Italiana_400Regular' }}>
        Albums
      </Text>
      <AddAlbumButton/>
      
    </View>
    <AlbumList />
    <BottomSheetModal 
    ref={addAlbumModalRef} 
    index={0}
    snapPoints={['50%']}
    style={{shadowRadius:6,shadowColor:'#000',shadowOpacity:0.15}} 
    >
    <BottomSheetView style={contentContainerStyle}>
      <Text className="mb-8 text-4xl font-bold tracking-wider" style={{ fontFamily: 'Italiana_400Regular' }}>Create Album</Text>
      <CreateAlbumForm/>
    </BottomSheetView>
  </BottomSheetModal>

  {/* Actions modal */}
  <BottomSheetModal 
    ref={albumOptionsModalRef} 
    index={0}
    snapPoints={['50%']}
    style={{shadowRadius:6,shadowColor:'#000',shadowOpacity:0.15}} 
    >
    <BottomSheetView style={contentContainerStyle}>
      <Text className="mb-8 text-4xl font-bold tracking-wider" style={{ fontFamily: 'Italiana_400Regular' }}>{selectedAlbum?.name}</Text>
      <AlbumActions/>
    </BottomSheetView>
  </BottomSheetModal>


  </View>
  )
}
