'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_TODOS } from '@/graphql/queries/todos';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Navbar } from '@/components/layout/navbar';
import { TodoForm } from '@/components/todo/todo-form';
import { TodoItem } from '@/components/todo/todo-item';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Todo, TodoStatus } from '@/lib/types';
import { Plus } from 'lucide-react';

export default function DashboardPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const { data, loading, error } = useQuery(GET_TODOS, {
    fetchPolicy: 'cache-and-network',
  });

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTodo(null);
  };

  const filteredTodos = data?.todos?.filter((todo: Todo) => {
    if (statusFilter === 'ALL') return true;
    return todo.status === statusFilter;
  }) || [];

  const todosByStatus = {
    [TodoStatus.PENDING]: filteredTodos.filter((t: Todo) => t.status === TodoStatus.PENDING),
    [TodoStatus.IN_PROGRESS]: filteredTodos.filter((t: Todo) => t.status === TodoStatus.IN_PROGRESS),
    [TodoStatus.COMPLETED]: filteredTodos.filter((t: Todo) => t.status === TodoStatus.COMPLETED),
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">My Todos</h1>
              <p className="text-muted-foreground mt-1">
                Manage your tasks and stay organized
              </p>
            </div>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Todo
            </Button>
          </div>

          <div className="mb-6">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium">Filter by status:</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Todos</SelectItem>
                  <SelectItem value={TodoStatus.PENDING}>Pending</SelectItem>
                  <SelectItem value={TodoStatus.IN_PROGRESS}>In Progress</SelectItem>
                  <SelectItem value={TodoStatus.COMPLETED}>Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading && (
            <div className="flex justify-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-destructive">Error loading todos: {error.message}</p>
            </div>
          )}

          {!loading && !error && filteredTodos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {statusFilter === 'ALL'
                  ? 'No todos yet. Create your first todo to get started!'
                  : `No ${statusFilter.toLowerCase()} todos found.`}
              </p>
            </div>
          )}

          {!loading && !error && filteredTodos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {statusFilter === 'ALL' ? (
                <>
                  {Object.entries(todosByStatus).map(([status, todos]) => (
                    <div key={status}>
                      <h2 className="text-xl font-semibold mb-4 capitalize">
                        {status.replace('_', ' ')} ({(todos as Todo[]).length})
                      </h2>
                      <div className="space-y-4">
                        {(todos as Todo[]).map((todo) => (
                          <TodoItem key={todo.id} todo={todo} onEdit={handleEdit} />
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="col-span-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTodos.map((todo: Todo) => (
                      <TodoItem key={todo.id} todo={todo} onEdit={handleEdit} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <TodoForm isOpen={isFormOpen} onClose={handleCloseForm} todo={editingTodo} />
      </div>
    </ProtectedRoute>
  );
}
