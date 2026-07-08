import { ArrowLeft, KeyRound, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authApi } from "../../api/movieverse";
import OtpInput from "../../components/OtpInput";
import { Button, Input } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";
import AuthShell from "./AuthShell";

type Method = "email" | "phone" | "password";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [method, setMethod] = useState<Method>("email");
  const [step, setStep] = useState<"enter" | "otp">("enter");
  const [value, setValue] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  async function passwordLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.login(value.trim(), password);
      await login(res.data.access_token, res.data.refresh_token);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (method === "email") await authApi.sendEmailOtp(value.trim());
      else await authApi.sendPhoneOtp(value.trim());
      toast.success("OTP sent (dev code: 123456)");
      setStep("otp");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Could not send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res =
        method === "email"
          ? await authApi.verifyEmailOtp(value.trim(), otp)
          : await authApi.verifyPhoneOtp(value.trim(), otp);
      await login(res.data.access_token, res.data.refresh_token);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Sign in" subtitle="Login with a password or a one-time code.">
      {step === "enter" ? (
        <>
          <div className="mb-5 grid grid-cols-3 gap-2 rounded-lg bg-surface p-1">
            {(["password", "email", "phone"] as Method[]).map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium capitalize transition-colors ${
                  method === m ? "gradient-primary text-white" : "text-text-secondary"
                }`}
              >
                {m === "email" ? <Mail size={15} /> : m === "phone" ? <Phone size={15} /> : <KeyRound size={15} />}
                {m}
              </button>
            ))}
          </div>
          {method === "password" ? (
            <form onSubmit={passwordLogin} className="space-y-4">
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" loading={loading} className="w-full" disabled={!value || !password}>
                Sign in
              </Button>
            </form>
          ) : (
            <form onSubmit={sendOtp} className="space-y-4">
              <Input
                label={method === "email" ? "Email address" : "Phone number"}
                type={method === "email" ? "email" : "tel"}
                placeholder={method === "email" ? "you@example.com" : "+1 555 123 4567"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
              />
              <Button type="submit" loading={loading} className="w-full">
                Send OTP
              </Button>
            </form>
          )}
        </>
      ) : (
        <form onSubmit={verify} className="space-y-5">
          <button
            type="button"
            onClick={() => setStep("enter")}
            className="flex items-center gap-1 text-sm text-muted hover:text-text"
          >
            <ArrowLeft size={16} /> Change {method}
          </button>
          <p className="text-sm text-text-secondary">
            Enter the 6-digit code sent to <span className="font-semibold">{value}</span>
          </p>
          <OtpInput value={otp} onChange={setOtp} />
          <Button type="submit" loading={loading} className="w-full" disabled={otp.length < 6}>
            Verify & Sign in
          </Button>
          <button type="button" onClick={sendOtp as any} className="text-sm text-primary hover:underline">
            Resend code
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-muted">
        New to MovieVerse?{" "}
        <Link to="/register" className="font-semibold text-primary hover:underline">
          Create an account
        </Link>
      </p>
      <p className="mt-2 text-center text-sm">
        <Link to="/forgot-password" className="text-muted hover:text-text">
          Forgot password?
        </Link>
      </p>
    </AuthShell>
  );
}
