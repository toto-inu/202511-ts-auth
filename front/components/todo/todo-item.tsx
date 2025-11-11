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
      toast.success('Todoを削除しました！');
    },
    onError: (error) => {
      toast.error(error.message || 'Todoの削除に失敗しました');
    },
  });

  const handleDelete = () => {
    if (confirm('このTodoを削除してもよろしいですか？')) {
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
        return '完了';
      case TodoStatus.IN_PROGRESS:
        return '進行中';
      case TodoStatus.PENDING:
        return '未着手';
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
              {todo.description || '説明なし'}
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
            カテゴリ: <span className="font-medium">{todo.category.name}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-xs text-muted-foreground">
          作成日: {new Date(todo.createdAt).toLocaleDateString('ja-JP')}
        </div>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(todo)}>
            <Edit className="h-4 w-4 mr-1" />
            編集
          </Button>
          <Button size="sm" variant="destructive" onClick={handleDelete} disabled={loading}>
            <Trash2 className="h-4 w-4 mr-1" />
            削除
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
