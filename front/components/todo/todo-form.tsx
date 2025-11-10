'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { CREATE_TODO, UPDATE_TODO } from '@/graphql/mutations/todos';
import { GET_TODOS } from '@/graphql/queries/todos';
import { GET_CATEGORIES } from '@/graphql/queries/categories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Todo, TodoStatus } from '@/lib/types';
import { toast } from 'sonner';

interface TodoFormProps {
  isOpen: boolean;
  onClose: () => void;
  todo?: Todo | null;
}

export function TodoForm({ isOpen, onClose, todo }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [status, setStatus] = useState<TodoStatus>(TodoStatus.PENDING);

  const { data: categoriesData } = useQuery(GET_CATEGORIES);

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description || '');
      setCategoryId(todo.category?.id.toString() || '');
      setStatus(todo.status);
    } else {
      setTitle('');
      setDescription('');
      setCategoryId('');
      setStatus(TodoStatus.PENDING);
    }
  }, [todo]);

  const [createTodo, { loading: creating }] = useMutation(CREATE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
    onCompleted: () => {
      toast.success('Todo created successfully!');
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create todo');
    },
  });

  const [updateTodo, { loading: updating }] = useMutation(UPDATE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
    onCompleted: () => {
      toast.success('Todo updated successfully!');
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update todo');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    const variables = {
      title: title.trim(),
      description: description.trim() || undefined,
      categoryId: categoryId ? parseInt(categoryId) : undefined,
      ...(todo ? { status } : {}),
    };

    if (todo) {
      updateTodo({
        variables: { id: todo.id, ...variables },
      });
    } else {
      createTodo({ variables });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{todo ? 'Edit Todo' : 'Create New Todo'}</DialogTitle>
          <DialogDescription>
            {todo ? 'Update your todo details' : 'Add a new todo to your list'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter todo title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description (optional)"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Category</SelectItem>
                  {categoriesData?.categories.map((category: any) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {todo && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(value) => setStatus(value as TodoStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TodoStatus.PENDING}>Pending</SelectItem>
                    <SelectItem value={TodoStatus.IN_PROGRESS}>In Progress</SelectItem>
                    <SelectItem value={TodoStatus.COMPLETED}>Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={creating || updating}>
              {creating || updating ? 'Saving...' : todo ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
