import React from 'react'
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import toast from 'react-hot-toast';

const Login = () => {

    const {setShowLogin, axios, setToken, navigateAfterLogin} = useAppContext()

    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [otp, setOtp] = React.useState("");
    const [verificationToken, setVerificationToken] = React.useState("");
    const [showOtpInput, setShowOtpInput] = React.useState(false);
    const [otpSent, setOtpSent] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [canResend, setCanResend] = React.useState(false);
    const [resendTimer, setResendTimer] = React.useState(0);
    const [showPassword, setShowPassword] = React.useState(false);
    const [showForgotPassword, setShowForgotPassword] = React.useState(false);
    const [forgotEmail, setForgotEmail] = React.useState('');
    const [forgotOtp, setForgotOtp] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [forgotStep, setForgotStep] = React.useState(1); // 1: email, 2: otp, 3: new password
    const [forgotVerificationToken, setForgotVerificationToken] = React.useState('');
    const [forgotLoading, setForgotLoading] = React.useState(false);

    // Timer effect for resend functionality
    React.useEffect(() => {
        let interval;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer(prev => {
                    if (prev <= 1) {
                        setCanResend(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    // Send OTP for email verification
    const handleSendOTP = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error('Please enter your email');
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.post('/api/otp/send-otp', { email });

            if (data.success) {
                toast.success(data.message);
                setShowOtpInput(true);
                setOtpSent(true);
                setCanResend(false);
                setResendTimer(30); // 30 seconds before resend
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Failed to send OTP. Please try again.');
        }
        setLoading(false);
    };

    // Verify OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        if (!otp || otp.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.post('/api/otp/verify-otp', { email, otp });

            if (data.success) {
                toast.success(data.message);
                setVerificationToken(data.verificationToken);
                setShowOtpInput(false);
                // Now show the name/password form for final registration
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('OTP verification failed. Please try again.');
        }
        setLoading(false);
    };

    // Resend OTP
    const handleResendOTP = async () => {
        setLoading(true);
        try {
            const { data } = await axios.post('/api/otp/resend-otp', { email });

            if (data.success) {
                toast.success(data.message);
                setCanResend(false);
                setResendTimer(30);
                setOtp(''); // Clear current OTP
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Failed to resend OTP. Please try again.');
        }
        setLoading(false);
    };

    // Final registration after OTP verification
    const handleFinalRegistration = async (e) => {
        e.preventDefault();
        if (!name || !password || password.length < 8) {
            toast.error('Please fill all fields. Password must be at least 8 characters.');
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.post('/api/user/register', {
                name,
                email,
                password,
                verificationToken
            });

            if (data.success) {
                setToken(data.token);
                localStorage.setItem('token', data.token);
                setShowLogin(false);
                resetForm();
                toast.success(data.message || 'Registration successful!');
                navigateAfterLogin();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Registration failed. Please try again.');
        }
        setLoading(false);
    };

    // Login handler
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post('/api/user/login', { email, password });

            if (data.success) {
                setToken(data.token);
                localStorage.setItem('token', data.token);
                setShowLogin(false);
                resetForm();
                toast.success(data.message || 'Login successful!');
                navigateAfterLogin();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials and try again.';
            toast.error(errorMessage);
        }
        setLoading(false);
    };

    // Reset form
    const resetForm = () => {
        setName('');
        setEmail('');
        setPassword('');
        setOtp('');
        setVerificationToken('');
        setShowOtpInput(false);
        setOtpSent(false);
        setCanResend(false);
        setResendTimer(0);
        setShowPassword(false);
        setShowForgotPassword(false);
        setForgotEmail('');
        setForgotOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setForgotStep(1);
        setForgotVerificationToken('');
        setForgotLoading(false);
    };

    // Handle state change (login/register)
    const handleStateChange = (newState) => {
        setState(newState);
        resetForm();
    };

    // Forgot Password Handlers
    const handleForgotPasswordEmail = async (e) => {
        e.preventDefault();
        if (!forgotEmail) {
            toast.error('Please enter your email');
            return;
        }

        setForgotLoading(true);
        try {
            const { data } = await axios.post('/api/otp/send-otp', { email: forgotEmail });

            if (data.success) {
                toast.success('Reset code sent to your email');
                setForgotStep(2);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Failed to send reset code. Please try again.');
        }
        setForgotLoading(false);
    };

    const handleForgotPasswordOTP = async (e) => {
        e.preventDefault();
        if (!forgotOtp || forgotOtp.length !== 6) {
            toast.error('Please enter a valid 6-digit code');
            return;
        }

        setForgotLoading(true);
        try {
            const { data } = await axios.post('/api/otp/verify-otp', { email: forgotEmail, otp: forgotOtp });

            if (data.success) {
                toast.success('Code verified successfully');
                setForgotVerificationToken(data.verificationToken);
                setForgotStep(3);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Code verification failed. Please try again.');
        }
        setForgotLoading(false);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!newPassword || newPassword.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setForgotLoading(true);
        try {
            const { data } = await axios.post('/api/user/reset-password', {
                email: forgotEmail,
                newPassword,
                verificationToken: forgotVerificationToken
            });

            if (data.success) {
                toast.success('Password reset successfully');
                setShowForgotPassword(false);
                resetForm();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Failed to reset password. Please try again.');
        }
        setForgotLoading(false);
    };

  return (
    <div onClick={()=> setShowLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center text-sm text-gray-600 bg-black/50'>

      <div onClick={(e)=>e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[400px] rounded-lg shadow-xl border border-gray-200 bg-white">
            <p className="text-2xl font-medium m-auto">
                <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
            </p>

            {/* LOGIN FORM */}
            {state === "login" && (
                <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
                    <div className="w-full">
                        <p>Email</p>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            placeholder="Enter your email"
                            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                            type="email"
                            required
                        />
                    </div>
                    <div className="w-full">
                        <p>Password</p>
                        <div className="relative">
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                placeholder="Enter your password"
                                className="border border-gray-200 rounded w-full p-2 mt-1 pr-10 outline-primary"
                                type={showPassword ? "text" : "password"}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                <img
                                    src={showPassword ? assets.eye_close_icon : assets.eye_icon}
                                    alt="toggle password visibility"
                                    className="w-5 h-5"
                                />
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary hover:bg-blue-800 transition-all text-white w-full py-2 rounded-md cursor-pointer disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => setShowForgotPassword(true)}
                            className="text-primary hover:underline text-sm"
                        >
                            Forgot Password?
                        </button>
                    </div>
                </form>
            )}

            {/* REGISTRATION PROCESS */}
            {state === "register" && (
                <>
                    {/* Step 1: Email Verification */}
                    {!otpSent && !verificationToken && (
                        <form onSubmit={handleSendOTP} className="w-full flex flex-col gap-4">
                            <div className="w-full">
                                <p>Email Address</p>
                                <input
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    placeholder="Enter your email"
                                    className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                                    type="email"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-primary hover:bg-blue-800 transition-all text-white w-full py-2 rounded-md cursor-pointer disabled:opacity-50"
                            >
                                {loading ? "Sending OTP..." : "Send Verification Code"}
                            </button>
                        </form>
                    )}

                    {/* Step 2: OTP Verification */}
                    {showOtpInput && (
                        <form onSubmit={handleVerifyOTP} className="w-full flex flex-col gap-4">
                            <div className="w-full">
                                <p>Verification Code</p>
                                <p className="text-xs text-gray-500 mb-2">
                                    Enter the 6-digit code sent to {email}
                                </p>
                                <input
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    value={otp}
                                    placeholder="000000"
                                    className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary text-center text-lg tracking-widest"
                                    type="text"
                                    maxLength="6"
                                    required
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={loading || otp.length !== 6}
                                    className="bg-primary hover:bg-blue-800 transition-all text-white flex-1 py-2 rounded-md cursor-pointer disabled:opacity-50"
                                >
                                    {loading ? "Verifying..." : "Verify Code"}
                                </button>
                                {canResend ? (
                                    <button
                                        type="button"
                                        onClick={handleResendOTP}
                                        disabled={loading}
                                        className="bg-gray-500 hover:bg-gray-600 transition-all text-white px-4 py-2 rounded-md cursor-pointer disabled:opacity-50"
                                    >
                                        Resend
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        disabled
                                        className="bg-gray-300 text-gray-500 px-4 py-2 rounded-md cursor-not-allowed"
                                    >
                                        {resendTimer}s
                                    </button>
                                )}
                            </div>
                        </form>
                    )}

                    {/* Step 3: Complete Registration */}
                    {verificationToken && !showOtpInput && (
                        <form onSubmit={handleFinalRegistration} className="w-full flex flex-col gap-4">
                            <div className="w-full bg-green-50 p-3 rounded border border-green-200">
                                <p className="text-green-600 text-sm">✓ Email verified successfully!</p>
                            </div>
                            <div className="w-full">
                                <p>Full Name</p>
                                <input
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                    placeholder="Enter your full name"
                                    className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                                    type="text"
                                    required
                                />
                            </div>
                            <div className="w-full">
                                <p>Password</p>
                                <div className="relative">
                                    <input
                                        onChange={(e) => setPassword(e.target.value)}
                                        value={password}
                                        placeholder="Choose a secure password (min 8 chars)"
                                        className="border border-gray-200 rounded w-full p-2 mt-1 pr-10 outline-primary"
                                        type={showPassword ? "text" : "password"}
                                        minLength="8"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        <img
                                            src={showPassword ? assets.eye_close_icon : assets.eye_icon}
                                            alt="toggle password visibility"
                                            className="w-5 h-5"
                                        />
                                    </button>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-primary hover:bg-blue-800 transition-all text-white w-full py-2 rounded-md cursor-pointer disabled:opacity-50"
                            >
                                {loading ? "Creating Account..." : "Create Account"}
                            </button>
                        </form>
                    )}
                </>
            )}

            {/* Toggle between login and register */}
            {state === "register" ? (
                <p className="text-center w-full">
                    Already have an account? <span onClick={() => handleStateChange("login")} className="text-primary cursor-pointer">Login here</span>
                </p>
            ) : (
                <p className="text-center w-full">
                    Don't have an account? <span onClick={() => handleStateChange("register")} className="text-primary cursor-pointer">Sign up here</span>
                </p>
            )}
        </div>

        {/* Forgot Password Modal */}
        {showForgotPassword && (
            <div className="fixed top-0 bottom-0 left-0 right-0 z-110 flex items-center text-sm text-gray-600 bg-black/50">
                <div className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[400px] rounded-lg shadow-xl border border-gray-200 bg-white">
                    <div className="w-full flex items-center justify-between">
                        <p className="text-2xl font-medium">
                            <span className="text-primary">Reset</span> Password
                        </p>
                        <button
                            onClick={() => {
                                setShowForgotPassword(false);
                                setForgotStep(1);
                                setForgotEmail('');
                                setForgotOtp('');
                                setNewPassword('');
                                setConfirmPassword('');
                            }}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Step 1: Enter Email */}
                    {forgotStep === 1 && (
                        <form onSubmit={handleForgotPasswordEmail} className="w-full flex flex-col gap-4">
                            <p className="text-gray-600 text-sm">Enter your email address to receive a password reset code.</p>
                            <div className="w-full">
                                <p>Email Address</p>
                                <input
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    value={forgotEmail}
                                    placeholder="Enter your email"
                                    className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                                    type="email"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={forgotLoading}
                                className="bg-primary hover:bg-blue-800 transition-all text-white w-full py-2 rounded-md cursor-pointer disabled:opacity-50"
                            >
                                {forgotLoading ? "Sending..." : "Send Reset Code"}
                            </button>
                        </form>
                    )}

                    {/* Step 2: Verify OTP */}
                    {forgotStep === 2 && (
                        <form onSubmit={handleForgotPasswordOTP} className="w-full flex flex-col gap-4">
                            <p className="text-gray-600 text-sm">Enter the 6-digit code sent to {forgotEmail}</p>
                            <div className="w-full">
                                <p>Verification Code</p>
                                <input
                                    onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    value={forgotOtp}
                                    placeholder="000000"
                                    className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary text-center text-lg tracking-widest"
                                    type="text"
                                    maxLength="6"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={forgotLoading || forgotOtp.length !== 6}
                                className="bg-primary hover:bg-blue-800 transition-all text-white w-full py-2 rounded-md cursor-pointer disabled:opacity-50"
                            >
                                {forgotLoading ? "Verifying..." : "Verify Code"}
                            </button>
                        </form>
                    )}

                    {/* Step 3: Set New Password */}
                    {forgotStep === 3 && (
                        <form onSubmit={handleResetPassword} className="w-full flex flex-col gap-4">
                            <p className="text-gray-600 text-sm">Choose a new secure password for your account.</p>
                            <div className="w-full">
                                <p>New Password</p>
                                <div className="relative">
                                    <input
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        value={newPassword}
                                        placeholder="Enter new password (min 8 chars)"
                                        className="border border-gray-200 rounded w-full p-2 mt-1 pr-10 outline-primary"
                                        type={showPassword ? "text" : "password"}
                                        minLength="8"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        <img
                                            src={showPassword ? assets.eye_close_icon : assets.eye_icon}
                                            alt="toggle password visibility"
                                            className="w-5 h-5"
                                        />
                                    </button>
                                </div>
                            </div>
                            <div className="w-full">
                                <p>Confirm Password</p>
                                <input
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    value={confirmPassword}
                                    placeholder="Confirm new password"
                                    className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                                    type={showPassword ? "text" : "password"}
                                    minLength="8"
                                    required
                                />
                            </div>
                            {newPassword && confirmPassword && newPassword !== confirmPassword && (
                                <p className="text-red-500 text-sm">Passwords do not match</p>
                            )}
                            <button
                                type="submit"
                                disabled={forgotLoading || newPassword !== confirmPassword || newPassword.length < 8}
                                className="bg-primary hover:bg-blue-800 transition-all text-white w-full py-2 rounded-md cursor-pointer disabled:opacity-50"
                            >
                                {forgotLoading ? "Resetting..." : "Reset Password"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        )}
    </div>
  )
}

export default Login
