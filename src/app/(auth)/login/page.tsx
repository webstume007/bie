'use client';

import { useState } from 'react';
import { loginAction, signupAction } from '@/features/auth/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function AuthPage() {
  const { language } = useLanguage();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const t = {
    en: {
      signIn: 'Sign In',
      signUp: 'Sign Up',
      loginTitle: 'Welcome back',
      loginDesc: 'Enter your credentials to access your account',
      signupTitle: 'Create an account',
      signupDesc: 'Enter your details to register as a student',
      cnic: 'CNIC Number',
      cnicPlaceholder: 'XXXXX-XXXXXXX-X',
      email: 'Email address',
      password: 'Password',
      forgotPassword: 'Forgot password?',
      signInBtn: 'Sign In',
      signUpBtn: 'Create Account',
      loading: 'Please wait...',
    },
    ur: {
      signIn: 'سائن ان',
      signUp: 'سائن اپ',
      loginTitle: 'خوش آمدید',
      loginDesc: 'اپنے اکاؤنٹ تک رسائی کے لیے اپنی تفصیلات درج کریں',
      signupTitle: 'اکاؤنٹ بنائیں',
      signupDesc: 'طالب علم کے طور پر رجسٹر کرنے کے لیے اپنی تفصیلات درج کریں',
      cnic: 'شناختی کارڈ نمبر',
      cnicPlaceholder: 'XXXXX-XXXXXXX-X',
      email: 'ای میل ایڈریس',
      password: 'پاس ورڈ',
      forgotPassword: 'پاس ورڈ بھول گئے؟',
      signInBtn: 'سائن ان کریں',
      signUpBtn: 'اکاؤنٹ بنائیں',
      loading: 'انتظار فرمائیے...',
    }
  }[language];

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    let result;
    if (mode === 'login') {
      result = await loginAction(formData);
    } else {
      result = await signupAction(formData);
    }

    if (result?.error) {
      setError(result.error);
    }
    setLoading(false);
  }

  return (
    <div className="w-full">
      {/* Custom Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-6">
        <button
          onClick={() => { setMode('login'); setError(null); }}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === 'login'
            ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400'
            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
        >
          {t.signIn}
        </button>
        <button
          onClick={() => { setMode('signup'); setError(null); }}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === 'signup'
            ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400'
            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
        >
          {t.signUp}
        </button>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {mode === 'login' ? t.loginTitle : t.signupTitle}
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {mode === 'login' ? t.loginDesc : t.signupDesc}
        </p>
      </div>

      <form action={handleSubmit} className="space-y-4">
        <input type="hidden" name="role" value="student" />

        <div className="space-y-2">
          <Label htmlFor="cnic">{t.cnic}</Label>
          <Input id="cnic" name="cnic" placeholder={t.cnicPlaceholder} required className="h-10" />
        </div>

        {mode === 'signup' && (
          <div className="space-y-2">
            <Label htmlFor="email">{t.email}</Label>
            <Input id="email" name="email" type="email" placeholder="m@example.com" required className="h-10" />
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t.password}</Label>
            {mode === 'login' && (
              <Link href="/reset-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                {t.forgotPassword}
              </Link>
            )}
          </div>
          <div className="relative">
            <Input 
              id="password" 
              name="password" 
              type={showPassword ? "text" : "password"} 
              required 
              className="h-10 pr-10 rtl:pr-3 rtl:pl-10" 
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 -translate-y-1/2 right-3 rtl:right-auto rtl:left-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {error && <div className="text-sm text-red-500 font-medium p-3 bg-red-50 dark:bg-red-900/10 rounded-md border border-red-100 dark:border-red-900/50">{error}</div>}

        <Button className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-neutral-950 font-bold transition-all relative overflow-hidden group" type="submit" disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              {t.loading}
            </span>
          ) : (mode === 'login' ? t.signInBtn : t.signUpBtn)}
        </Button>
      </form>
    </div>
  );
}
