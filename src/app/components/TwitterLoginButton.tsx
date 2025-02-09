'use client';

export default function TwitterLoginButton() {
  const handleLogin = () => {
    window.location.href = '/api/auth/twitter';
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-[#1DA1F2] text-white px-4 py-2 rounded-md hover:bg-[#1a8cd8] transition-colors"
    >
      Login with Twitter
    </button>
  );
} 