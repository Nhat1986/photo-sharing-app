// src/data/GroupData.tsx

// 타입 정의
interface Members {
  id: string
  memberName: string
  images: any
}

interface Groups {
  id: string
  groupName: string
  members: Members[]
}


const groupData: Groups[] = [
  {
    id: '1',
    groupName: 'Movie Goers',
    members: [
      {
        id: '1',
        memberName: 'member1',
        images: require('@/assets/images/p1.jpeg'),
      },
      {
        id: '2',
        memberName: 'member2',
        images: require('@/assets/images/p2.jpeg'),
      },
      {
        id: '3',
        memberName: 'member3',
        images: require('@/assets/images/p3.jpeg'),
      },
      {
        id: '4',
        memberName: 'member4',
        images: require('@/assets/images/p4.jpeg'),
      },
    ],
  },
  {
    id: '2',
    groupName: 'The Inner Circle',
    members: [
      {
        id: '1',
        memberName: 'member5',
        images: require('@/assets/images/p5.jpeg'),
      },
      {
        id: '2',
        memberName: 'member6',
        images: require('@/assets/images/p6.jpeg'),
      },
    ],
  },
]

export default groupData
