'use client';

import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client/react';
import { CREATE_CATEGORY, UPDATE_CATEGORY } from '@/graphql/mutations/categories';
import { GET_CATEGORIES } from '@/graphql/queries/categories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Category } from '@/lib/types';
import { toast } from 'sonner';

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
}

export function CategoryForm({ isOpen, onClose, category }: CategoryFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description || '');
    } else {
      setName('');
      setDescription('');
    }
  }, [category]);

  const [createCategory, { loading: creating }] = useMutation(CREATE_CATEGORY, {
    refetchQueries: [{ query: GET_CATEGORIES }],
    onCompleted: () => {
      toast.success('カテゴリを作成しました！');
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || 'カテゴリの作成に失敗しました');
    },
  });

  const [updateCategory, { loading: updating }] = useMutation(UPDATE_CATEGORY, {
    refetchQueries: [{ query: GET_CATEGORIES }],
    onCompleted: () => {
      toast.success('カテゴリを更新しました！');
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || 'カテゴリの更新に失敗しました');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('カテゴリ名を入力してください');
      return;
    }

    const variables = {
      name: name.trim(),
      description: description.trim() || undefined,
    };

    if (category) {
      updateCategory({
        variables: { id: category.id, ...variables },
      });
    } else {
      createCategory({ variables });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? 'カテゴリを編集' : '新しいカテゴリを作成'}</DialogTitle>
          <DialogDescription>
            {category ? 'カテゴリの詳細を更新します' : 'Todoを整理するための新しいカテゴリを追加します'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">名前</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="カテゴリ名を入力"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">説明</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="説明を入力（任意）"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button type="submit" disabled={creating || updating}>
              {creating || updating ? '保存中...' : category ? '更新' : '作成'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
