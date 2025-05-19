'use client'

import { useAuth } from '@/hooks/useAuth';
import supabase from '@/libs/supabase/client';
import Image from 'next/image';
import { useState, useEffect } from 'react';




const ProfilePage = () => {
  const { user, signOut } = useAuth();

  const [editing, setEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.user_metadata?.username || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (!user) return <p>Loading user data...</p>;

  const email = user.email;
  const avatar = user.user_metadata?.avatar_url || '/default-avatar.png';
  const createdAt = new Date(user.created_at).toLocaleDateString();





  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      alert('Failed to logout!');
    }
  };

  const handleUsernameUpdate = async () => {
    setLoading(true);
    setMessage('');

    // Check for existing username in `profiles`, not `users_view`
    const { data: existing, error: checkErr } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', newUsername);

    // If valid, update



    if (checkErr) {
      setMessage('Error checking username');
      setLoading(false);
      return;
    }

    if (existing.length > 0 && newUsername !== user.user_metadata?.username) {
      setMessage('Username already taken.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      data: { username: newUsername },
    });

    if (error) {
      
      const { error } = await supabase
        .from('profiles')
        .update({ username: newUsername })
        .eq('id', user.id);
        setMessage('Failed to update username.');
    } else {
      setMessage('Username updated successfully!');
      setEditing(false);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center">
        <Image
          src={avatar}
          alt="Profile Picture"
          width={100}
          height={100}
          className="rounded-full mx-auto mb-4"
        />

        {editing ? (
          <div className="mb-3">
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="border px-3 py-1 rounded w-full"
              placeholder="Enter new username"
            />
            <div className="flex justify-center mt-2 gap-2">
              <button
                onClick={handleUsernameUpdate}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Save'}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setNewUsername(user.user_metadata?.username || '');
                  setMessage('');
                }}
                className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-1">{user.user_metadata?.username || 'No username'}</h2>
            <button
              onClick={() => setEditing(true)}
              className="text-sm text-blue-500 hover:underline mb-3"
            >
              Edit Username
            </button>
          </>
        )}

        {message && <p className="text-sm text-center text-gray-600 mb-2">{message}</p>}

        <p className="text-gray-600 mb-1">{email}</p>
        <p className="text-sm text-gray-500 mb-4">Member since: {createdAt}</p>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
