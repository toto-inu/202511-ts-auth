import { gql } from '@apollo/client';

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($name: String!, $description: String) {
    createCategory(
      createCategoryInput: { name: $name, description: $description }
    ) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: Int!, $name: String, $description: String) {
    updateCategory(
      updateCategoryInput: { id: $id, name: $name, description: $description }
    ) {
      id
      name
      description
      updatedAt
    }
  }
`;

export const REMOVE_CATEGORY = gql`
  mutation RemoveCategory($id: Int!) {
    removeCategory(id: $id) {
      id
      name
    }
  }
`;
