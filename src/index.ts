import { ApolloServer } from 'apollo-server-express';
import { AuthGuard } from './auth/AuthGuard';
import * as refreshController from './auth/refreshController';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { LoginResolver } from './modules/user/Login';
import { MeResolver } from './modules/user/Me';
import { RegisterResolver } from './modules/user/Register';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';

const main = async () => {
  try {
    await createConnection();
  } catch (err) {
    console.log('Connection Error', err);
  }

  const schema = await buildSchema({
    resolvers: [RegisterResolver, LoginResolver, MeResolver],
    authChecker: AuthGuard,
  });

  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
  });

  const app = express();
  app.use(cookieParser());
  app.use(
    cors({
      origin: process.env.CORS_ALLOWED_ORIGIN,
      credentials: true,
    }),
  );

  app.post('/refresh_token', refreshController.refresh);

  server.applyMiddleware({ app, path: '/', cors: false });

  app.listen(process.env.PORT, () => {
    console.log(
      `🚀  Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`,
    );
  });
};

main();
