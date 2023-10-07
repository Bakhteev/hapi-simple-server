import { ServerRoute } from '@hapi/hapi'
import { userApi } from '../api/user'

export default <ServerRoute[]>[
  {
    method: 'GET',
    path: '/users',
    handler: userApi.getAll,
    // options: {
    //   auth: true,
    // },
  },
]
