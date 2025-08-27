import React, { useState } from 'react';
import styles from './SignInPage.module.css';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../../utils/firebase';
import { Link, useNavigate } from 'react-router-dom';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const navigate = useNavigate();
  const handleSignIn = async () => {
  if (email && password) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      await signInWithEmailAndPassword(auth, email, password);
      setStatusMessage('Sign-in successful');
      setTimeout(() => setStatusMessage(''), 3000);
      navigate('/'); // Redirect to home or desired page after sign-in
      setStatusMessage(`Error: ${error.message}`);
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (error) {
      setStatusMessage(`Error: ${error.message}`);
      setTimeout(() => setStatusMessage(''), 3000);
    }
  } else {
    setStatusMessage('Please fill in all fields');
    setTimeout(() => setStatusMessage(''), 3000);
  }
};


const handleGoogleSignIn = async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    setStatusMessage('Google sign-in successful');
    setTimeout(() => setStatusMessage(''), 3000);
    navigate('/'); // Redirect to home or desired page after Google sign-in
  } catch (error) {
    setStatusMessage(`Error: ${error.message}`);
    setTimeout(() => setStatusMessage(''), 3000);
  }
};


  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <main>
      <section className={styles.signInSection}>
        <div className={styles.container}>
          <div className={styles.card}>
            <h1 className={styles.gradientText}>Welcome back</h1>
            <p>Sign in to continue</p>
            <div className={styles.signInForm}>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="password">Password</label>
                <div className={styles.passwordWrapper}>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                  />
                  <span
                    className={styles.togglePassword}
                    onClick={togglePasswordVisibility}
                  >
                    👁️
                  </span>
                </div>
              </div>
              <div className={styles.formOptions}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe((prev) => !prev)}
                  />
                  Remember me
                </label>
                <a href="#" className={styles.link}>Forgot password?</a>
              </div>
              <button className={styles.submitButton} onClick={handleSignIn}>
                Sign In
              </button>
              <div className={styles.divider}>
                <span>or</span>
              </div>
              <button
                className={styles.googleButton}
                onClick={handleGoogleSignIn}
              >
                Continue with Google
              </button>
              <p className={styles.createAccount}>
                Don’t have an account? <Link to={'/auth/signup'} className={styles.link}>Create one</Link>
              </p>
              {statusMessage && (
                <div className={`${styles.statusMessage} ${statusMessage.includes('successful') ? styles.success : ''}`}>
                  {statusMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SignInPage;