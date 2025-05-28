import User from '../model/user_model';
import {
  create,
  getById,
  updateById,
  deleteById,
} from '../../helper/service_helper';
import { paginatedData } from '../../utils/pagination';

class UserService {
  async createUser(data: any) {
    return await create(User, data);
  }

  async getUserById(id: string) {
    return await getById(User, id);
  }

  async updateUser(id: string, data: any) {
    return await updateById(User, { id, ...data });
  }

  async deleteUser(id: string) {
    return await deleteById(User, { id });
  }

  async getUsers(
    match: Record<string, any>,
    sort: Record<string, any>,
    page: number,
    perPage: number,
  ) {
    return await paginatedData(User, match, sort, page, perPage);
  }
}

export default new UserService();
