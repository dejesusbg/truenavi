'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginBody = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/admin');
    }, 1500);
  };

  return (
    <div className="items-center justify-center gap-10 px-6 pt-10 flex-1">
      {/* Logo Section */}
      <div className="items-center">
        <div className="text-white text-6xl">
          <FaUser />
        </div>
        <h1 className="text-white text-3xl font-semibold mt-4">truenavi admin</h1>
      </div>

      {/* Form Section */}
      <div className="w-full max-w-sm">
        {/* Email Input */}
        <div className="flex-row items-center bg-input rounded-lg p-3 mb-4">
          <FaUser className="text-icon text-xl mr-3" />
          <input
            type="text"
            placeholder="admin@truenavi.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-foreground-subtle focus:outline-none"
          />
        </div>

        {/* Password Input */}
        <div className="flex-row items-center bg-input rounded-lg p-3 mb-4 relative">
          <FaLock className="text-icon text-xl mr-3" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-foreground-subtle focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-white">
            {showPassword ? <FaEyeSlash className="text-icon" /> : <FaEye className="text-icon" />}
          </button>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={!email || !password || isLoading}
          className={`w-full py-3 mt-4 rounded-lg text-white font-semibold ${
            !email || !password || isLoading ? 'bg-btn-disabled' : 'bg-btn-secondary'
          } transition`}>
          {isLoading ? 'authenticating...' : 'login'}
        </button>
      </div>

      {/* Security Note */}
      <p className="text-foreground-muted text-sm mt-4">authorized personnel only</p>
    </div>
  );
};

export default LoginBody;
