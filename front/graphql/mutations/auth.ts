import { gql } from '@apollo/client';

export const SIGNUP = gql`
  mutation Signup($email: String!, $password: String!) {
    signup(signupInput: { email: $email, password: $password }) {
      accessToken
      user {
        id
        email
        role
      }
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(loginInput: { email: $email, password: $password }) {
      accessToken
      user {
        id
        email
        role
      }
    }
  }
`;
