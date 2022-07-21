import { Resolver, Query, Mutation, Args, Ctx } from "type-graphql";
import { User, UserModel } from "../../entities/user-entity";
import { AuthModel, Auth } from "../../entities/auth-entinty";
import { LoginAgruments } from "./login-arguments";
import { Context } from "./context";
import { UserInputError, AuthenticationError } from "apollo-server-core";
import bcryptjs from "bcryptjs";
import { getToken } from "./token";


@Resolver()
export class AuthResolver {
  @Query((returns) => User)
  async currentUser(@Ctx() ctx: Context): Promise<User> {
    if (!ctx.user) {
      throw new AuthenticationError("user_not_authenticated");
    }

    const user = await UserModel.findById(ctx.user._id);
    const token = ctx.req.headers.authorization.split(" ")[1];
    const expiredТoken = await AuthModel.find({token});


    if(Array.isArray(expiredТoken) && expiredТoken.length !== 0){
      throw new AuthenticationError("user_not_authenticated");
    }

    if (ctx.user.exp * 1000 < Date.now()) {
      const newAuth = new AuthModel({ token });
      await newAuth.save();
      throw new AuthenticationError("user_not_authenticated");
    }

    return user;
  }

  @Mutation((returns) => String)
  async login(@Args() { email, password }: LoginAgruments) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new UserInputError("Wrong email or password");
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UserInputError("Wrong email or password");
    }

    user.lastLogin = Date.now();
    await user.save();
    return getToken(user._id, user.roles);
  }

  @Mutation((returns) => Auth)
  async logout(@Ctx() ctx: Context) {
    if (!ctx.user) {
      throw new AuthenticationError("user_not_authenticated");
    }

    const token = ctx.req.headers.authorization.split(" ")[1];

    const newAuth = new AuthModel({ token });

    await newAuth.save();
    return newAuth;
  }
}