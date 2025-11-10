'use client';

import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Role } from '@/lib/types';

export function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="border-b bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="/dashboard" className="text-xl font-bold">
            Todo App
          </Link>
          <div className="flex space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            {user.role === Role.ADMIN && (
              <Link href="/categories">
                <Button variant="ghost">Categories</Button>
              </Link>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Badge variant={user.role === Role.ADMIN ? 'default' : 'secondary'}>
              {user.role}
            </Badge>
          </div>
          <Button onClick={logout} variant="outline">
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
