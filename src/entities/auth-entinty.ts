
import { ObjectType, Field } from "type-graphql";
import {
  prop as Prop,
  getModelForClass,
  modelOptions,
  Severity,
} from "@typegoose/typegoose";
import { ObjectId } from "mongodb";

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
@ObjectType()
export class Auth {
  
  @Field()
  readonly _id: ObjectId;

  @Prop({ required: true})
  @Field()
  token: string;

}

export const AuthModel = getModelForClass(Auth, {
  schemaOptions: { timestamps: true },
});