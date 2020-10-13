import { User } from '../../entity/User';
import { Authorized, Ctx, Query, Resolver } from 'type-graphql';
import { Context } from '../../types/context.interface';

@Resolver()
export class MeResolver {
  @Authorized()
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: Context): Promise<User | undefined> {
    if (!ctx.userId) return undefined;

    return User.findOne(ctx.userId);
  }
}
