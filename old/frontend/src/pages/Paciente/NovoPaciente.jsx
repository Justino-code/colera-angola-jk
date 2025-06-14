import { useForm } from 'react-hook-form';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function NewPatient() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await api.post('/patients', data);
      alert('Paciente cadastrado com sucesso!');
    } catch (error) {
      alert('Erro ao cadastrar paciente');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/pacientes" className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
          <FiArrowLeft /> Voltar
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Novo Paciente</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Campo Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
            <input
              {...register('name', { required: 'Campo obrigatório' })}
              className="w-full p-2 border rounded-lg"
            />
            {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
          </div>

          {/* Campo BI Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Número do BI</label>
            <input
              {...register('bi_number', { required: 'Campo obrigatório' })}
              className="w-full p-2 border rounded-lg"
            />
            {errors.bi_number && <span className="text-red-500 text-sm">{errors.bi_number.message}</span>}
          </div>

          {/* Adicione outros campos conforme necessário */}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <FiSave /> Cadastrar Paciente
        </button>
      </form>
    </div>
  );
}