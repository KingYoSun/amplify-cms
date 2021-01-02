/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      cognitoID
      identityID
      name
      viewName
      email
      description
      iconUrl
      createdAt
      updatedAt
      posts {
        items {
          id
          title
          contentUrl
          userID
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      cognitoID
      identityID
      name
      viewName
      email
      description
      iconUrl
      createdAt
      updatedAt
      posts {
        items {
          id
          title
          contentUrl
          userID
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      cognitoID
      identityID
      name
      viewName
      email
      description
      iconUrl
      createdAt
      updatedAt
      posts {
        items {
          id
          title
          contentUrl
          userID
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;
export const createPost = /* GraphQL */ `
  mutation CreatePost(
    $input: CreatePostInput!
    $condition: ModelPostConditionInput
  ) {
    createPost(input: $input, condition: $condition) {
      id
      title
      contentUrl
      userID
      createdAt
      updatedAt
      user {
        id
        cognitoID
        identityID
        name
        viewName
        email
        description
        iconUrl
        createdAt
        updatedAt
        posts {
          nextToken
        }
      }
    }
  }
`;
export const updatePost = /* GraphQL */ `
  mutation UpdatePost(
    $input: UpdatePostInput!
    $condition: ModelPostConditionInput
  ) {
    updatePost(input: $input, condition: $condition) {
      id
      title
      contentUrl
      userID
      createdAt
      updatedAt
      user {
        id
        cognitoID
        identityID
        name
        viewName
        email
        description
        iconUrl
        createdAt
        updatedAt
        posts {
          nextToken
        }
      }
    }
  }
`;
export const deletePost = /* GraphQL */ `
  mutation DeletePost(
    $input: DeletePostInput!
    $condition: ModelPostConditionInput
  ) {
    deletePost(input: $input, condition: $condition) {
      id
      title
      contentUrl
      userID
      createdAt
      updatedAt
      user {
        id
        cognitoID
        identityID
        name
        viewName
        email
        description
        iconUrl
        createdAt
        updatedAt
        posts {
          nextToken
        }
      }
    }
  }
`;
export const createAdmin = /* GraphQL */ `
  mutation CreateAdmin(
    $input: CreateAdminInput!
    $condition: ModelAdminConditionInput
  ) {
    createAdmin(input: $input, condition: $condition) {
      id
      userID
      user {
        id
        cognitoID
        identityID
        name
        viewName
        email
        description
        iconUrl
        createdAt
        updatedAt
        posts {
          nextToken
        }
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateAdmin = /* GraphQL */ `
  mutation UpdateAdmin(
    $input: UpdateAdminInput!
    $condition: ModelAdminConditionInput
  ) {
    updateAdmin(input: $input, condition: $condition) {
      id
      userID
      user {
        id
        cognitoID
        identityID
        name
        viewName
        email
        description
        iconUrl
        createdAt
        updatedAt
        posts {
          nextToken
        }
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteAdmin = /* GraphQL */ `
  mutation DeleteAdmin(
    $input: DeleteAdminInput!
    $condition: ModelAdminConditionInput
  ) {
    deleteAdmin(input: $input, condition: $condition) {
      id
      userID
      user {
        id
        cognitoID
        identityID
        name
        viewName
        email
        description
        iconUrl
        createdAt
        updatedAt
        posts {
          nextToken
        }
      }
      createdAt
      updatedAt
    }
  }
`;
