import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authApi } from "../../api/movieverse";
import OtpInput from "../../components/OtpInput";
import { Button, Input } from "../../components/ui";
import AuthShell from "./AuthShell";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword(email.trim());
      toast.success("Reset code sent (dev: 123456)");
      setStep("reset");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Could not send code");
    } finally {
      setLoading(false);
    }
  }

  async function reset(e: React.FormEvent) {
    e.preventDefault();
    if (pw !== confirm) return toast.error("Passwords do not match");
    setLoading(true);
    try {
      await authApi.resetPassword(email.trim(), otp, pw, confirm);
      toast.success("Password updated! Please sign in.");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Reset failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Reset password"
      subtitle={step === "email" ? "We'll email you a reset code." : "Enter the code and your new password."}
    >
      {step === "email" ? (
        <form onSubmit={sendOtp} className="space-y-4">
          <Input label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Button type="submit" loading={loading} className="w-full">Send reset code</Button>
        </form>
      ) : (
        <form onSubmit={reset} className="space-y-4">
          <div>
            <span className="mb-2 block text-sm font-medium text-text-secondary">Verification code</span>
            <OtpInput value={otp} onChange={setOtp} />
          </div>
          <Input label="New password" type="password" value={pw} onChange={(e) => setPw(e.target.value)} required />
          <Input label="Confirm password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          <Button type="submit" loading={loading} className="w-full" disabled={otp.length < 6}>
            Update password
          </Button>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-muted">
        <Link to="/login" className="font-semibold text-primary hover:underline">Back to sign in</Link>
      </p>
    </AuthShell>
  );
}
