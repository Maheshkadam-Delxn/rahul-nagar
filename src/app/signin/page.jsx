"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) {
      router.replace('/admin');
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign in');
      }

      if (data.token && data.user) {
        // Make sure user has all required fields
        const userData = {
          token: data.token,
          user: {
            id: data.user.id || data.user._id,
            name: data.user.name,
            role: data.user.role,
            email: data.user.email
          }
        };
        
        console.log("Storing auth data:", userData);
        
        // IMPORTANT: Set the cookie manually to ensure it's set
        try {
          import('js-cookie').then(Cookies => {
            Cookies.set('authToken', userData.token, { expires: 7 });
            console.log("Cookie set:", Cookies.get('authToken') ? "Success" : "Failed");
          });
        } catch (e) {
          console.error("Error setting cookie:", e);
        }
        
        // Call login function
        await login(userData);
        
        // Check if cookie was set
        import('js-cookie').then(Cookies => {
          const cookieToken = Cookies.get('authToken');
          console.log("Cookie after login:", cookieToken ? "Present" : "Missing");
        });
        
        setTimeout(() => {
          console.log("Redirecting to admin page");
          router.push("/admin")
        }, 300);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="md:w-1/2 relative">
          <img src="/building.jpg" alt="Cooperative Housing Society" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
          <div className="absolute bottom-0 left-0 p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">Rahul Nagar</h1>
            <p className="mb-1">Cooperative Housing Society</p>
            <p className="text-sm opacity-80">Building communities, creating homes</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="md:w-1/2 p-8">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800">Sign In</h2>
            <p className="text-gray-600 text-sm mt-1">Welcome back, please login to your account</p>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-green-600 hover:text-green-500">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 border border-transparent rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-medium"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <a href="#" className="font-medium text-green-600 hover:text-green-500">
                Contact your administrator
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
