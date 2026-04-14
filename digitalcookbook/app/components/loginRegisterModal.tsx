"use client";
import React, { useState, useRef } from "react";

export default function AuthModal() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock state for demo
  const [username, setUsername] = useState("JaneDoe"); // Mock username
  
  // Form State
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const modalRef = useRef<HTMLDialogElement>(null);

  const toggleModal = () => {  
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  const handleInputChange = (e : any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e : any) => {
    e.preventDefault();
    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Add your API logic here
    console.log("Submitting:", formData);
  };

  return (
    <>
      {/* Navbar Trigger */}
      <button className="btn btn-ghost" onClick={toggleModal}>
        {isLoggedIn ? `Hello, ${username}` : "Login / Register"}
      </button>

      {/* DaisyUI Modal */}
      <dialog ref={modalRef} className="modal">
        <div className="modal-box max-w-md p-0 overflow-hidden">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-center">
                <h2 className="card-title text-2xl font-bold">
                  {isLogin ? "Welcome Back" : "Create Account"}
                </h2>
                <form method="dialog">
                  <button className="btn btn-sm btn-circle btn-ghost">✕</button>
                </form>
              </div>

              <p className="text-sm opacity-70 mb-4">
                {isLogin 
                  ? "Enter your credentials to access your account." 
                  : "Fill in the details below to get started."}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field (Login Only) or Username (Register) */}
                {isLogin ? (
                  <div className="form-control">
                    <label className="label"><span className="label-text">Email</span></label>
                    <input 
                      type="email" 
                      name="email"
                      placeholder="email@example.com" 
                      className="input input-bordered" 
                      required 
                      onChange={handleInputChange}
                    />
                  </div>
                ) : (
                  <div className="form-control">
                    <label className="label"><span className="label-text">Username</span></label>
                    <input 
                      type="text" 
                      name="username"
                      placeholder="username" 
                      className="input input-bordered" 
                      required 
                      onChange={handleInputChange}
                    />
                  </div>
                )}

                <div className="form-control">
                  <label className="label"><span className="label-text">Password</span></label>
                  <input 
                    type="password" 
                    name="password"
                    placeholder="••••••••" 
                    className="input input-bordered" 
                    required 
                    onChange={handleInputChange}
                  />
                </div>

                {/* Confirm Password (Register Only) */}
                {!isLogin && (
                  <div className="form-control">
                    <label className="label"><span className="label-text">Confirm Password</span></label>
                    <input 
                      type="password" 
                      name="confirmPassword"
                      placeholder="••••••••" 
                      className="input input-bordered" 
                      required 
                      onChange={handleInputChange}
                    />
                  </div>
                )}

                <div className="form-control mt-6">
                  <button type="submit" className="btn btn-primary">
                    {isLogin ? "Login" : "Register"}
                  </button>
                </div>
              </form>

              <div className="divider">OR</div>

              <div className="text-center">
                <button 
                  className="link link-hover text-sm" 
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin 
                    ? "Don't have an account? Register here" 
                    : "Already have an account? Login here"}
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Backdrop to close when clicking outside */}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}