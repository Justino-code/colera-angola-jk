import React, { useState } from 'react';

function HospitalForm() {
  const [formData, setFormData] = useState({
    nomeHospital: '',
    endereco: '',
    telefone: '',
    tipoHospital: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados do hospital enviados:', formData);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">
        {formData.id ? 'Editar Hospital' : 'Novo Hospital'}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="nomeHospital" className="block text-sm font-medium text-gray-700">Nome do Hospital</label>
          <input
            type="text"
            id="nomeHospital"
            name="nomeHospital"
            value={formData.nomeHospital}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="endereco" className="block text-sm font-medium text-gray-700">Endereço</label>
          <input
            type="text"
            id="endereco"
            name="endereco"
            value={formData.endereco}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">Telefone</label>
          <input
            type="text"
            id="telefone"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="tipoHospital" className="block text-sm font-medium text-gray-700">Tipo de Hospital</label>
          <select
            id="tipoHospital"
            name="tipoHospital"
            value={formData.tipoHospital}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Selecione o Tipo</option>
            <option value="Público">Público</option>
            <option value="Privado">Privado</option>
            <option value="Misto">Misto</option>
          </select>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {formData.id ? 'Salvar Alterações' : 'Cadastrar Hospital'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default HospitalForm;
