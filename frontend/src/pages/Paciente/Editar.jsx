import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import api from '../../services/api';

const schema = z.object({
  nome: z.string().min(3, "Nome obrigatório"),
  numero_bi: z.string().min(5, "Número de BI inválido"),
  telefone: z.string().min(6, "Telefone inválido"),
  idade: z.number().min(0, "Idade inválida"),
  sexo: z.enum(["M", "F"], "Sexo obrigatório"),
  sintomas: z.array(z.string()).min(1, "Selecione ao menos 1 sintoma"),
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
          setValue("sintomas", paciente.sintomas || []);
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
        toast.success(res.message || "Paciente atualizado");
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
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        };
        setValue("localizacao.latitude", coords.latitude);
        setValue("localizacao.longitude", coords.longitude);
        toast.success("Localização atualizada!");
      },
      (err) => {
        console.error(err);
        toast.error("Não foi possível obter a localização.");
      }
    );
  };

  return (
     <div className="h-full w-full flex flex-col bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold text-slate-700">Editar Paciente</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block mb-1">Nome</label>
          <input {...register("nome")} className="w-full border rounded p-2" />
          {errors.nome && <p className="text-red-500 text-sm">{errors.nome.message}</p>}
        </div>

        <div>
          <label className="block mb-1">Número de BI</label>
          <input {...register("numero_bi")} className="w-full border rounded p-2" />
          {errors.numero_bi && <p className="text-red-500 text-sm">{errors.numero_bi.message}</p>}
        </div>

        <div>
          <label className="block mb-1">Telefone</label>
          <input {...register("telefone")} className="w-full border rounded p-2" />
          {errors.telefone && <p className="text-red-500 text-sm">{errors.telefone.message}</p>}
        </div>

        <div>
          <label className="block mb-1">Idade</label>
          <input type="number" {...register("idade", { valueAsNumber: true })} className="w-full border rounded p-2" />
          {errors.idade && <p className="text-red-500 text-sm">{errors.idade.message}</p>}
        </div>

        <div>
          <label className="block mb-1">Sexo</label>
          <select {...register("sexo")} className="w-full border rounded p-2">
            <option value="">Selecione</option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>
          {errors.sexo && <p className="text-red-500 text-sm">{errors.sexo.message}</p>}
        </div>

        <div>
          <label className="block mb-1">Sintomas</label>
          <div className="flex flex-col space-y-1">
            {["Diarreia", "Febre", "Vómito", "Desidratação"].map(s => (
              <label key={s}>
                <input type="checkbox" value={s} {...register("sintomas")} className="mr-1" /> {s}
              </label>
            ))}
          </div>
          {errors.sintomas && <p className="text-red-500 text-sm">{errors.sintomas.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block mb-1">Latitude</label>
            <input
              type="number"
              step="any"
              {...register("localizacao.latitude", { valueAsNumber: true })}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block mb-1">Longitude</label>
            <input
              type="number"
              step="any"
              {...register("localizacao.longitude", { valueAsNumber: true })}
              className="w-full border rounded p-2"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleAtualizarLocalizacao}
          className="bg-slate-500 text-white px-3 py-1 rounded hover:bg-slate-600 transition"
        >
          Atualizar Localização
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition"
        >
          {isSubmitting ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </div>
  );
}

