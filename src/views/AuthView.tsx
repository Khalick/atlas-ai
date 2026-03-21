import React, { useState, useContext, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../AppContext';
import { supabase } from '../supabaseClient';
import './AuthView.css';

const AuthView: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { session } = useContext(AppContext);
  const navigate = useNavigate();

  // Redirect when session becomes available (from onAuthStateChange)
  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      }
      // Redirect handled by useEffect when session updates
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });
      if (error) {
        setError(error.message);
      } else if (data.user && !data.session) {
        // Email confirmation required
        setMessage('Account created! Check your email to confirm your account, then log in.');
        setIsLogin(true);
      }
      // If session is returned immediately (email confirmation disabled), 
      // redirect handled by useEffect
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card card">
        <h2>{isLogin ? 'Login to Atlas Capture' : 'Create an Account'}</h2>
        {error && <div style={{ color: '#e53e3e', background: '#fed7d7', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
        {message && <div style={{ color: '#2b6cb0', background: '#bee3f8', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>{message}</div>}
        <form onSubmit={handleSubmit}>
           {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required />
            </div>
          )}
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
          </div>
          <button type="submit" className="btn-primary auth-btn" disabled={loading}>
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>
        <p className="auth-switch" onClick={() => { setIsLogin(!isLogin); setError(''); setMessage(''); }}>
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

export default AuthView;
