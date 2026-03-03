import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import logoVector from "@/assets/logo-vector.jpg";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsRecovery(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
    } else {
      setSuccess("Contraseña actualizada exitosamente.");
      setTimeout(() => navigate("/login", { replace: true }), 2000);
    }
    setLoading(false);
  };

  if (!isRecovery) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vector-silver p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-8 pb-6 px-8 text-center">
            <p className="text-muted-foreground">Link de recuperación inválido o expirado.</p>
            <Button onClick={() => navigate("/login")} className="mt-4">Volver al login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-vector-silver p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardContent className="pt-10 pb-8 px-8">
          <div className="flex justify-center mb-8">
            <img src={logoVector} alt="VECTOR" className="h-14 object-contain" />
          </div>
          <h1 className="text-xl font-heading font-bold text-center mb-6">Nueva Contraseña</h1>
          {error && <div className="flex items-center gap-2 bg-destructive/10 text-destructive rounded-md p-3 mb-4 text-sm"><AlertCircle className="h-4 w-4" />{error}</div>}
          {success && <div className="bg-primary/10 text-primary rounded-md p-3 mb-4 text-sm">{success}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label className="font-heading text-sm">Nueva contraseña</Label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" required minLength={6} className="h-11 pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full h-11 bg-secondary hover:bg-secondary/90 font-heading">
              {loading ? "Actualizando..." : "Actualizar contraseña"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
