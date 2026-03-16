import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiEye, HiEyeOff, HiAcademicCap, HiLockClosed, HiMail } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email) e.email = 'Email is required';
    else if (!email.includes('@')) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const ok = await login(email, password);
    if (!ok) {
      toast.error('Invalid credentials. Try student@auy.edu.mm / password', {
        style: { background: 'rgba(20,20,30,0.95)', color: '#fff', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '14px' },
        icon: '🔐',
      });
    } else {
      toast.success('Welcome back!', {
        style: { background: 'rgba(20,20,30,0.95)', color: '#fff', border: '1px solid rgba(52,211,153,0.3)', borderRadius: '14px' },
      });
    }
  };

  const fillDemo = () => {
    setEmail('student@auy.edu.mm');
    setPassword('password');
    setErrors({});
  };

  return (
    <div className="min-h-screen hero-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] rounded-full bg-emerald-500/4 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-md"
      >
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl glass-strong mb-5 glow-blue relative"
          >
            <HiAcademicCap className="text-4xl text-blue-400" />
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#0a0a0f] dot-pulse" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold gradient-text mb-1"
          >
            AUY Portal
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-white/40 text-sm tracking-wide"
          >
            American University of Yangon
          </motion.p>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="glass-strong rounded-3xl p-8"
        >
          <h2 className="text-xl font-semibold text-white/90 mb-1">Sign In</h2>
          <p className="text-white/40 text-sm mb-7">Access your student dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-widest">Email Address</label>
              <div className="relative">
                <HiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-lg" />
                <input
                  type="text"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })); }}
                  placeholder="you@auy.edu.mm"
                  className="input-glass w-full pl-10 pr-4 py-3 rounded-2xl text-sm"
                />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-red-400 text-xs mt-1.5 pl-1">
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-widest">Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-lg" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })); }}
                  placeholder="Enter your password"
                  className="input-glass w-full pl-10 pr-12 py-3 rounded-2xl text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <HiEyeOff className="text-lg" /> : <HiEye className="text-lg" />}
                </button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-red-400 text-xs mt-1.5 pl-1">
                    {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.01 }}
              className="w-full py-3.5 rounded-2xl font-semibold text-sm text-white relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeLinecap="round" />
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In to Portal'}
            </motion.button>
          </form>

          {/* Demo hint */}
          <div className="mt-6 pt-6 border-t border-white/8">
            <p className="text-white/30 text-xs text-center mb-3">Quick demo access</p>
            <button
              onClick={fillDemo}
              className="w-full py-2.5 rounded-xl text-xs text-white/50 hover:text-white/80 border border-white/8 hover:border-white/15 hover:bg-white/5 transition-all duration-200 font-medium"
            >
              Fill Demo Credentials
            </button>
            <p className="text-white/20 text-xs text-center mt-3">
              student@auy.edu.mm · password
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-white/20 text-xs mt-6">
          © 2024 American University of Yangon · All rights reserved
        </p>
      </motion.div>
    </div>
  );
}
