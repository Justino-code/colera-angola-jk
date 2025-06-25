import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import api from '../../services/api';

const schema = z.object({
  nome: z.string().min(3, "Nome obrigatório (mín. 3 letras)"),
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

export default function PacienteCriar() {
  const navigate = useNavigate();
  const [localizacao, setLocalizacao] = useState(null);
  
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      sintomas: [],
      localizacao: { latitude: 0, longitude: 0 }
    }
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        setLocalizacao(coords);
        setValue("localizacao.latitude", coords.latitude);
        setValue("localizacao.longitude", coords.longitude);
      },
      (err) => {
        console.error("Erro ao obter localização:", err);
        toast.error("Não foi possível obter localização automática.");
      }
    );
  }, [setValue]);

  const handleAtualizarLocalizacao = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        };
        setLocalizacao(coords);
        setValue("localizacao.latitude", coords.latitude);
        setValue("localizacao.longitude", coords.longitude);
        toast.success("Localização atualizada!");
      },
      (err) => {
        console.error(err);
        toast.error("Não foi possível obter localização.");
      }
    );
  };

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/pacientes', data);

      if (res.success) {
        toast.success(res.message || "Paciente criado com sucesso!");
        navigate('/paciente');
      }
      else {
        const errorData = await res.json();
        //toast.error(res.message || "Erro ao criar paciente");
        throw new Error(errorData.error || "Erro ao criar paciente");
        
      }
    } catch (err) {
      console.error("Erro ao criar paciente:", err);
      toast.error("Erro ao criar paciente: \n" + (err || "Erro desconhecido"));
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-4 rounded shadow space-y-4">
      <h1 className="text-2xl font-bold text-slate-700">Novo Paciente</h1>
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
    {[
      { key: 'diarreia_aquosa', label: 'Diarreia aquosa profusa (em água de arroz)' },
      { key: 'vomito', label: 'Vômito' },
      { key: 'desidratacao', label: 'Sinais de desidratação' },
      { key: 'cãibras_musculares', label: 'Cãibras musculares' },
      { key: 'sede_excessiva', label: 'Sede excessiva' },
      { key: 'olhos_fundos', label: 'Olhos fundos' },
      { key: 'pele_retraida', label: 'Pele com perda de elasticidade' },
      { key: 'fraqueza', label: 'Fraqueza extrema' },
      { key: 'batimento_acelerado', label: 'Batimento cardíaco acelerado' },
      { key: 'pressao_baixa', label: 'Pressão arterial baixa' },
      { key: 'urinacao_reduzida', label: 'Diminuição da urina' },
      { key: 'letargia', label: 'Letargia / sonolência' },
      { key: 'febre', label: 'Febre' },
    ].map(({ key, label }) => (
      <label key={key}>
        <input type="checkbox" value={key} {...register("sintomas")} className="mr-1" /> {label}
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

        {localizacao && (
          <p className="text-sm text-slate-500">
            Localização automática: {localizacao.latitude}, {localizacao.longitude}
          </p>
        )}

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

