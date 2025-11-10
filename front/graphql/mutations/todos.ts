import { gql } from '@apollo/client';

export const CREATE_TODO = gql`
  mutation CreateTodo($title: String!, $description: String, $categoryId: Int) {
    createTodo(
      createTodoInput: {
        title: $title
        description: $description
        categoryId: $categoryId
      }
    ) {
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

export const UPDATE_TODO = gql`
  mutation UpdateTodo($id: Int!, $title: String, $description: String, $status: TodoStatus, $categoryId: Int) {
    updateTodo(
      updateTodoInput: {
        id: $id
        title: $title
        description: $description
        status: $status
        categoryId: $categoryId
      }
    ) {
      id
      title
      description
      status
      category {
        id
        name
      }
      updatedAt
    }
  }
`;

export const REMOVE_TODO = gql`
  mutation RemoveTodo($id: Int!) {
    removeTodo(id: $id) {
      id
      title
    }
  }
`;
