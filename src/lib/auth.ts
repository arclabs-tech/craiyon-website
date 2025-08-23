import { db } from './database';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export interface User {
  id: number;
  username: string;
  total_score: number;
}

export async function loginUser(username: string, password: string): Promise<User | null> {
  try {
    const user = await db
      .selectFrom('users')
      .select(['id', 'username', 'total_score'])
      .where('username', '=', username)
      .where('password', '=', password)
      .executeTakeFirst();

    return user || null;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get('user_id')?.value;
    
    if (!userId) return null;

    const user = await db
      .selectFrom('users')
      .select(['id', 'username', 'total_score'])
      .where('id', '=', parseInt(userId))
      .executeTakeFirst();

    return user || null;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}

export async function logoutUser() {
  const cookieStore = cookies();
  cookieStore.delete('user_id');
} 