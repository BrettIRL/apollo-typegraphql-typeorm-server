import { createAccessToken, createRefreshToken } from '../../auth';
import bcrypt from 'bcryptjs';
import { User } from '../../entity/User';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { Context } from '../../types/context.interface';
import { LoginInput } from './LoginInput';

@Resolver()
export class LoginResolver {
  @Mutation(() => User)
  async login(
    @Arg('credentials') { email, password }: LoginInput,
    @Ctx() ctx: Context,
  ): Promise<User> {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error('Email does not exist or password is incorrect');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      throw new Error('Email does not exist or password is incorrect');

    user.token = createAccessToken(user);

    ctx.res.cookie('fid', createRefreshToken(user), {
      httpOnly: true,
    });

    return user;
  }
}
