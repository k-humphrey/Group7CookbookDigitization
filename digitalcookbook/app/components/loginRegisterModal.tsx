"use client";

import React, { useState, useRef, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginRegisterModal() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // still mock
  const [username, setUsername] = useState("");

  const router = useRouter();
  const modalRef = useRef<HTMLDialogElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const toggleModal = () => {
    modalRef.current?.showModal();
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });

    setIsLoggedIn(false);
    setUsername("");

  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const endpoint = isLogin ? "/api/login" : "/api/users";

      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Something went wrong");
        return;
      }

      if (isLogin) {
        setIsLoggedIn(true);
        setUsername(formData.email.split("@")[0]);

        modalRef.current?.close();
        resetForm();

        router.refresh(); 
      } else {
        alert("Account created! You can now log in.");
        setIsLogin(true);
        resetForm();
      }
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  return (
    <>
      {/* Navbar Trigger */}
      {isLoggedIn ? (
        <div className="flex items-center gap-2">
          <span className="font-semibold">{username}</span>
          <button className="btn btn-outline btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <button className="btn btn-ghost" onClick={toggleModal}>
          Login / Register
        </button>
      )}

      {/* Modal */}
      <dialog ref={modalRef} className="modal">
        <div className="modal-box max-w-md p-0 overflow-hidden">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-center">
                <h2 className="card-title text-2xl font-bold">
                  {isLogin ? "Welcome Back" : "Create Account"}
                </h2>
                <form method="dialog">
                  <button className="btn btn-sm btn-circle btn-ghost">
                    ✕
                  </button>
                </form>
              </div>

              <p className="text-sm opacity-70 mb-4">
                {isLogin
                  ? "Enter your credentials to access your account."
                  : "Fill in the details below to get started."}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="email@example.com"
                    className="input input-bordered"
                    required
                    onChange={handleInputChange}
                  />
                </div>

                {/* Password */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    placeholder="••••••••"
                    className="input input-bordered"
                    required
                    onChange={handleInputChange}
                  />
                </div>

                {/* Confirm Password */}
                {!isLogin && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">
                        Confirm Password
                      </span>
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
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
                  onClick={() => setIsLogin((prev) => !prev)}
                >
                  {isLogin
                    ? "Don't have an account? Register here"
                    : "Already have an account? Login here"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}