import { Resolver, Query, Mutation, Arg, Authorized } from "type-graphql";
import { User, UserModel } from "../../entities/user-entity";
import { CreateUserInput, EditUserInput } from "./user-arguments";
import { UserRoles } from "../user/user.roles";
import bcryptjs from "bcryptjs";

@Resolver()
export class UserResolver {
  @Query((returns) => [User])
  async users(): Promise<User[]> {
    return await UserModel.find({});
  }

  @Query((returns) => User)
  async user(@Arg("_id") _id: string): Promise<User> {
    return await UserModel.findById(_id);
  }

  @Mutation((returns) => User)
  async createUser(@Arg("data") data: CreateUserInput): Promise<User> {
    const userData = {
      ...data,
      password: bcryptjs.hashSync(data.password, 10),
    };
    const newUser = new UserModel(userData);
    await newUser.save();
    return newUser;
  }

  @Authorized([UserRoles.SUPER_ADMIN])
  @Mutation((returns) => User)
  async deleteUser(@Arg("_id") _id: string): Promise<User> {
    return await UserModel.findByIdAndRemove(_id);
  }

  @Mutation((returns) => User)
  async editUser(
    @Arg("_id") _id: string,
    @Arg("data") data: EditUserInput
  ): Promise<User> {
    const userData = data.password
      ? {
          ...data,
          password: bcryptjs.hashSync(data.password, 10),
        }
      : data;
    return await UserModel.findByIdAndUpdate(_id, userData, { new: true });
  }
}