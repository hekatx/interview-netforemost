import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`;

export const GET_USER = gql`
  query GetBooks {
    books {
      title
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($deleteUserId: String) {
    deleteUser(id: $deleteUserId) {
      id
    }
  }
`;

export const ADD_USER = gql`
  mutation AddUser($user: UserInput) {
    addUser(user: $user) {
      id
      name
      email
      role
    }
  }
`;

export const EDIT_USER = gql`
  mutation EditUser($user: EditUserInput) {
    editUser(user: $user) {
      name
      email
      role
    }
  }
`;
