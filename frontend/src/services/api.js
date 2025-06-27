
import toast from "react-hot-toast";

const API_URL =
    import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
    "http://0.0.0.0:8000/api";

async function request(endpoint, options = {}) {
    const token = localStorage.getItem("access_token");

    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    // Remove / inicial duplicado no endpoint
    const cleanEndpoint = endpoint.replace(/^\//, "");

    console.log("➡ URL chamada:", `${API_URL}/${cleanEndpoint}`);
    console.log(
        "➡ Método:",
        options.method,
        "Headers:",
        headers,
        "Body:",
        options.body
    );

    try {
        const response = await fetch(`${API_URL}/${cleanEndpoint}`, {
            ...options,
            headers,
        });

        console.log(response);
        console.log(response.statusText);
        console.log(response);
        
        

        // Verifica se a resposta não é OK (ex: 401 Unauthorized)
        if (!response.ok) {
            if (response.status === 401) {
                // Limpar token expirado do localStorage
                localStorage.removeItem("access_token");

                toast.error(
                    "Sua sessão expirou. Por favor, faça login novamente."
                );

                setTimeout(() => {
                    // Redirecionar para a página de login
                    /*navigate("/login", {
                        replace: true,
                    });*/
                    window.location.href = "/login";
                }, 1000);

                // Exibe uma mensagem informando que a sessão expirou
                //alert("Sua sessão expirou. Por favor, faça login novamente.");
            }

            // Lança um erro genérico para outras falhas
            const r = await response.text();
            console.log('Resposta em txt:   '+r);
            
            const error = await response.json();
            throw new Error(`${error.error || response.statusText}`);
        }

        // Caso a resposta seja bem-sucedida, retorna o corpo da resposta
        return response.json();
    } catch (error) {
        console.error("Erro:", error.message);
        throw error; // Repassa o erro para quem chamou a função
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
