import React, { useState } from 'react';

function PontosAtendimentoForm() {
  // Estado para armazenar os valores do formulário
  const [formData, setFormData] = useState({
    nomePonto: '',
    endereco: '',
    telefone: '',
    tipoAtendimento: '',
    hospitalAssociado: '',
  });

  // Função para lidar com a alteração dos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Função para enviar o formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica de envio do formulário
    console.log('Dados do ponto de atendimento enviados:', formData);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">
        {formData.id ? 'Editar Ponto de Atendimento' : 'Novo Ponto de Atendimento'}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="nomePonto" className="block text-sm font-medium text-gray-700">Nome do Ponto de Atendimento</label>
          <input
            type="text"
            id="nomePonto"
            name="nomePonto"
            value={formData.nomePonto}
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
          <label htmlFor="tipoAtendimento" className="block text-sm font-medium text-gray-700">Tipo de Atendimento</label>
          <select
            id="tipoAtendimento"
            name="tipoAtendimento"
            value={formData.tipoAtendimento}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Selecione o Tipo</option>
            <option value="Urgência">Urgência</option>
            <option value="Ambulatório">Ambulatório</option>
            <option value="Especializado">Especializado</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="hospitalAssociado" className="block text-sm font-medium text-gray-700">Hospital Associado</label>
          <input
            type="text"
            id="hospitalAssociado"
            name="hospitalAssociado"
            value={formData.hospitalAssociado}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {formData.id ? 'Salvar Alterações' : 'Cadastrar Ponto de Atendimento'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PontosAtendimentoForm;
