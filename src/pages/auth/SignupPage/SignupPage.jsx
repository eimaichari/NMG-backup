import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
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
  const [statusMessage, setStatusMessage] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);

  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  const handleSignUp = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      setStatusMessage('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setStatusMessage('Passwords do not match');
      return;
    }
    if (!agreeTerms) {
      setStatusMessage('Please agree to the Terms & Privacy Policy');
      return;
    }

    setIsSigningUp(true);

    try {
      // 1. Create new user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Create Firestore profile for the user
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        fullName,
        email,
        role: 'user', // default role
        createdAt: serverTimestamp(),
      });

      setStatusMessage('Sign-up successful 🎉');
      navigate('/'); // redirect immediately
    } catch (error) {
      console.error('Error signing up:', error);
      let errorMessage = 'An error occurred during sign-up.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email address is already in use.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'The password is too weak. Please use at least 6 characters.';
      }
      setStatusMessage(errorMessage);
    } finally {
      setIsSigningUp(false);
      setTimeout(() => setStatusMessage(''), 3000);
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
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                    disabled={isSigningUp}
                  />
                  <span className={styles.togglePassword} onClick={togglePasswordVisibility}>
                    👁️
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
                  <span className={styles.toggleConfirmPassword} onClick={toggleConfirmPasswordVisibility}>
                    👁️
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
                disabled={isSigningUp}
              >
                {isSigningUp ? 'Creating Account...' : 'Create account'}
              </button>
              <div className={styles.divider}>
                <span>or</span>
              </div>
              <button className={styles.googleButton} disabled={isSigningUp}>
                Continue with Google
              </button>
              <p className={styles.signInLink}>
                Already have an account? <Link to={'/auth/signin'} className={styles.link}>Sign in</Link>
              </p>
              {statusMessage && (
                <div
                  className={`${styles.statusMessage} ${
                    statusMessage.includes('successful') ? styles.success : ''
                  }`}
                >
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

export default SignupPage;
