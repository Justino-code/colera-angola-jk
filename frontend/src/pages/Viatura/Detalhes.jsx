import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ViaturaDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [viatura, setViatura] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const statusColors = {
    disponivel: 'bg-green-100 text-green-800',
    em_viagem: 'bg-yellow-100 text-yellow-800',
    ocupada: 'bg-red-100 text-red-800',
  };

  useEffect(() => {
    const fetchViatura = async () => {
      try {
        const res = await api.get(`/viaturas/${id}`);
        if (res.success && res.data) {
          setViatura(res.data);
        } else {
          toast.error(res.error || 'Erro ao carregar viatura');
          navigate('/viatura');
        }
      } catch (error) {
        console.error('Erro ao carregar viatura:', error);
        toast.error('Erro ao conectar ao servidor');
        navigate('/viatura');
      } finally {
        setLoading(false);
      }
    };
    fetchViatura();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja remover esta viatura?')) return;
    
    setDeleting(true);
    try {
      const res = await api.delete(`/viaturas/${id}`);
      if (res.success) {
        toast.success('Viatura removida com sucesso');
        navigate('/viatura');
      } else {
        toast.error(res.error || 'Erro ao remover viatura');
      }
    } catch (error) {
      console.error('Erro ao remover viatura:', error);
      toast.error(error.response?.data?.message || 'Erro ao remover viatura');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-6 max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando detalhes da viatura...</p>
        </div>
      </div>
    );
  }

  if (!viatura) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-6 max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-medium text-gray-800 mt-4">Viatura não encontrada</h2>
          <p className="text-gray-500 mt-2">A viatura solicitada não existe ou ocorreu um erro ao carregar.</p>
          <button
            onClick={() => navigate('/viatura')}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
          >
            Voltar para a lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full w-full bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Detalhes da Viatura</h1>
              <p className="text-sm text-gray-500 mt-1">Informações completas sobre a viatura selecionada</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/viatura/${viatura.id || viatura.id_viatura}/editar`)}
                className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-md text-sm transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm transition disabled:opacity-70"
              >
                {deleting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Removendo...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remover
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">Informações Básicas</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Identificação:</span>
                    <span className="font-medium">{viatura.identificacao}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tipo:</span>
                    <span className="font-medium">{viatura.tipo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[viatura.status] || 'bg-gray-100 text-gray-800'}`}>
                      {viatura.status === 'disponivel' ? 'Disponível' : 
                       viatura.status === 'em_viagem' ? 'Em Viagem' : 
                       viatura.status === 'ocupada' ? 'Ocupada' : viatura.status}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">Localização</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Latitude:</span>
                    <span className="font-mono">{viatura.latitude ?? 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Longitude:</span>
                    <span className="font-mono">{viatura.longitude ?? 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">Hospital Vinculado</h2>
              {viatura.hospital ? (
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Nome:</span>
                    <span className="font-medium">{viatura.hospital.nome}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Tipo:</span>
                    <span className="font-medium">{viatura.hospital.tipo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Endereço:</span>
                    <span className="font-medium text-right">{viatura.hospital.endereco || 'N/A'}</span>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 italic">Nenhum hospital vinculado</div>
              )}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-200 flex justify-end">
            <button
              onClick={() => navigate('/viatura')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition"
            >
              Voltar para lista
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}