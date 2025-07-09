import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import Skeleton from "../../components/common/Skeleton";

// Simule ou recupere do contexto/autenticação real
const user = JSON.parse(localStorage.getItem("usuario"));
const isAdminOrGestor = user?.role === "admin" || user?.role === "gestor";

function EditarRelatorioModal({ open, onClose, relatorio, onSalvar, loading }) {
  const nomePadrao = relatorio?.nome || (relatorio?.tipo ? `${relatorio.tipo}_${relatorio?.id_relatorio}` : "");

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl relative mx-4">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Editar Relatório</h2>
        
        <form
          onSubmit={e => {
            e.preventDefault();
            onSalvar({ nome, tipo, dados });
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Relatório</label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={nome}
              onChange={handleNomeChange}
              placeholder="Nome do relatório"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              value={tipo}
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dados (visualização)</label>
            <div className="bg-gray-50 p-3 rounded-md border border-gray-200 max-h-60 overflow-y-auto">
              {dados && typeof dados === "object" && !Array.isArray(dados) && Object.keys(dados).length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(dados).map(([k, v]) => (
                      <tr key={k}>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{k}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                          {typeof v === "object" ? JSON.stringify(v) : v}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <span className="text-gray-500 italic">Sem dados disponíveis</span>
              )}
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
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
              className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    carregarRelatorios();
  }, []);

  const carregarRelatorios = async () => {
    setLoading(true);
    try {
      const res = await api.get("/relatorio");
      if (res.success) {
        const relatoriosTratados = res.data.map(r => ({
          ...r,
          dados: typeof r.dados === "string" ? JSON.parse(r.dados) : r.dados
        }));
        setRelatorios(relatoriosTratados);
      } else {
        toast.error(res?.error || "Erro ao carregar relatórios");
      }
    } catch (err) {
      toast.error("Erro ao carregar relatórios");
      console.error(err);
    }
    setLoading(false);
  };

  const handleExcluir = async (id) => {
    if (!window.confirm("Deseja realmente excluir este relatório?")) return;
    try {
      const res = await api.delete(`/relatorio/${id}`);
      if (res.success) {
        toast.success("Relatório removido com sucesso!");
        await carregarRelatorios();
      } else {
        toast.error(res.error || "Erro ao remover relatório");
      }
    } catch (err) {
      toast.error("Erro ao remover relatório");
      console.error(err);
    }
  };

  const handleAbrirModalPDF = (relatorio) => {
    setRelatorioSelecionado(relatorio);
    setModalOpen(true);
  };

  const handleSalvarEGerarPDF = async (dadosEditados) => {
    setGerando(relatorioSelecionado.id_relatorio);
    try {
      const res = await api.post(`/relatorio/${relatorioSelecionado.id_relatorio}/gerar-pdf`);
      if (res.success) {
        const blob = new Blob(
          [Uint8Array.from(atob(res.file), (c) => c.charCodeAt(0))],
          { type: "application/pdf" }
        );
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `relatorio_${dadosEditados.nome || relatorioSelecionado.id_relatorio}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("PDF gerado com sucesso!");
        setModalOpen(false);
        await carregarRelatorios();
      } else {
        toast.error(res.error || "Erro ao gerar PDF");
      }
    } catch (err) {
      toast.error("Erro ao gerar PDF");
      console.error(err);
    } finally {
      setGerando(null);
    }
  };

  const filteredRelatorios = relatorios.filter(relatorio => {
    const searchLower = searchTerm.toLowerCase();
    return (
      relatorio.id_relatorio.toString().includes(searchLower) ||
      relatorio.tipo.toLowerCase().includes(searchLower) ||
      (relatorio.nome && relatorio.nome.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="min-h-full w-full bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Gestão de Relatórios</h1>
              <p className="text-sm text-gray-500 mt-1">
                {filteredRelatorios.length} {filteredRelatorios.length === 1 ? 'relatório encontrado' : 'relatórios encontrados'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar relatórios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-200 w-full"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <Link
                to="/relatorio/gerar"
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md transition flex items-center justify-center whitespace-nowrap"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Novo Relatório
              </Link>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-8 flex flex-col items-center">
            <Skeleton />
          </div>
        ) : filteredRelatorios.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchTerm ? (
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-2">Nenhum relatório encontrado para "{searchTerm}"</p>
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="mt-4 text-cyan-600 hover:underline"
                >
                  Limpar busca
                </button>
              </div>
            ) : (
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="mt-2">Nenhum relatório cadastrado</p>
                <Link
                  to="/relatorio/gerar"
                  className="mt-4 inline-block bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md transition"
                >
                  Criar primeiro relatório
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRelatorios.map((relatorio) => (
                  <tr key={relatorio.id_relatorio} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {relatorio.id_relatorio}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {relatorio.tipo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {relatorio.nome || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/relatorio/detalhes/${relatorio.id_relatorio}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Visualizar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        {isAdminOrGestor && (
                          <>
                            <button
                              onClick={() => handleAbrirModalPDF(relatorio)}
                              disabled={gerando === relatorio.id_relatorio}
                              className="text-green-600 hover:text-green-900"
                              title="Gerar PDF"
                            >
                              {gerando === relatorio.id_relatorio ? (
                                <svg className="animate-spin h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              )}
                            </button>
                            <button
                              onClick={() => handleExcluir(relatorio.id_relatorio)}
                              className="text-red-600 hover:text-red-900"
                              title="Excluir"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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