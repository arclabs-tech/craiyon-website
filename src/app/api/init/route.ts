import { NextResponse } from 'next/server';
import { initializeApp } from '@/lib/init-db';

export async function POST() {
  try {
    await initializeApp();
    return NextResponse.json({ success: true, message: 'Database initialized successfully' });
  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize database' },
      { status: 500 }
    );
  }
} 