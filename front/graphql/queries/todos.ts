import { gql } from '@apollo/client';

export const GET_TODOS = gql`
  query GetTodos {
    todos {
      id
      title
      description
      status
      category {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;
