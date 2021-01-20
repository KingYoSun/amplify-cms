/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateUserInput = {
  id?: string | null,
  cognitoID: string,
  identityID?: string | null,
  name: string,
  viewName?: string | null,
  email?: string | null,
  description?: string | null,
  iconUrl?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  _version?: number | null,
};

export type ModelUserConditionInput = {
  cognitoID?: ModelStringInput | null,
  identityID?: ModelStringInput | null,
  name?: ModelStringInput | null,
  viewName?: ModelStringInput | null,
  email?: ModelStringInput | null,
  description?: ModelStringInput | null,
  iconUrl?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelUserConditionInput | null > | null,
  or?: Array< ModelUserConditionInput | null > | null,
  not?: ModelUserConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type UpdateUserInput = {
  id: string,
  cognitoID?: string | null,
  identityID?: string | null,
  name?: string | null,
  viewName?: string | null,
  email?: string | null,
  description?: string | null,
  iconUrl?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  _version?: number | null,
};

export type DeleteUserInput = {
  id?: string | null,
  _version?: number | null,
};

export type CreatePostInput = {
  id?: string | null,
  div: string,
  title: string,
  contentUrl?: string | null,
  tags?: string | null,
  userID: string,
  draft?: boolean | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  _version?: number | null,
};

export type ModelPostConditionInput = {
  div?: ModelStringInput | null,
  title?: ModelStringInput | null,
  contentUrl?: ModelStringInput | null,
  tags?: ModelStringInput | null,
  userID?: ModelIDInput | null,
  draft?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelPostConditionInput | null > | null,
  or?: Array< ModelPostConditionInput | null > | null,
  not?: ModelPostConditionInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type UpdatePostInput = {
  id: string,
  div?: string | null,
  title?: string | null,
  contentUrl?: string | null,
  tags?: string | null,
  userID?: string | null,
  draft?: boolean | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  _version?: number | null,
};

export type DeletePostInput = {
  id?: string | null,
  _version?: number | null,
};

export type CreateAdminInput = {
  id?: string | null,
  userID: string,
  _version?: number | null,
};

export type ModelAdminConditionInput = {
  userID?: ModelIDInput | null,
  and?: Array< ModelAdminConditionInput | null > | null,
  or?: Array< ModelAdminConditionInput | null > | null,
  not?: ModelAdminConditionInput | null,
};

export type UpdateAdminInput = {
  id: string,
  userID?: string | null,
  _version?: number | null,
};

export type DeleteAdminInput = {
  id?: string | null,
  _version?: number | null,
};

export type ModelUserFilterInput = {
  id?: ModelIDInput | null,
  cognitoID?: ModelStringInput | null,
  identityID?: ModelStringInput | null,
  name?: ModelStringInput | null,
  viewName?: ModelStringInput | null,
  email?: ModelStringInput | null,
  description?: ModelStringInput | null,
  iconUrl?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelUserFilterInput | null > | null,
  or?: Array< ModelUserFilterInput | null > | null,
  not?: ModelUserFilterInput | null,
};

export type ModelPostFilterInput = {
  id?: ModelIDInput | null,
  div?: ModelStringInput | null,
  title?: ModelStringInput | null,
  contentUrl?: ModelStringInput | null,
  tags?: ModelStringInput | null,
  userID?: ModelIDInput | null,
  draft?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelPostFilterInput | null > | null,
  or?: Array< ModelPostFilterInput | null > | null,
  not?: ModelPostFilterInput | null,
};

export type ModelAdminFilterInput = {
  id?: ModelIDInput | null,
  userID?: ModelIDInput | null,
  and?: Array< ModelAdminFilterInput | null > | null,
  or?: Array< ModelAdminFilterInput | null > | null,
  not?: ModelAdminFilterInput | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelStringKeyConditionInput = {
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type CreateUserMutationVariables = {
  input: CreateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type CreateUserMutation = {
  createUser:  {
    __typename: "User",
    id: string,
    cognitoID: string,
    identityID: string | null,
    name: string,
    viewName: string | null,
    email: string | null,
    description: string | null,
    iconUrl: string | null,
    createdAt: string | null,
    updatedAt: string | null,
    posts:  {
      __typename: "ModelPostConnection",
      nextToken: string | null,
      startedAt: number | null,
    } | null,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type UpdateUserMutationVariables = {
  input: UpdateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type UpdateUserMutation = {
  updateUser:  {
    __typename: "User",
    id: string,
    cognitoID: string,
    identityID: string | null,
    name: string,
    viewName: string | null,
    email: string | null,
    description: string | null,
    iconUrl: string | null,
    createdAt: string | null,
    updatedAt: string | null,
    posts:  {
      __typename: "ModelPostConnection",
      nextToken: string | null,
      startedAt: number | null,
    } | null,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type DeleteUserMutationVariables = {
  input: DeleteUserInput,
  condition?: ModelUserConditionInput | null,
};

export type DeleteUserMutation = {
  deleteUser:  {
    __typename: "User",
    id: string,
    cognitoID: string,
    identityID: string | null,
    name: string,
    viewName: string | null,
    email: string | null,
    description: string | null,
    iconUrl: string | null,
    createdAt: string | null,
    updatedAt: string | null,
    posts:  {
      __typename: "ModelPostConnection",
      nextToken: string | null,
      startedAt: number | null,
    } | null,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type CreatePostMutationVariables = {
  input: CreatePostInput,
  condition?: ModelPostConditionInput | null,
};

export type CreatePostMutation = {
  createPost:  {
    __typename: "Post",
    id: string,
    div: string,
    title: string,
    contentUrl: string | null,
    tags: string | null,
    userID: string,
    draft: boolean | null,
    createdAt: string | null,
    updatedAt: string | null,
    user:  {
      __typename: "User",
      id: string,
      cognitoID: string,
      identityID: string | null,
      name: string,
      viewName: string | null,
      email: string | null,
      description: string | null,
      iconUrl: string | null,
      createdAt: string | null,
      updatedAt: string | null,
      _version: number,
      _deleted: boolean | null,
      _lastChangedAt: number,
    } | null,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type UpdatePostMutationVariables = {
  input: UpdatePostInput,
  condition?: ModelPostConditionInput | null,
};

export type UpdatePostMutation = {
  updatePost:  {
    __typename: "Post",
    id: string,
    div: string,
    title: string,
    contentUrl: string | null,
    tags: string | null,
    userID: string,
    draft: boolean | null,
    createdAt: string | null,
    updatedAt: string | null,
    user:  {
      __typename: "User",
      id: string,
      cognitoID: string,
      identityID: string | null,
      name: string,
      viewName: string | null,
      email: string | null,
      description: string | null,
      iconUrl: string | null,
      createdAt: string | null,
      updatedAt: string | null,
      _version: number,
      _deleted: boolean | null,
      _lastChangedAt: number,
    } | null,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type DeletePostMutationVariables = {
  input: DeletePostInput,
  condition?: ModelPostConditionInput | null,
};

export type DeletePostMutation = {
  deletePost:  {
    __typename: "Post",
    id: string,
    div: string,
    title: string,
    contentUrl: string | null,
    tags: string | null,
    userID: string,
    draft: boolean | null,
    createdAt: string | null,
    updatedAt: string | null,
    user:  {
      __typename: "User",
      id: string,
      cognitoID: string,
      identityID: string | null,
      name: string,
      viewName: string | null,
      email: string | null,
      description: string | null,
      iconUrl: string | null,
      createdAt: string | null,
      updatedAt: string | null,
      _version: number,
      _deleted: boolean | null,
      _lastChangedAt: number,
    } | null,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type CreateAdminMutationVariables = {
  input: CreateAdminInput,
  condition?: ModelAdminConditionInput | null,
};

export type CreateAdminMutation = {
  createAdmin:  {
    __typename: "Admin",
    id: string,
    userID: string,
    user:  {
      __typename: "User",
      id: string,
      cognitoID: string,
      identityID: string | null,
      name: string,
      viewName: string | null,
      email: string | null,
      description: string | null,
      iconUrl: string | null,
      createdAt: string | null,
      updatedAt: string | null,
      _version: number,
      _deleted: boolean | null,
      _lastChangedAt: number,
    } | null,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateAdminMutationVariables = {
  input: UpdateAdminInput,
  condition?: ModelAdminConditionInput | null,
};

export type UpdateAdminMutation = {
  updateAdmin:  {
    __typename: "Admin",
    id: string,
    userID: string,
    user:  {
      __typename: "User",
      id: string,
      cognitoID: string,
      identityID: string | null,
      name: string,
      viewName: string | null,
      email: string | null,
      description: string | null,
      iconUrl: string | null,
      createdAt: string | null,
      updatedAt: string | null,
      _version: number,
      _deleted: boolean | null,
      _lastChangedAt: number,
    } | null,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteAdminMutationVariables = {
  input: DeleteAdminInput,
  condition?: ModelAdminConditionInput | null,
};

export type DeleteAdminMutation = {
  deleteAdmin:  {
    __typename: "Admin",
    id: string,
    userID: string,
    user:  {
      __typename: "User",
      id: string,
      cognitoID: string,
      identityID: string | null,
      name: string,
      viewName: string | null,
      email: string | null,
      description: string | null,
      iconUrl: string | null,
      createdAt: string | null,
      updatedAt: string | null,
      _version: number,
      _deleted: boolean | null,
      _lastChangedAt: number,
    } | null,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type SyncUsersQueryVariables = {
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncUsersQuery = {
  syncUsers:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      cognitoID: string,
      identityID: string | null,
      name: string,
      viewName: string | null,
      email: string | null,
      description: string | null,
      iconUrl: string | null,
      createdAt: string | null,
      updatedAt: string | null,
      _version: number,
      _deleted: boolean | null,
      _lastChangedAt: number,
    } | null > | null,
    nextToken: string | null,
    startedAt: number | null,
  } | null,
};

export type GetUserQueryVariables = {
  id: string,
};

export type GetUserQuery = {
  getUser:  {
    __typename: "User",
    id: string,
    cognitoID: string,
    identityID: string | null,
    name: string,
    viewName: string | null,
    email: string | null,
    description: string | null,
    iconUrl: string | null,
    createdAt: string | null,
    updatedAt: string | null,
    posts:  {
      __typename: "ModelPostConnection",
      nextToken: string | null,
      startedAt: number | null,
    } | null,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type ListUsersQueryVariables = {
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUsersQuery = {
  listUsers:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      cognitoID: string,
      identityID: string | null,
      name: string,
      viewName: string | null,
      email: string | null,
      description: string | null,
      iconUrl: string | null,
      createdAt: string | null,
      updatedAt: string | null,
      _version: number,
      _deleted: boolean | null,
      _lastChangedAt: number,
    } | null > | null,
    nextToken: string | null,
    startedAt: number | null,
  } | null,
};

export type SyncPostsQueryVariables = {
  filter?: ModelPostFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncPostsQuery = {
  syncPosts:  {
    __typename: "ModelPostConnection",
    items:  Array< {
      __typename: "Post",
      id: string,
      div: string,
      title: string,
      contentUrl: string | null,
      tags: string | null,
      userID: string,
      draft: boolean | null,
      createdAt: string | null,
      updatedAt: string | null,
      _version: number,
      _deleted: boolean | null,
      _lastChangedAt: number,
    } | null > | null,
    nextToken: string | null,
    startedAt: number | null,
  } | null,
};

export type GetPostQueryVariables = {
  id: string,
};

export type GetPostQuery = {
  getPost:  {
    __typename: "Post",
    id: string,
    div: string,
    title: string,
    contentUrl: string | null,
    tags: string | null,
    userID: string,
    draft: boolean | null,
    createdAt: string | null,
    updatedAt: string | null,
    user:  {
      __typename: "User",
      id: string,
      cognitoID: string,
      identityID: string | null,
      name: string,
      viewName: string | null,
      email: string | null,
      description: string | null,
      iconUrl: string | null,
      createdAt: string | null,
      updatedAt: string | null,
      _version: number,
      _deleted: boolean | null,
      _lastChangedAt: number,
    } | null,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type ListPostsQueryVariables = {
  filter?: ModelPostFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPostsQuery = {
  listPosts:  {
    __typename: "ModelPostConnection",
    items:  Array< {
      __typename: "Post",
      id: string,
      div: string,
      title: string,
      contentUrl: string | null,
      tags: string | null,
      userID: string,
      draft: boolean | null,
      createdAt: string | null,
      updatedAt: string | null,
      _version: number,
      _deleted: boolean | null,
      _lastChangedAt: number,
    } | null > | null,
    nextToken: string | null,
    startedAt: number | null,
  } | null,
};

export type SyncAdminsQueryVariables = {
  filter?: ModelAdminFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncAdminsQuery = {
  syncAdmins:  {
    __typename: "ModelAdminConnection",
    items:  Array< {
      __typename: "Admin",
      id: string,
      userID: string,
      _version: number,
      _deleted: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
    startedAt: number | null,
  } | null,
};

export type GetAdminQueryVariables = {
  id: string,
};

export type GetAdminQuery = {
  getAdmin:  {
    __typename: "Admin",
    id: string,
    userID: string,
    user:  {
      __typename: "User",
      id: string,
      cognitoID: string,
      identityID: string | null,
      name: string,
      viewName: string | null,
      email: string | null,
      description: string | null,
      iconUrl: string | null,
      createdAt: string | null,
      updatedAt: string | null,
      _version: number,
      _deleted: boolean | null,
      _lastChangedAt: number,
    } | null,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListAdminsQueryVariables = {
  filter?: ModelAdminFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAdminsQuery = {
  listAdmins:  {
    __typename: "ModelAdminConnection",
    items:  Array< {
      __typename: "Admin",
      id: string,
      userID: string,
      _version: number,
      _deleted: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
    startedAt: number | null,
  } | null,
};

export type UserByCognitoIdQueryVariables = {
  cognitoID?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UserByCognitoIdQuery = {
  userByCognitoID:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      cognitoID: string,
      identityID: string | null,
      name: string,
      viewName: string | null,
      email: string | null,
      description: string | null,
      iconUrl: string | null,
      createdAt: string | null,
      updatedAt: string | null,
      _version: number,
      _deleted: boolean | null,
      _lastChangedAt: number,
    } | null > | null,
    nextToken: string | null,
    startedAt: number | null,
  } | null,
};

export type PostByCreatedAtQueryVariables = {
  div?: string | null,
  createdAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelPostFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type PostByCreatedAtQuery = {
  postByCreatedAt:  {
    __typename: "ModelPostConnection",
    items:  Array< {
      __typename: "Post",
      id: string,
      div: string,
      title: string,
      contentUrl: string | null,
      tags: string | null,
      userID: string,
      draft: boolean | null,
      createdAt: string | null,
      updatedAt: string | null,
      _version: number,
      _deleted: boolean | null,
      _lastChangedAt: number,
    } | null > | null,
    nextToken: string | null,
    startedAt: number | null,
  } | null,
};

export type PostByUpdatedAtQueryVariables = {
  div?: string | null,
  updatedAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelPostFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type PostByUpdatedAtQuery = {
  postByUpdatedAt:  {
    __typename: "ModelPostConnection",
    items:  Array< {
      __typename: "Post",
      id: string,
      div: string,
      title: string,
      contentUrl: string | null,
      tags: string | null,
      userID: string,
      draft: boolean | null,
      createdAt: string | null,
      updatedAt: string | null,
      _version: number,
      _deleted: boolean | null,
      _lastChangedAt: number,
    } | null > | null,
    nextToken: string | null,
    startedAt: number | null,
  } | null,
};

export type AdminByCognitoIdQueryVariables = {
  userID?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelAdminFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type AdminByCognitoIdQuery = {
  adminByCognitoID:  {
    __typename: "ModelAdminConnection",
    items:  Array< {
      __typename: "Admin",
      id: string,
      userID: string,
      _version: number,
      _deleted: boolean | null,
      _lastChangedAt: number,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
    startedAt: number | null,
  } | null,
};

export type OnCreateUserSubscription = {
  onCreateUser:  {
    __typename: "User",
    id: string,
    cognitoID: string,
    identityID: string | null,
    name: string,
    viewName: string | null,
    email: string | null,
    description: string | null,
    iconUrl: string | null,
    createdAt: string | null,
    updatedAt: string | null,
    posts:  {
      __typename: "ModelPostConnection",
      nextToken: string | null,
      startedAt: number | null,
    } | null,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnUpdateUserSubscription = {
  onUpdateUser:  {
    __typename: "User",
    id: string,
    cognitoID: string,
    identityID: string | null,
    name: string,
    viewName: string | null,
    email: string | null,
    description: string | null,
    iconUrl: string | null,
    createdAt: string | null,
    updatedAt: string | null,
    posts:  {
      __typename: "ModelPostConnection",
      nextToken: string | null,
      startedAt: number | null,
    } | null,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnDeleteUserSubscription = {
  onDeleteUser:  {
    __typename: "User",
    id: string,
    cognitoID: string,
    identityID: string | null,
    name: string,
    viewName: string | null,
    email: string | null,
    description: string | null,
    iconUrl: string | null,
    createdAt: string | null,
    updatedAt: string | null,
    posts:  {
      __typename: "ModelPostConnection",
      nextToken: string | null,
      startedAt: number | null,
    } | null,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnCreatePostSubscription = {
  onCreatePost:  {
    __typename: "Post",
    id: string,
    div: string,
    title: string,
    contentUrl: string | null,
    tags: string | null,
    userID: string,
    draft: boolean | null,
    createdAt: string | null,
    updatedAt: string | null,
    user:  {
      __typename: "User",
      id: string,
      cognitoID: string,
      identityID: string | null,
      name: string,
      viewName: string | null,
      email: string | null,
      description: string | null,
      iconUrl: string | null,
      createdAt: string | null,
      updatedAt: string | null,
      _version: number,
      _deleted: boolean | null,
      _lastChangedAt: number,
    } | null,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnUpdatePostSubscription = {
  onUpdatePost:  {
    __typename: "Post",
    id: string,
    div: string,
    title: string,
    contentUrl: string | null,
    tags: string | null,
    userID: string,
    draft: boolean | null,
    createdAt: string | null,
    updatedAt: string | null,
    user:  {
      __typename: "User",
      id: string,
      cognitoID: string,
      identityID: string | null,
      name: string,
      viewName: string | null,
      email: string | null,
      description: string | null,
      iconUrl: string | null,
      createdAt: string | null,
      updatedAt: string | null,
      _version: number,
      _deleted: boolean | null,
      _lastChangedAt: number,
    } | null,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnDeletePostSubscription = {
  onDeletePost:  {
    __typename: "Post",
    id: string,
    div: string,
    title: string,
    contentUrl: string | null,
    tags: string | null,
    userID: string,
    draft: boolean | null,
    createdAt: string | null,
    updatedAt: string | null,
    user:  {
      __typename: "User",
      id: string,
      cognitoID: string,
      identityID: string | null,
      name: string,
      viewName: string | null,
      email: string | null,
      description: string | null,
      iconUrl: string | null,
      createdAt: string | null,
      updatedAt: string | null,
      _version: number,
      _deleted: boolean | null,
      _lastChangedAt: number,
    } | null,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnCreateAdminSubscription = {
  onCreateAdmin:  {
    __typename: "Admin",
    id: string,
    userID: string,
    user:  {
      __typename: "User",
      id: string,
      cognitoID: string,
      identityID: string | null,
      name: string,
      viewName: string | null,
      email: string | null,
      description: string | null,
      iconUrl: string | null,
      createdAt: string | null,
      updatedAt: string | null,
      _version: number,
      _deleted: boolean | null,
      _lastChangedAt: number,
    } | null,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateAdminSubscription = {
  onUpdateAdmin:  {
    __typename: "Admin",
    id: string,
    userID: string,
    user:  {
      __typename: "User",
      id: string,
      cognitoID: string,
      identityID: string | null,
      name: string,
      viewName: string | null,
      email: string | null,
      description: string | null,
      iconUrl: string | null,
      createdAt: string | null,
      updatedAt: string | null,
      _version: number,
      _deleted: boolean | null,
      _lastChangedAt: number,
    } | null,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteAdminSubscription = {
  onDeleteAdmin:  {
    __typename: "Admin",
    id: string,
    userID: string,
    user:  {
      __typename: "User",
      id: string,
      cognitoID: string,
      identityID: string | null,
      name: string,
      viewName: string | null,
      email: string | null,
      description: string | null,
      iconUrl: string | null,
      createdAt: string | null,
      updatedAt: string | null,
      _version: number,
      _deleted: boolean | null,
      _lastChangedAt: number,
    } | null,
    _version: number,
    _deleted: boolean | null,
    _lastChangedAt: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};
