import { createAccessToken, createRefreshToken } from '../../auth';
import bcrypt from 'bcryptjs';
import { User, UserRole } from '../../entity/User';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { Context } from '../../types/context.interface';
import { RegisterInput } from './RegisterInput';

@Resolver()
export class RegisterResolver {
  @Mutation(() => User)
  async register(
    @Arg('user') { firstName, lastName, email, password, role }: RegisterInput,
    @Ctx() ctx: Context,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || UserRole.USER,
    }).save();

    user.token = createAccessToken(user);

    ctx.res.cookie('fid', createRefreshToken(user), {
      httpOnly: true,
    });

    return user;
  }
}
