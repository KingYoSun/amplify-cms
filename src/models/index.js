// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { User, Post, Admin } = initSchema(schema);

export {
  User,
  Post,
  Admin
};