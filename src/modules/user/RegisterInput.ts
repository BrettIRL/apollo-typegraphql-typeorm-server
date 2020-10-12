import { IsEmail, IsIn, Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { IsEmailUnique } from 'validators/IsEmailUnique';

@InputType()
export class RegisterInput {
  @Field()
  @Length(1, 64)
  firstName: string;

  @Field()
  @Length(1, 64)
  lastName: string;

  @Field()
  @IsEmail()
  @IsEmailUnique({ message: 'Email is not unique' })
  email: string;

  @Field()
  @Length(6)
  password: string;

  @Field({ nullable: true })
  @IsIn(['admin', 'instructor', 'user'])
  role?: string;
}
