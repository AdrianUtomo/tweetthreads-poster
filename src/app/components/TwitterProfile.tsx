// app/components/TwitterProfile.tsx
'use client';

import { useEffect, useState } from 'react';

interface TwitterUser {
  id: string;
  name: string;
  username: string;
  profile_image_url?: string;
  description?: string;
}

export default function TwitterProfile() {
  const [user, setUser] = useState<TwitterUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/twitter/user');
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Not authenticated. Please log in.');
          }
          throw new Error('Failed to fetch user data');
        }
        
        const userData = await response.json();
        setUser(userData);
        console.log('User authenticated:', userData);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    window.location.href = '/api/auth/twitter/logout';
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center p-4 text-red-500">
        <p>{error}</p>
        <button 
          onClick={() => window.location.href = '/api/auth/twitter'}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Login with Twitter
        </button>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-card rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {user.profile_image_url && (
            <img 
              src={user.profile_image_url}
              alt={user.name}
              className="w-16 h-16 rounded-full"
            />
          )}
          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      {user.description && (
        <p className="mt-4 text-card-foreground">{user.description}</p>
      )}
    </div>
  );
}