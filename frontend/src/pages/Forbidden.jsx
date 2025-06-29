import { Link } from "react-router-dom";

export default function Forbidden() {
  return (
    <main
      role="alert"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "2rem",
        backgroundColor: "#f9fafb",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "4rem", color: "#e53e3e", margin: 0 }}>403</h1>
      <h2 style={{ fontSize: "1.75rem", margin: "0.5rem 0 1rem", color: "#2d3748" }}>
        Acesso Negado
      </h2>
      <p style={{ maxWidth: "400px", color: "#4a5568" }}>
        Você não tem permissão para acessar esta página ou recurso. Verifique suas credenciais ou entre em contato com um administrador.
      </p>
      <Link
        to="/"
        style={{
          marginTop: "2rem",
          color: "#3182ce",
          textDecoration: "none",
          fontWeight: 500,
        }}
        onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
        onMouseOut={(e) => (e.target.style.textDecoration = "none")}
      >
        ← Voltar para o início
      </Link>
    </main>
  );
}
