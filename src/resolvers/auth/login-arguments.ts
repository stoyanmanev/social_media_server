
import { MinLength, IsEmail } from "class-validator";
import { Field, ArgsType } from "type-graphql";

@ArgsType()
export class LoginAgruments {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(6)
  password: string;
}