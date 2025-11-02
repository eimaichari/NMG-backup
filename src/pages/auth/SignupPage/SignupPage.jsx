// SignupPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import styles from './SignupPage.module.css';

const SignupPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [status, setStatus] = useState({ message: '', type: '' });
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  // Password validation
  const validatePassword = (pwd) => {
    if (pwd.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return null;
  };

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return null;
  };

  const handleSignUp = async () => {
    if (attemptCount >= 5) {
      setStatus({
        message: '⚠️ Too many attempts. Please wait a few minutes before trying again.',
        type: 'warning',
      });
      setTimeout(() => setStatus({ message: '', type: '' }), 5000);
      return;
    }

    if (!fullName || !email || !password || !confirmPassword) {
      setStatus({ message: '❌ Please fill in all fields', type: 'error' });
      setTimeout(() => setStatus({ message: '', type: '' }), 3000);
      return;
    }

    const emailError = validateEmail(email);
    if (emailError) {
      setStatus({ message: `❌ ${emailError}`, type: 'error' });
      setTimeout(() => setStatus({ message: '', type: '' }), 3000);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setStatus({ message: `❌ ${passwordError}`, type: 'error' });
      setTimeout(() => setStatus({ message: '', type: '' }), 3000);
      return;
    }

    if (password !== confirmPassword) {
      setStatus({ message: '❌ Passwords do not match', type: 'error' });
      setTimeout(() => setStatus({ message: '', type: '' }), 3000);
      return;
    }

    if (!agreeTerms) {
      setStatus({
        message: '❌ Please agree to the Terms & Privacy Policy',
        type: 'error',
      });
      setTimeout(() => setStatus({ message: '', type: '' }), 3000);
      return;
    }

    setIsSigningUp(true);
    setAttemptCount((prev) => prev + 1);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: fullName });

      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        fullName,
        email,
        role: 'user',
        agreedToTerms: agreeTerms,
        createdAt: serverTimestamp(),
      });

      setStatus({
        message: '✅ Sign-up successful! Welcome aboard!',
        type: 'success',
      });
      setAttemptCount(0);

      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      console.error('Error signing up:', error);
      let errorMessage = '❌ An error occurred during sign-up.';
      let errorType = 'error';

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage =
            '❌ This email is already registered. Please sign in instead or use a different email.';
          break;
        case 'auth/weak-password':
          errorMessage =
            '❌ Password is too weak. Please use at least 6 characters with a mix of letters and numbers.';
          break;
        case 'auth/invalid-email':
          errorMessage = '❌ The email address format is invalid. Please check and try again.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage =
            '❌ Email/password sign-up is currently disabled. Please contact support.';
          break;
        case 'auth/too-many-requests':
          errorMessage =
            '⚠️ Too many failed attempts. Your account has been temporarily locked for security. Please try again in 15–30 minutes.';
          errorType = 'warning';
          setStatus({ message: errorMessage, type: errorType });
          setTimeout(() => setStatus({ message: '', type: '' }), 8000);
          setIsSigningUp(false);
          return;
        case 'auth/network-request-failed':
          errorMessage = '❌ Network error. Please check your internet connection and try again.';
          break;
        default:
          errorMessage = `❌ Error: ${error.message}`;
      }

      setStatus({ message: errorMessage, type: errorType });
      setTimeout(() => setStatus({ message: '', type: '' }), 6000);
    } finally {
      setIsSigningUp(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

  return (
    <main>
      <section className={styles.signUpSection}>
        <div className={styles.container}>
          <div className={styles.card}>
            <h1 className={styles.gradientText}>Create your account</h1>
            <p>Join NMG Zembeta</p>

            {attemptCount >= 3 && attemptCount < 5 && (
              <div className={styles.warningMessage}>
                ⚠️ Warning: {5 - attemptCount} attempt
                {5 - attemptCount > 1 ? 's' : ''} remaining before temporary lockout
              </div>
            )}

            <div className={styles.signUpForm}>
              <div className={styles.formGroup}>
                <label htmlFor="fullName">Full name</label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={styles.input}
                  disabled={isSigningUp}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  disabled={isSigningUp}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password">Password</label>
                <div className={styles.passwordWrapper}>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password (min. 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                    disabled={isSigningUp}
                  />
                  <span className={styles.togglePassword} onClick={togglePasswordVisibility}>
                    {showPassword ? '🙈' : '👁️'}
                  </span>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">Confirm password</label>
                <div className={styles.passwordWrapper}>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={styles.input}
                    disabled={isSigningUp}
                  />
                  <span
                    className={styles.toggleConfirmPassword}
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </span>
                </div>
              </div>

              <div className={styles.formOptions}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={() => setAgreeTerms((prev) => !prev)}
                    disabled={isSigningUp}
                  />
                  I agree to the Terms & Privacy Policy
                </label>
              </div>

              <button
                className={styles.submitButton}
                onClick={handleSignUp}
                disabled={isSigningUp || attemptCount >= 5}
              >
                {isSigningUp
                  ? 'Creating Account...'
                  : attemptCount >= 5
                  ? 'Too Many Attempts'
                  : 'Create account'}
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

              <button className={styles.googleButton} disabled={isSigningUp}>
                Continue with Google
              </button>

              <p className={styles.signInLink}>
                Already have an account?{' '}
                <Link to={'/auth/signin'} className={styles.link}>
                  Sign in
                </Link>
              </p>

            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SignupPage;
