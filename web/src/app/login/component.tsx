'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  MdAdminPanelSettings,
  MdLock,
  MdPerson,
  MdVisibility,
  MdVisibilityOff,
} from 'react-icons/md';
import { InputField, Button, LoadingIndicator } from '@/components';
import { loginUser, logoutUser } from '@/services/auth';

const LoginComponent = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    logoutUser();
  }, []);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    const res = await loginUser(email, password);
    setIsLoading(false);

    if (res.success) router.push('/admin');
  };

  return (
    <div className="items-center justify-center flex-1 gap-10 px-6 pt-10">
      <div className="items-center">
        <div className="text-6xl text-white">
          <MdAdminPanelSettings />
        </div>
        <h1 className="mt-4 text-3xl font-semibold text-white">truenavi admin</h1>
      </div>

      {/* form section */}
      <form className="w-full max-w-sm" onSubmit={handleLogin}>
        <InputField
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@truenavi.com"
          icon={<MdPerson />}
          className="p-4 mb-4"
        />

        <InputField
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          icon={<MdLock />}
          rightIcon={showPassword ? <MdVisibility /> : <MdVisibilityOff />}
          onRightIconClick={() => setShowPassword(!showPassword)}
          className="p-4 mb-4"
        />

        <Button
          type="submit"
          disabled={!email || !password || isLoading}
          variant={!email || !password || isLoading ? 'disabled' : 'secondary'}
          fullWidth
          className="p-4 mt-4">
          {isLoading ? <LoadingIndicator /> : 'login'}
        </Button>
      </form>

      {/* security note */}
      <p className="mt-4 text-sm text-foreground-muted">authorized personnel only</p>
    </div>
  );
};

export default LoginComponent;
