/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser {
    onCreateUser {
      id
      cognitoID
      identityID
      name
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser {
    onUpdateUser {
      id
      cognitoID
      identityID
      name
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser {
    onDeleteUser {
      id
      cognitoID
      identityID
      name
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
export const onCreatePost = /* GraphQL */ `
  subscription OnCreatePost {
    onCreatePost {
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
        createdAt
        updatedAt
        posts {
          nextToken
        }
      }
    }
  }
`;
export const onUpdatePost = /* GraphQL */ `
  subscription OnUpdatePost {
    onUpdatePost {
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
        createdAt
        updatedAt
        posts {
          nextToken
        }
      }
    }
  }
`;
export const onDeletePost = /* GraphQL */ `
  subscription OnDeletePost {
    onDeletePost {
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
        createdAt
        updatedAt
        posts {
          nextToken
        }
      }
    }
  }
`;
