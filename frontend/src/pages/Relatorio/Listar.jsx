import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";

// Simule ou recupere do contexto/autenticação real
const user = JSON.parse(localStorage.getItem("usuario"));
const isAdminOrGestor = user?.role === "admin" || user?.role === "gestor";

function EditarRelatorioModal({ open, onClose, relatorio, onSalvar, loading }) {
  const nomePadrao = relatorio?.nome
    || (relatorio?.tipo ? `${relatorio.tipo}_${relatorio?.id_relatorio}` : "");

  const [nome, setNome] = useState(nomePadrao);
  const [tipo, setTipo] = useState(relatorio?.tipo || "");
  const [dados, setDados] = useState(relatorio?.dados || {});

  useEffect(() => {
    if (relatorio) {
      setNome(
        relatorio.nome ||
        (relatorio.tipo ? `${relatorio.tipo}_${relatorio.id_relatorio}` : "")
      );
      setTipo(relatorio.tipo || "");
      setDados(relatorio.dados || {});
    }
  }, [relatorio]);

  const handleNomeChange = (e) => {
    let valor = e.target.value.replace(/\s+/g, "_");
    setNome(valor);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-lg relative">
        <button
          className="absolute top-2 right-2 text-slate-500 hover:text-slate-700"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Editar Relatório</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSalvar({ nome, tipo, dados });
          }}
          className="space-y-3"
        >
          <div>
            <label className="block mb-1">Nome do Relatório</label>
            <input
              className="w-full border rounded p-2"
              value={nome}
              onChange={handleNomeChange}
              placeholder="Nome do relatório"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Tipo</label>
            <input
              className="w-full border rounded p-2"
              value={tipo}
              onChange={e => setTipo(e.target.value)}
              disabled
            />
          </div>
          <div>
            <label className="block mb-1">Dados (visualização)</label>
            {dados && typeof dados === "object" && !Array.isArray(dados) && Object.keys(dados).length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Categoria</th>
                    <th>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(dados).map(([k, v]) => (
                    <tr key={k}>
                      <td>{k}</td>
                      <td>{typeof v === "object" ? JSON.stringify(v) : v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <span>Sem dados</span>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-300 text-slate-700 px-4 py-2 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={
                loading ||
                !dados ||
                typeof dados !== "object" ||
                Array.isArray(dados) ||
                Object.keys(dados).length === 0
              }
              className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
              )}
              Gerar PDF
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function RelatorioListar() {
  const [relatorios, setRelatorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gerando, setGerando] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [relatorioSelecionado, setRelatorioSelecionado] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    carregarRelatorios();
  }, []);

  const carregarRelatorios = async () => {
    setLoading(true);
    try {
      const res = await api.get("/relatorio");
      if (res.success) {
        // Converte dados de string para objeto, se necessário
        const relatoriosTratados = res.data.map(r => ({
          ...r,
          dados: typeof r.dados === "string" ? JSON.parse(r.dados) : r.dados
        }));
        setRelatorios(relatoriosTratados);
        console.log("Tratados: ",relatoriosTratados);
        console.log("Recebidos: ",res);
        
        
      } else {
        toast.error(res?.error || "Erro ao carregar relatórios");
      }
    } catch (err) {
      toast.error("Erro ao carregar relatórios");
    }
    setLoading(false);
  };

  const handleExcluir = async (id) => {
    if (!window.confirm("Deseja realmente excluir este relatório?")) return;
    try {
      const res = await api.delete(`/relatorio/${id}`);
      if (res.success) {
        toast.success("Relatório removido!");
        await carregarRelatorios();
      } else {
        toast.error(res.error || "Erro ao remover relatório");
      }
    } catch (err) {
      toast.error("Erro ao remover relatório");
    }
  };

  // Abre modal para editar antes de gerar PDF
  const handleAbrirModalPDF = (relatorio) => {
    setRelatorioSelecionado(relatorio);
    setModalOpen(true);
  };

  // Salva alterações e gera PDF
  const handleSalvarEGerarPDF = async (dadosEditados) => {
    setGerando(relatorioSelecionado.id_relatorio);
    try {
      // Gera o PDF
      const res = await api.post(`/relatorio/${relatorioSelecionado.id_relatorio}/gerar-pdf`);
      if (res.success) {
        const blob = new Blob(
          [Uint8Array.from(atob(res.file), (c) => c.charCodeAt(0))],
          { type: "application/pdf" }
        );
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `relatorio-${relatorioSelecionado.id_relatorio}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("PDF gerado com sucesso!");
        setModalOpen(false);
        await carregarRelatorios();
      } else {
        toast.error(res.error || "Erro ao gerar PDF");
        console.error("Erro ao gerar PDF:", res.error);
      }
    } catch (err) {
      toast.error("Erro ao gerar PDF");
      console.log("Erro ao gerar PDF:", err);
    } finally {
      setGerando(null);
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Relatórios</h1>
        <Link
          to="/relatorio/gerar"
          className="bg-cyan-600 text-white px-4 py-2 rounded"
        >
          Novo Relatório
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col gap-2 items-center py-10">
          <svg className="animate-spin h-8 w-8 text-cyan-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span className="text-slate-500 text-lg">Carregando relatórios...</span>
        </div>
      ) : relatorios.length === 0 ? (
        <div className="text-center text-slate-500">Nenhum relatório encontrado.</div>
      ) : (
        <table className="w-full border mt-2">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-2">ID</th>
              <th className="p-2">Tipo</th>
              <th className="p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {relatorios.map((relatorio) => (
              <tr key={relatorio.id_relatorio}>
                <td className="p-2">{relatorio.id_relatorio}</td>
                <td className="p-2">{relatorio.tipo}</td>
                <td className="p-2 flex gap-2 flex-wrap">
                  {isAdminOrGestor && (
                    <>
                      <Link
                        to={`/relatorio/detalhes/${relatorio.id_relatorio}`}
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Ver
                      </Link>
                      <button
                        onClick={() => handleAbrirModalPDF(relatorio)}
                        disabled={gerando === relatorio.id_relatorio}
                        className="bg-green-600 text-white px-2 py-1 rounded"
                      >
                        {gerando === relatorio.id_relatorio ? "Gerando..." : "PDF"}
                      </button>
                      <button
                        onClick={() => handleExcluir(relatorio.id_relatorio)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Excluir
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal para editar relatório */}
      <EditarRelatorioModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        relatorio={relatorioSelecionado}
        onSalvar={handleSalvarEGerarPDF}
        loading={gerando !== null && gerando !== relatorioSelecionado?.id_relatorio}
      />
    </div>
  );
}
