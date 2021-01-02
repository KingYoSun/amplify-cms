/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getPost = /* GraphQL */ `
  query GetPost($id: ID!) {
    getPost(id: $id) {
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
export const listPosts = /* GraphQL */ `
  query ListPosts(
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        }
      }
      nextToken
    }
  }
`;
export const getAdmin = /* GraphQL */ `
  query GetAdmin($id: ID!) {
    getAdmin(id: $id) {
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
export const listAdmins = /* GraphQL */ `
  query ListAdmins(
    $filter: ModelAdminFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAdmins(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const userByCognitoId = /* GraphQL */ `
  query UserByCognitoId(
    $cognitoID: String
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    userByCognitoID(
      cognitoID: $cognitoID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
