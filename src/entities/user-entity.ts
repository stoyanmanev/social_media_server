import { ObjectType, Field } from "type-graphql";
import {
  prop as Prop,
  getModelForClass,
  modelOptions,
  Severity,
} from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { UserRoles } from "../resolvers/user/user.roles";

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
@ObjectType()
export class User {

  @Field()
  readonly _id: ObjectId;

  @Prop({ required: true}) // mongodb
  @Field() // graphql
  name: string; //typescript

  @Prop({ required: true }) // mongodb
  @Field() // graphql
  family: string; //typescript

  @Prop({ required: true})
  @Field()
  email: string;

  @Prop({ required: true })
  @Field()
  password: string;

  @Prop({ required: true })
  @Field()
  dob: string;

  @Prop({ required: true })
  @Field()
  gender: string;

  @Prop({ default: Date.now() })
  @Field()
  lastLogin?: number;

  @Prop({ default: [UserRoles.USER] })
  @Field(type => [String])
  roles?: string[]
  exp: number;
}

export const UserModel = getModelForClass(User, { schemaOptions: { timestamps: true }});