import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";

export default function PacienteDetalhes() {
  const { id } = useParams();
  const [paciente, setPaciente] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    carregarPaciente();
  }, []);

  const carregarPaciente = async () => {
    const res = await api.get(`/pacientes/${id}`);
    if (res.success) {
      setPaciente(res.data);
    } else {
      toast.error(res.message || "Paciente não encontrado");
      navigate("/paciente");
    }
  };

  if (!paciente) {
    return <div className="p-6 text-center text-slate-500">Carregando...</div>;
  }

  return (
    <div className="h-full w-full flex flex-col bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Detalhes do Paciente</h1>
      <div className="space-y-2">
        <p><strong>Nome:</strong> {paciente.nome}</p>
        <p><strong>BI:</strong> {paciente.numero_bi}</p>
        <p><strong>Telefone:</strong> {paciente.telefone}</p>
        <p><strong>Idade:</strong> {paciente.idade}</p>
        <p>
          <strong>Sexo:</strong>{" "}
          {paciente.sexo === "M"
            ? "Masculino"
            : paciente.sexo === "F"
            ? "Feminino"
            : paciente.sexo}
        </p>
        <p><strong>Sintomas:</strong> {paciente.sintomas.join(', ')}</p>
        {paciente.localizacao && (
          <p>
            <strong>Localização:</strong> {paciente.localizacao.latitude}, {paciente.localizacao.longitude}
          </p>
        )}
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => navigate(`/paciente/editar/${paciente.id}`)}
          className="bg-cyan-600 text-white px-4 py-2 rounded"
        >
          Editar
        </button>
        <button
          onClick={() => navigate('/paciente')}
          className="bg-slate-300 text-slate-700 px-4 py-2 rounded"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}

