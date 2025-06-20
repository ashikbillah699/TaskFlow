import React, { useContext, useState } from 'react';
import loginBg from '../../assets/loginBg.jpg'
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../provider/AuthProvider';
import Swal from 'sweetalert2';
import { browserLocalPersistence, browserSessionPersistence, getAuth, setPersistence } from 'firebase/auth';

const Login = () => {
    const { createLogin } = useContext(AuthContext);
    const navigate = useNavigate();
    const auth = getAuth();
    const [remember, setRemember] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const email = event.target.email.value;
        const password = event.target.password.value;

        const persistenceType = remember ? browserLocalPersistence : browserSessionPersistence;

        try {
            await setPersistence(auth, persistenceType);
            const res = await createLogin(email, password);

            if (res.user) {
                if (!remember) {
                    const expireTime = new Date().getTime() + 30 * 60 * 1000;
                    sessionStorage.setItem('expireAt', expireTime);
                }

                const token = await res.user.getIdToken();
                localStorage.setItem('token', token);

                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Welcome back to TaskFlow.",
                    showConfirmButton: false,
                    timer: 1400
                });
                event.target.reset();
                navigate('/mainLayout/createTask');
            }
        } 
        
        catch (err) {
            Swal.fire({
                icon: "error",
                title: "Login failed",
                text: err.message
            });
        }

        

    };

    return (
        <div className="flex flex-col gap-4 justify-center items-center min-h-screen p-4"
            style={{ backgroundImage: `url(${loginBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <h1 className='text-[#2e4f96] px-4 sm:px-0 text-2xl md:text-3xl font-bold mb-6 text-center'>Access your  <span className='text-[#122b5f]'>Task Flow</span> workspace – Login or Sign up.</h1>
            <div className="flex shadow-2xl rounded-lg w-full max-w-4xl overflow-hidden"
                style={{ backgroundImage: `url(${loginBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>

                {/* Left Side - Image */}
                <div className="hidden md:flex md:w-1/2 justify-center items-center" >
                    <img className="object-contain max-h-80" />
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-1/2 p-8">
                    <h2 className="text-2xl font-bold text-center mb-8">Login</h2>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Email
                            </label>
                            <input
                                name="email"
                                type="email"
                                placeholder="Type here"
                                className="input input-bordered w-full"
                                required
                                style={{ fontFamily: "Open Sans, sans-serif" }}

                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Password
                            </label>
                            <input
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                className="input input-bordered w-full"
                                required
                                style={{ fontFamily: "Open Sans, sans-serif" }}
                            />
                        </div>
                        <div>
                            <input
                                type="checkbox"
                                checked={remember}
                                className="checkbox"
                                onChange={(e) => setRemember(e.target.checked)} />
                            <label className="text-sm font-medium text-gray-600 mb-1">
                                Remember me
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button className="btn bg-blue-600 text-white w-full hover:bg-blue-700">
                                Sign In
                            </button>
                        </div>
                    </form>

                    {/* New Account */}
                    <p className="text-center text-sm mt-4">
                        New here?{" "}
                        <Link
                            to="/signUp"
                            className="text-blue-500 font-medium hover:underline"
                        >
                            Create a New Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;