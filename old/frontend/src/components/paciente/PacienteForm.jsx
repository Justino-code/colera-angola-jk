import { useForm } from 'react-hook-form';
import api from '../../services/api';

export default function PatientForm() {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await api.post('/patients', data);
      alert('Paciente cadastrado! QR Code: ' + response.data.qr_code);
    } catch (error) {
      alert('Erro ao cadastrar!');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Campos do formulário */}
      <input
        {...register('nome')}
        placeholder="Nome completo"
        className="w-full p-2 border rounded"
      />
      <input
        {...register('bi_number')}
        placeholder="Número do BI"
        className="w-full p-2 border rounded"
      />
      <input
        {...register('telefone')}
        placeholder="Telefone"
        className="w-full p-2 border rounded"
      />
      
      {/* Triagem */}
      <div className="border p-4 rounded">
        <h3 className="font-bold mb-2">Sintomas</h3>
        <label className="block">
          <input type="checkbox" {...register('sintomas.diarreia')} /> Diarreia severa
        </label>
        {/* Outros sintomas */}
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Cadastrar Paciente
      </button>
    </form>
  );
}
