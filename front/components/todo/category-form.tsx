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
      toast.success('Category created successfully!');
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create category');
    },
  });

  const [updateCategory, { loading: updating }] = useMutation(UPDATE_CATEGORY, {
    refetchQueries: [{ query: GET_CATEGORIES }],
    onCompleted: () => {
      toast.success('Category updated successfully!');
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update category');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter a category name');
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
          <DialogTitle>{category ? 'Edit Category' : 'Create New Category'}</DialogTitle>
          <DialogDescription>
            {category ? 'Update category details' : 'Add a new category for organizing todos'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter category name"
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
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={creating || updating}>
              {creating || updating ? 'Saving...' : category ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
