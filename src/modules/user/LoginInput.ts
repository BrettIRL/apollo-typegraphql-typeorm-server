import { Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class LoginInput {
  @Field()
  @Length(1, 64)
  email: string;

  @Field()
  @Length(6)
  password: string;
}
