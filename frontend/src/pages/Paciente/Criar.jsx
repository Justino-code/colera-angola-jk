import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { motion } from "framer-motion";

const pacienteSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  numero_bi: z.string().min(5, "Número do BI inválido"),
  telefone: z.string().min(6, "Telefone inválido"),
  idade: z.number().min(0, "Idade inválida"),
  sexo: z.enum(["M", "F"], "Sexo inválido"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  sintomas: z.array(z.string()).min(1, "Selecione ao menos um sintoma"),
});

export default function CriarPaciente() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(pacienteSchema),
    defaultValues: {
      sintomas: [],
    },
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({ latitude, longitude });
          setValue("latitude", latitude);
          setValue("longitude", longitude);
        },
        (err) => {
          console.error("Erro ao obter localização: ", err.message);
          alert("Não foi possível obter sua localização automaticamente.");
        }
      );
    } else {
      alert("Geolocalização não suportada pelo navegador.");
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post("/pacientes", data);
      alert("Paciente criado com sucesso.");
      reset();
      navigate("/paciente");
    } catch (error) {
      alert("Erro ao criar paciente. Verifique os dados.");
      console.error("Erro ao criar paciente:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-2xl font-bold mb-4">Cadastrar Paciente</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Nome</label>
          <input
            {...register("nome")}
            className="w-full border p-2 rounded"
            placeholder="Nome completo"
          />
          {errors.nome && <p className="text-red-500 text-sm">{errors.nome.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Número do BI</label>
          <input
            {...register("numero_bi")}
            className="w-full border p-2 rounded"
            placeholder="Número do BI"
          />
          {errors.numero_bi && <p className="text-red-500 text-sm">{errors.numero_bi.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Telefone</label>
          <input
            {...register("telefone")}
            className="w-full border p-2 rounded"
            placeholder="Telefone"
          />
          {errors.telefone && <p className="text-red-500 text-sm">{errors.telefone.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Idade</label>
          <input
            type="number"
            {...register("idade", { valueAsNumber: true })}
            className="w-full border p-2 rounded"
            placeholder="Idade"
          />
          {errors.idade && <p className="text-red-500 text-sm">{errors.idade.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Sexo</label>
          <select {...register("sexo")} className="w-full border p-2 rounded">
            <option value="">Selecione</option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>
          {errors.sexo && <p className="text-red-500 text-sm">{errors.sexo.message}</p>}
        </div>

        {/* Latitude e longitude automáticas (não editáveis) */}
        {location.latitude && location.longitude && (
          <div className="text-green-600 text-sm">
            Localização detectada: {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
          </div>
        )}

        <div className="hidden">
          <input
            type="number"
            step="any"
            {...register("latitude", { valueAsNumber: true })}
          />
          <input
            type="number"
            step="any"
            {...register("longitude", { valueAsNumber: true })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Sintomas</label>
          <div className="flex flex-col gap-2">
            <label><input type="checkbox" value="febre" {...register("sintomas")} /> Febre</label>
            <label><input type="checkbox" value="vomito" {...register("sintomas")} /> Vômito</label>
            <label><input type="checkbox" value="diarreia" {...register("sintomas")} /> Diarreia</label>
            <label><input type="checkbox" value="desidratacao" {...register("sintomas")} /> Desidratação</label>
          </div>
          {errors.sintomas && <p className="text-red-500 text-sm">{errors.sintomas.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </motion.div>
  );
}
