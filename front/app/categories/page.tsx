'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_CATEGORIES } from '@/graphql/queries/categories';
import { REMOVE_CATEGORY } from '@/graphql/mutations/categories';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Navbar } from '@/components/layout/navbar';
import { CategoryForm } from '@/components/todo/category-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Category, Role } from '@/lib/types';
import { toast } from 'sonner';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function CategoriesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { data, loading, error } = useQuery(GET_CATEGORIES, {
    fetchPolicy: 'cache-and-network',
  });

  const [removeCategory] = useMutation(REMOVE_CATEGORY, {
    refetchQueries: [{ query: GET_CATEGORIES }],
    onCompleted: () => {
      toast.success('カテゴリを削除しました！');
    },
    onError: (error) => {
      toast.error(error.message || 'カテゴリの削除に失敗しました');
    },
  });

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('このカテゴリを削除してもよろしいですか？既存のTodoに影響する可能性があります。')) {
      removeCategory({ variables: { id } });
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  return (
    <ProtectedRoute requiredRole={Role.ADMIN}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">カテゴリ管理</h1>
              <p className="text-muted-foreground mt-1">
                管理者専用: Todoカテゴリを管理
              </p>
            </div>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              新規カテゴリ
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>カテゴリ一覧</CardTitle>
              <CardDescription>
                ユーザーがTodoに割り当てるカテゴリを管理します
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="flex justify-center py-12">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
                </div>
              )}

              {error && (
                <div className="text-center py-12">
                  <p className="text-destructive">カテゴリの読み込みエラー: {error.message}</p>
                </div>
              )}

              {!loading && !error && data?.categories.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    まだカテゴリがありません。最初のカテゴリを作成しましょう！
                  </p>
                </div>
              )}

              {!loading && !error && data?.categories.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>名前</TableHead>
                      <TableHead>説明</TableHead>
                      <TableHead>作成日</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.categories.map((category: Category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{category.description || '説明なし'}</TableCell>
                        <TableCell>
                          {new Date(category.createdAt).toLocaleDateString('ja-JP')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(category)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              編集
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(category.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              削除
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        <CategoryForm isOpen={isFormOpen} onClose={handleCloseForm} category={editingCategory} />
      </div>
    </ProtectedRoute>
  );
}
