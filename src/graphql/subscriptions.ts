/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser {
    onCreateUser {
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
        startedAt
      }
      _version
      _deleted
      _lastChangedAt
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
      viewName
      email
      description
      iconUrl
      createdAt
      updatedAt
      posts {
        nextToken
        startedAt
      }
      _version
      _deleted
      _lastChangedAt
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
      viewName
      email
      description
      iconUrl
      createdAt
      updatedAt
      posts {
        nextToken
        startedAt
      }
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const onCreatePost = /* GraphQL */ `
  subscription OnCreatePost {
    onCreatePost {
      id
      div
      title
      contentUrl
      tags
      userID
      draft
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
        _version
        _deleted
        _lastChangedAt
      }
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const onUpdatePost = /* GraphQL */ `
  subscription OnUpdatePost {
    onUpdatePost {
      id
      div
      title
      contentUrl
      tags
      userID
      draft
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
        _version
        _deleted
        _lastChangedAt
      }
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const onDeletePost = /* GraphQL */ `
  subscription OnDeletePost {
    onDeletePost {
      id
      div
      title
      contentUrl
      tags
      userID
      draft
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
        _version
        _deleted
        _lastChangedAt
      }
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const onCreateAdmin = /* GraphQL */ `
  subscription OnCreateAdmin {
    onCreateAdmin {
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
        _version
        _deleted
        _lastChangedAt
      }
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateAdmin = /* GraphQL */ `
  subscription OnUpdateAdmin {
    onUpdateAdmin {
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
        _version
        _deleted
        _lastChangedAt
      }
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteAdmin = /* GraphQL */ `
  subscription OnDeleteAdmin {
    onDeleteAdmin {
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
        _version
        _deleted
        _lastChangedAt
      }
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
