import { userService, IUserService } from '../services/user'

class UserApi {
  constructor(private service: IUserService) {}

  public getAll = async () => {
    return await this.service.getAll()
  }
}

export const userApi = new UserApi(userService)
