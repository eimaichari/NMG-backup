import React, { useState } from 'react';
import styles from './SignUpPage.module.css';

const SignUpPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleSignUp = () => {
    if (!fullName || !email || !password || !confirmPassword) {
      setStatusMessage('Please fill in all fields');
      setTimeout(() => setStatusMessage(''), 3000);
    } else if (password !== confirmPassword) {
      setStatusMessage('Passwords do not match');
      setTimeout(() => setStatusMessage(''), 3000);
    } else if (!agreeTerms) {
      setStatusMessage('Please agree to the Terms & Privacy Policy');
      setTimeout(() => setStatusMessage(''), 3000);
    } else {
      setStatusMessage('Sign-up successful');
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  const handleGoogleSignUp = () => {
    setStatusMessage('Google sign-up initiated (mock)');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

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
                  />
                  <span
                    className={styles.togglePassword}
                    onClick={toggleConfirmPasswordVisibility}
                  >
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
                  />
                  I agree to the Terms & Privacy Policy
                </label>
              </div>
              <button className={styles.submitButton} onClick={handleSignUp}>
                Create account
              </button>
              <div className={styles.divider}>
                <span>or</span>
              </div>
              <button
                className={styles.googleButton}
                onClick={handleGoogleSignUp}
              >
                Continue with Google
              </button>
              <p className={styles.signInLink}>
                Already have an account? <a href="#" className={styles.link}>Sign in</a>
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

export default SignUpPage;