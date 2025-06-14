import { FiUser, FiLock, FiSave } from 'react-icons/fi';
import { useForm } from 'react-hook-form';

export default function Settings() {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: 'Dr. João Silva',
      email: 'joao.silva@hospital.ao',
      currentPassword: '',
      newPassword: ''
    }
  });

  const onSubmit = (data) => {
    console.log('Dados atualizados:', data);
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-8">Configurações</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6">
            {/* Seção de Perfil */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <FiUser /> Perfil
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                  <input
                    {...register('name')}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Seção de Segurança */}
            <div>
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <FiLock /> Segurança
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Senha Atual</label>
                  <input
                    {...register('currentPassword')}
                    type="password"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nova Senha</label>
                  <input
                    {...register('newPassword')}
                    type="password"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <FiSave /> Salvar Alterações
          </button>
        </form>
      </div>
    </div>
  );
}