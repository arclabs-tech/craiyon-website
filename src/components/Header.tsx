'use client';

import { User } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { LogOut, Trophy, Home } from 'lucide-react';
import { toast } from 'sonner';

interface HeaderProps {
  user: User;
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('Logged out successfully');
        router.push('/login');
        router.refresh();
      } else {
        toast.error('Logout failed');
      }
    } catch (error) {
      toast.error('An error occurred during logout');
    }
  };

  return (
    <header className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-xl border-b border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Craiyon Challenge
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-slate-600 dark:text-slate-400">Welcome</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">{user.username}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/')}
                className="hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/leaderboard')}
                className="hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Leaderboard
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 