'use client';

import { useMutation } from '@apollo/client/react';
import { REMOVE_TODO } from '@/graphql/mutations/todos';
import { GET_TODOS } from '@/graphql/queries/todos';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Todo, TodoStatus } from '@/lib/types';
import { toast } from 'sonner';
import { Trash2, Edit } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
}

export function TodoItem({ todo, onEdit }: TodoItemProps) {
  const [removeTodo, { loading }] = useMutation(REMOVE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
    onCompleted: () => {
      toast.success('Todo deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete todo');
    },
  });

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this todo?')) {
      removeTodo({ variables: { id: todo.id } });
    }
  };

  const getStatusColor = (status: TodoStatus) => {
    switch (status) {
      case TodoStatus.COMPLETED:
        return 'default';
      case TodoStatus.IN_PROGRESS:
        return 'secondary';
      case TodoStatus.PENDING:
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: TodoStatus) => {
    switch (status) {
      case TodoStatus.COMPLETED:
        return 'Completed';
      case TodoStatus.IN_PROGRESS:
        return 'In Progress';
      case TodoStatus.PENDING:
        return 'Pending';
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{todo.title}</CardTitle>
            <CardDescription className="mt-1">
              {todo.description || 'No description'}
            </CardDescription>
          </div>
          <Badge variant={getStatusColor(todo.status)}>
            {getStatusLabel(todo.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {todo.category && (
          <div className="text-sm text-muted-foreground">
            Category: <span className="font-medium">{todo.category.name}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-xs text-muted-foreground">
          Created: {new Date(todo.createdAt).toLocaleDateString()}
        </div>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(todo)}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button size="sm" variant="destructive" onClick={handleDelete} disabled={loading}>
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
