import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const Register = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = register, 2 = phone verification

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState(""); // for updating phone later

  // Step 1: Register
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!agreed) return alert("You must agree to the terms.");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setUserId(data.userId); // assuming backend sends userId
        setStep(2); // move to phone step
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  // Step 2: Send OTP
  const handleSendOTP = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("OTP sent to phone");
      } else {
        alert(data.message || "Failed to send OTP");
      }
    } catch (err) {
      alert("Error sending OTP");
    }
  };

  // Step 2: Verify OTP and update phone
  const handleVerifyOTP = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, phone, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Phone verified and registered");
        navigate("/dashboard");
      } else {
        alert(data.message || "OTP verification failed");
      }
    } catch (err) {
      alert("Error verifying OTP");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 font-sans">
      {/* LEFT SIDE */}
      <div className="flex justify-center items-center p-6 bg-white">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {step === 1 ? "Signup" : "Verify Phone"}
          </h2>

          {step === 1 ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded"
              />
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1"
                />
                <label>
                  I agree to the{" "}
                  <span className="text-blue-600 underline">terms</span>
                </label>
              </div>
              <button
                type="submit"
                disabled={!agreed}
                className={`w-full py-3 rounded text-white ${
                  agreed
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-300 cursor-not-allowed"
                } transition duration-300`}
              >
                Create account
              </button>
            </form>
          ) : (
            <>
           <div className="flex items-center space-x-2">
  <input
    type="tel"
    placeholder="Phone Number"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    className="flex-grow px-4 py-3 border border-gray-300 rounded"
  />
  <button
    onClick={handleSendOTP}
    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
  >
    Send
  </button>
  </div>
<div className="space-x-2 flex items-center  pt-5">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded"
              />
              <button
                onClick={handleVerifyOTP}
                className="px-3 py-3 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Verify
              </button>
            </div></>
          )}

          {step === 1 && (
            <>
              <div className="flex items-center my-4">
                <hr className="flex-grow border-gray-300" />
                <span className="mx-2 text-sm text-gray-500">or</span>
                <hr className="flex-grow border-gray-300" />
              </div>

              

              <p className="mt-4 text-sm text-gray-600 text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-red-500 hover:underline">
                  Login
                </Link>
              </p>
            </>
          )}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="relative bg-[#0F172A] flex items-center justify-center overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-orange-500 rounded-full opacity-70"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-blue-500 rounded-full opacity-60"></div>
        <div className="z-10 text-white text-center px-6">
          <h1 className="text-5xl font-bold mb-4">Join Us</h1>
          <p className="text-lg max-w-md">
            Unlock premium access to exclusive classes, personalized training
            plans, and more.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
