import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "../../styles/auth.css";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // ✅ READ REDIRECT FROM QUERY PARAM
    const redirect = searchParams.get("redirect") || "/";

    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await login(form);

            // ✅ GO BACK TO ORIGINAL PAGE
            navigate(redirect, { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-card" onSubmit={handleSubmit}>
                <h2>Login</h2>

                {error && <p className="error-text">{error}</p>}

                <div className="auth-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="auth-group">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button className="auth-btn">Login</button>

                <div className="auth-footer">
                    Don’t have an account? <a href="/register">Register</a>
                </div>
            </form>
        </div>
    );
};

export default Login;

