import { MaxLength, MinLength, IsEmail } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class CreateUserInput {
  @Field()
  @MaxLength(60)
  name: string;

  @Field()
  @MaxLength(60)
  family: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(6)
  password: string;

  
  @Field()
  @MaxLength(30)
  dob: string;

  @Field()
  @MaxLength(30)
  gender: string;
}

@InputType()
export class EditUserInput {

  @Field({ nullable: true })
  @MaxLength(30)
  name?: string;

  @Field({ nullable: true })
  @MaxLength(30)
  family?: string;

  @Field({ nullable: true })
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @MinLength(6)
  password?: string;

  @Field()
  @MaxLength(30)
  dob?: string;

  @Field()
  @MaxLength(30)
  gender?: string;
}