import React, { useState } from 'react';
import styles from './SignInPage.module.css';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
// Assuming the path to firebase utils and auth is correct
import { auth } from '../../../utils/firebase'; 
import { Link, useNavigate } from 'react-router-dom';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Refactored state: tracks message content and its type for styling
  const [status, setStatus] = useState({ message: '', type: null }); 
  
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  const navigate = useNavigate();

  // Helper to clear the status message after a duration
  const clearStatus = (duration = 3000) => {
    setTimeout(() => setStatus({ message: '', type: null }), duration);
  };

  const handleSignIn = async () => {
    // Check if too many attempts
    if (attemptCount >= 5) {
      setStatus({ message: 'Too many attempts. Please wait a few minutes before trying again.', type: 'warning' });
      clearStatus(5000);
      return;
    }

    if (!email || !password) {
      setStatus({ message: 'Please fill in all fields', type: 'error' });
      clearStatus(3000);
      return;
    }

    setIsSigningIn(true);
    setAttemptCount(prev => prev + 1);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Success
      setStatus({ message: 'Sign-in successful! Redirecting...', type: 'success' });
      setAttemptCount(0); // Reset on success
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error('Error signing in:', error);
      let errorMessage = 'Sign-in failed. Please try again.';
      let errorType = 'error'; // Default to error

      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email. Please sign up first.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again or reset your password.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email format. Please check and try again.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled. Please contact support.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed login attempts. Your account has been temporarily locked. Please try again in 15-30 minutes or reset your password.';
          errorType = 'warning'; // Treat this as a strong warning
          setStatus({ message: errorMessage, type: errorType });
          clearStatus(8000);
          setIsSigningIn(false);
          return;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your internet connection.';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
          break;
        default:
          errorMessage = `Error: ${error.message}`;
      }

      // Set the error/warning status
      setStatus({ message: errorMessage, type: errorType });
      clearStatus(6000);

    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    setIsSigningIn(true);

    try {
      await signInWithPopup(auth, provider);
      // Success
      setStatus({ message: 'Google sign-in successful!', type: 'success' });
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error('Error with Google sign-in:', error);
      let errorMessage = 'Google sign-in failed.';
      
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Sign-in cancelled. Please try again.';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'Pop-up blocked by browser. Please allow pop-ups and try again.';
          break;
        case 'auth/account-exists-with-different-credential':
          errorMessage = 'An account already exists with this email using a different sign-in method.';
          break;
        default:
          errorMessage = `Error: ${error.message}`;
      }
      
      // Set the error status
      setStatus({ message: errorMessage, type: 'error' });
      clearStatus(5000);

    } finally {
      setIsSigningIn(false);
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

            {attemptCount >= 3 && attemptCount < 5 && (
              <div className={styles.warningMessage}>
                ⚠️ Warning: {5 - attemptCount} attempt{5 - attemptCount > 1 ? 's' : ''} remaining before temporary lockout
              </div>
            )}

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
                  disabled={isSigningIn}
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
                    disabled={isSigningIn}
                  />
                  <span
                    className={styles.togglePassword}
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </span>
                </div>
              </div>
              <div className={styles.formOptions}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe((prev) => !prev)}
                    disabled={isSigningIn}
                  />
                  Remember me
                </label>
                <a href="#" className={styles.link}>Forgot password?</a>
              </div>
              <button 
                className={styles.submitButton} 
                onClick={handleSignIn}
                disabled={isSigningIn || attemptCount >= 5}
              >
                {isSigningIn ? 'Signing In...' : attemptCount >= 5 ? 'Too Many Attempts' : 'Sign In'}
              </button>

              {/* --- UPDATED STATUS RENDERING --- */}
              {status.message && (
                <div className={`${styles.statusMessage} ${styles[status.type]}`}>
                  {status.message}
                </div>
              )}
              {/* --- END UPDATED STATUS RENDERING --- */}

              <div className={styles.divider}>
                <span>or</span>
              </div>
              <button
                className={styles.googleButton}
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
              >
                Continue with Google
              </button>
              <p className={styles.createAccount}>
                Don't have an account? <Link to={'/auth/signup'} className={styles.link}>Create one</Link>
              </p>
              

            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SignInPage;
