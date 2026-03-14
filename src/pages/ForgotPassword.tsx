import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getApiUrl } from "@/config/api";

const ForgotPassword = () => {

  const [email, setEmail]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState("");
  const [error, setError]       = useState("");

  const handleSubmit = async (e: any) => {

    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      console.log("📧 Submitting forgot password for:", email);
      console.log("🌐 API URL:", getApiUrl("/api/auth/forgot-password"));
      console.log("⏱️  Starting request with 120 second timeout...");
      
      // Create abort controller for timeout (120 seconds for production cold starts)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 second timeout

      const res  = await fetch(getApiUrl("/api/auth/forgot-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await res.json();
      console.log("📨 Response received:", res.status, data);

      if (res.ok) {
        setSuccess("✅ Password reset email sent! Check your inbox and spam folder.");
        setEmail(""); // Clear email field
      } else {
        setError(data.message || "❌ Something went wrong. Please try again.");
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        setError("⏱️ Request timeout after 120 seconds. Server is taking too long. Please wait a moment and try again.");
      } else if (err.message.includes("Failed to fetch")) {
        setError("🌐 Cannot connect to server. Backend might be starting. Please wait 30 seconds and try again.");
      } else {
        setError("❌ Error: " + (err.message || "Unknown error"));
      }
      console.error("❌ Forgot password error:", err);
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >

        <Card className="shadow-2xl">

          <CardHeader className="text-center space-y-2">

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4"
            >
              <span className="text-primary-foreground font-bold text-2xl">J</span>
            </motion.div>

            <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>

            <CardDescription>
              Enter your email and we'll send you a reset link
            </CardDescription>

          </CardHeader>

          <CardContent className="space-y-6">

            {error && (
              <p className="text-red-500 text-center text-sm">{error}</p>
            )}

            {success && (
              <p className="text-green-600 text-center text-sm font-medium">{success}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>

            </form>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Remember your password?</span>{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>

          </CardContent>

        </Card>

      </motion.div>

    </div>
  );

};

export default ForgotPassword;