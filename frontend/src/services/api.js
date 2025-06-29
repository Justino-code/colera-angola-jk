import toast from "react-hot-toast";

const API_URL =
    import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
    "http://0.0.0.0:8000/api";

// 🧠 Flags para evitar múltiplos toasts/redirecionamentos
let sessionExpiredShown = false;
let unauthorizedShown = false;
let serverErrorShown = false;

async function request(endpoint, options = {}) {
    const token = localStorage.getItem("access_token");

    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const cleanEndpoint = endpoint.replace(/^\//, "");

    try {
        const response = await fetch(`${API_URL}/${cleanEndpoint}`, {
            ...options,
            headers,
        });

        const text = await response.text();

        // Converte o corpo para JSON (se for possível)
        let data;
        try {
            data = JSON.parse(text);
        } catch {
            data = text;
        }

        if (!response.ok) {
            // Tratamento por tipo de status
            if (response.status === 401 && !sessionExpiredShown) {
                sessionExpiredShown = true;
                localStorage.removeItem("access_token");
                toast.error(
                    "Sua sessão expirou. Por favor, faça login novamente."
                );
                setTimeout(() => {
                    window.location.href = "/login";
                }, 2000);
            }

            if (response.status === 403 && !unauthorizedShown) {
                unauthorizedShown = true;
                toast.error("Acesso não autorizado.");
                setTimeout(() => {
                    window.location.href = "/forbidden";
                }, 1500);
            }

            if (response.status === 404) {
                toast.error("Recurso não encontrado.");
            }

            if (response.status === 500 && !serverErrorShown) {
                serverErrorShown = true;
                toast.error("Erro interno do servidor.");
                const errorDetails = data?.error || "Erro desconhecido.";
                console.error("Erro interno do servidor:", data);
            }

            // Lança erro com a mensagem retornada ou status
            const errorMessage =
                data?.error || response.statusText || "Erro desconhecido.";
            throw new Error(errorMessage);
        }

        return data;
    } catch (error) {
        console.error("Erro:", error.message);
        throw error; // Repassa o erro para o componente que chamou
    }
}

export default {
    get: (endpoint) => request(endpoint),
    post: (endpoint, data) =>
        request(endpoint, { method: "POST", body: JSON.stringify(data) }),
    put: (endpoint, data) =>
        request(endpoint, { method: "PUT", body: JSON.stringify(data) }),
    delete: (endpoint) => request(endpoint, { method: "DELETE" }),
};
