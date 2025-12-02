import { signIn } from "next-auth/react";
import { useState } from "react";
import {
  Button,
  CircularProgress,
  TextField,
  Card,
  CardContent,
  Box,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import Image from "next/image";

import LogoContigo from "../components/LogoContigo";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await signIn("credentials", {
      email: correo,
      password: clave,
      redirect: true,
      callbackUrl: "/familiares",
    });
    setLoading(false);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to right, #3e93b2, #3b90b2, #115675)",
        padding: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 450,
          width: "100%",
          borderRadius: 4,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          overflow: "visible",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: 180,
                height: 80,
                mb: 2,
              }}
            >
              <LogoContigo style={{ width: "100%", height: "100%" }} />
            </Box>
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 700,
                color: "#115675",
                textAlign: "center",
              }}
            >
              Bienvenido
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", textAlign: "center", mt: 1 }}
            >
              Ingresa tus credenciales para continuar
            </Typography>
          </Box>

          <form onSubmit={handleLogin}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                fullWidth
                label="Correo Electrónico"
                variant="outlined"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "#3e93b2" }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2 },
                }}
              />

              <TextField
                fullWidth
                label="Contraseña"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "#3e93b2" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2 },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 2,
                  py: 1.5,
                  borderRadius: 2,
                  background:
                    "linear-gradient(to right, #3e93b2, #3b90b2, #115675)",
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(62, 147, 178, 0.4)",
                  "&:hover": {
                    background:
                      "linear-gradient(to right, #337a94, #2f7490, #0e4660)",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Ingresar"
                )}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

(Login as any).getLayout = (page: React.ReactNode) => page;
