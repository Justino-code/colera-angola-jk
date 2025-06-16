import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";

export default function PacienteListar() {
  const [pacientes, setPacientes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    carregarPacientes();
  }, []);

  const carregarPacientes = async () => {
    const res = await api.get("/pacientes");
    if (res.data.success) {
      setPacientes(res.data.data);
    } else {
      toast.error(res.data.message || "Erro ao carregar pacientes");
    }
  };

  const excluirPaciente = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir?")) return;

    const res = await api.delete(`/pacientes/${id}`);
    if (res.data.success) {
      toast.success(res.data.message || "Paciente excluído!");
      carregarPacientes();
    } else {
      toast.error(res.data.message || "Erro ao excluir paciente");
    }
  };
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Pacientes</h1>
        <Link to="/paciente/criar" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Novo
        </Link>
      </div>
      <table className="w-full border">
        <thead className="bg-slate-100">
          <tr>
            <th className="border p-2">Nome</th>
            <th className="border p-2">BI</th>
            <th className="border p-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.map(p => (
            <tr key={p.id} className="hover:bg-slate-50">
              <td className="border p-2">{p.nome}</td>
              <td className="border p-2">{p.numero_bi}</td>
              <td className="border p-2 space-x-2">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  onClick={() => navigate(`/paciente/editar/${p.id}`)}
                >
                  Editar
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  onClick={() => handleDelete(p.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

