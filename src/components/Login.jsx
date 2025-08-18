import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import loginbannerimage from "../assets/images/loginbannerimage.png";
import logo from "../assets/images/logos.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }
    setError("");

    try {
      const response = await axios.post(
        "https://api.svkangrowhealth.com/api/teams/login",
        {
          email,
          password,
        }
      );

      if (response.data.success) {
        const { member } = response.data;
        localStorage.setItem("member", JSON.stringify(member));
        navigate("/dashboard");
      } else {
        setError(response.data.error || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.error ||
          "Login failed. Please check your credentials and try again."
      );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100%",
        backgroundImage: `url(${loginbannerimage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      ></div>

      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "32px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          zIndex: 2,
          textAlign: "center",
        }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{
            width: "100px",
            marginBottom: "20px",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />

        <h2
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#1f2937",
            marginBottom: "24px",
          }}
        >
          Login
        </h2>

        {error && (
          <p
            style={{
              color: "#dc2626",
              fontSize: "14px",
              marginBottom: "16px",
            }}
          >
            {error}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <div>
            <label
              htmlFor="email"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "8px",
                textAlign: "left",
              }}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#BCE2B9")}
              onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "8px",
                textAlign: "left",
              }}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#BCE2B9")}
              onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "8px 16px",
              backgroundColor: "#BCE2B9",
              color: "#1f2937",
              fontWeight: "600",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#a3d9a0")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#BCE2B9")}
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
