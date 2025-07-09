import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import api from '../../services/api';

const schema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  numero_bi: z.string().min(5, "Número de BI deve ter pelo menos 5 dígitos"),
  telefone: z.string().min(6, "Telefone inválido"),
  idade: z.number().min(0, "Idade deve ser um número positivo").max(120, "Idade inválida"),
  sexo: z.enum(["M", "F"], "Selecione o sexo"),
  localizacao: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
});

export default function PacienteEditar() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/pacientes/${id}`);
        if (res.success) {
          const paciente = res.data;
          setValue("nome", paciente.nome);
          setValue("numero_bi", paciente.numero_bi);
          setValue("telefone", paciente.telefone);
          setValue("idade", paciente.idade);
          setValue("sexo", paciente.sexo);
          setValue("localizacao.latitude", paciente.localizacao?.latitude || 0);
          setValue("localizacao.longitude", paciente.localizacao?.longitude || 0);
        } else {
          toast.error(res.message || "Erro ao carregar paciente");
          navigate('/paciente');
        }
      } catch (err) {
        console.error(err);
        toast.error("Erro ao carregar paciente");
        navigate('/paciente');
      }
    };
    load();
  }, [id, navigate, setValue]);

  const onSubmit = async (data) => {
    try {
      const res = await api.put(`/pacientes/${id}`, data);
      if (res.success) {
        toast.success(res.message || "Paciente atualizado com sucesso!");
        navigate('/paciente');
      } else {
        toast.error(res.message || "Erro ao atualizar paciente");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar paciente");
    }
  };

  const handleAtualizarLocalizacao = () => {
    toast.promise(
      new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const coords = {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude
            };
            setValue("localizacao.latitude", coords.latitude);
            setValue("localizacao.longitude", coords.longitude);
            resolve("Localização atualizada com sucesso!");
          },
          (err) => {
            console.error(err);
            reject("Não foi possível obter a localização. Verifique as permissões.");
          }
        );
      }),
      {
        loading: 'Obtendo localização...',
        success: (msg) => msg,
        error: (err) => err,
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Cabeçalho */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Editar Paciente</h1>
              <p className="text-cyan-100">Atualize as informações do paciente</p>
            </div>
            <button 
              onClick={() => navigate('/paciente')}
              className="px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all"
            >
              Voltar
            </button>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coluna 1 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input
                  {...register("nome")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número de BI</label>
                <input
                  {...register("numero_bi")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone*</label>
                <input
                  {...register("telefone")}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${errors.telefone ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Número de telefone"
                />
                {errors.telefone && <p className="mt-1 text-sm text-red-600">{errors.telefone.message}</p>}
              </div>
            </div>

            {/* Coluna 2 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
                <input
                  type="number"
                  {...register("idade", { valueAsNumber: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
                <select
                  {...register("sexo")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  disabled
                >
                  <option value="">Selecione o sexo</option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                </select>
              </div>
            </div>
          </div>

          {/* Localização */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Localização</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  {...register("localizacao.latitude", { valueAsNumber: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  {...register("localizacao.longitude", { valueAsNumber: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleAtualizarLocalizacao}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center space-x-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>Obter Localização</span>
                </button>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/paciente')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg text-white hover:from-cyan-700 hover:to-blue-700 transition-all flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Salvar Alterações</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}