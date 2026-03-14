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
      const res  = await fetch(getApiUrl("/api/auth/forgot-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Password reset email sent! Check your inbox.");
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (err: any) {
      setError("Network error: " + err.message);
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