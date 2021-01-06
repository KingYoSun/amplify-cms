import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class User {
  readonly id: string;
  readonly cognitoID: string;
  readonly identityID?: string;
  readonly name: string;
  readonly viewName?: string;
  readonly email?: string;
  readonly description?: string;
  readonly iconUrl?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly posts?: (Post | null)[];
  constructor(init: ModelInit<User>);
  static copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
}

export declare class Post {
  readonly id: string;
  readonly div: string;
  readonly title: string;
  readonly contentUrl?: string;
  readonly tags?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly user?: User;
  constructor(init: ModelInit<Post>);
  static copyOf(source: Post, mutator: (draft: MutableModel<Post>) => MutableModel<Post> | void): Post;
}

export declare class Admin {
  readonly id: string;
  readonly user?: User;
  constructor(init: ModelInit<Admin>);
  static copyOf(source: Admin, mutator: (draft: MutableModel<Admin>) => MutableModel<Admin> | void): Admin;
}