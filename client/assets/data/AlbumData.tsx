interface Photo {
  id: string
  photoName: string
  images: any
}

interface Album {
  id: string
  albumName: string
  photos: Photo[]
}

const albumData: Album[] = [
  {
    id: '1',
    albumName: 'Franch Architecture',
    photos: [
      {
        id: '1',
        photoName: 'LAFAYETTE',
        images: require('@/assets/images/f1.jpg'),
      },
      {
        id: '2',
        photoName: 'Effel Tower',
        images: require('@/assets/images/f2.jpg'),
      },
      {
        id: '3',
        photoName: 'Cafes',
        images: require('@/assets/images/f3.jpg'),
      },
      {
        id: '4',
        photoName: 'Triomphe',
        images: require('@/assets/images/f4.jpg'),
      },
      {
        id: '5',
        photoName: 'La Seine,',
        images: require('@/assets/images/f5.jpg'),
      },
    ],
  },
  {
    id: '2',
    albumName: 'Bondi Beach Trip',
    photos: [
      {
        id: '1',
        photoName: 'Beaches1',
        images: require('@/assets/images/b1.jpg'),
      },
      {
        id: '2',
        photoName: 'Beaches2',
        images: require('@/assets/images/b2.jpg'),
      },
      {
        id: '3',
        photoName: 'Beaches3',
        images: require('@/assets/images/b3.jpg'),
      },
    ],
  },
  {
    id: '3',
    albumName: 'Tokyo City Adventures',
    photos: [
      {
        id: '1',
        photoName: 'Tokyo1',
        images: require('@/assets/images/j1.jpg'),
      },
      {
        id: '2',
        photoName: 'Tokyo2',
        images: require('@/assets/images/j2.jpg'),
      },
      {
        id: '3',
        photoName: 'Tokyo3',
        images: require('@/assets/images/j3.jpg'),
      },
    ],
  },
]

export default albumData
