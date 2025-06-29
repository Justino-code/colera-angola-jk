import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const schema = z.object({
  tipo: z.enum([
    "casos_por_regiao",
    "evolucao_temporal",
    "distribuicao_demografica",
    "casos_por_sexo",
    "casos_por_idade",
    "casos_por_hospital",
    "casos_por_municipio",
    "casos_por_resultado_triagem",
    "outro"
  ], "Tipo obrigatório"),
});

export default function RelatorioGerar() {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const [dadosGerados, setDadosGerados] = useState(null);
  const [loadingDados, setLoadingDados] = useState(false);
  const navigate = useNavigate();
  const tipoSelecionado = watch("tipo");

  useEffect(() => {
    if (!tipoSelecionado) {
      setDadosGerados(null);
      return;
    }
    setLoadingDados(true);
    gerarDados(tipoSelecionado)
      .then((dados) => setDadosGerados(dados))
      .catch(() => setDadosGerados(null))
      .finally(() => setLoadingDados(false));
  }, [tipoSelecionado]);

  // Função para buscar e gerar dados do sistema conforme o tipo
  async function gerarDados(tipo) {
    if (tipo === "casos_por_regiao") {
      const res = await api.get("/pacientes");
      if (res.success && Array.isArray(res.data)) {
        // Agrupa por hospital
        const agrupado = {};
        res.data.forEach((p) => {
          const regiao = p.hospital?.nome || "Desconhecido";
          agrupado[regiao] = (agrupado[regiao] || 0) + 1;
        });
        return agrupado;
      }
    }
    if (tipo === "evolucao_temporal") {
      const res = await api.get("/pacientes");
      if (res.success && Array.isArray(res.data)) {
        // Agrupa por data de criação
        const agrupado = {};
        res.data.forEach((p) => {
          const data = p.created_at?.slice(0, 10) || "Desconhecido";
          agrupado[data] = (agrupado[data] || 0) + 1;
        });
        return agrupado;
      }
    }
    if (tipo === "distribuicao_demografica") {
      const res = await api.get("/pacientes");
      if (res.success && Array.isArray(res.data)) {
        // Agrupa por sexo e faixa etária
        const grupos = { Masculino: 0, Feminino: 0, "0-12": 0, "13-18": 0, "19-59": 0, "60+": 0 };
        res.data.forEach((p) => {
          if (p.sexo === "M") grupos.Masculino++;
          if (p.sexo === "F") grupos.Feminino++;
          if (p.idade <= 12) grupos["0-12"]++;
          else if (p.idade <= 18) grupos["13-18"]++;
          else if (p.idade <= 59) grupos["19-59"]++;
          else grupos["60+"]++;
        });
        return grupos;
      }
    }
    if (tipo === "casos_por_sexo") {
      const res = await api.get("/pacientes");
      if (res.success && Array.isArray(res.data)) {
        // Agrupa por sexo
        const sexo = { Masculino: 0, Feminino: 0, Outro: 0 };
        res.data.forEach((p) => {
          if (p.sexo === "M") sexo.Masculino++;
          else if (p.sexo === "F") sexo.Feminino++;
          else sexo.Outro++;
        });
        return sexo;
      }
    }
    if (tipo === "casos_por_idade") {
      const res = await api.get("/pacientes");
      if (res.success && Array.isArray(res.data)) {
        // Agrupa por faixa etária
        const faixas = { "0-12": 0, "13-18": 0, "19-59": 0, "60+": 0 };
        res.data.forEach((p) => {
          if (p.idade <= 12) faixas["0-12"]++;
          else if (p.idade <= 18) faixas["13-18"]++;
          else if (p.idade <= 59) faixas["19-59"]++;
          else faixas["60+"]++;
        });
        return faixas;
      }
    }
    if (tipo === "casos_por_hospital") {
      const res = await api.get("/pacientes");
      if (res.success && Array.isArray(res.data)) {
        // Agrupa por hospital
        const hospitais = {};
        res.data.forEach((p) => {
          const nome = p.hospital?.nome || "Desconhecido";
          hospitais[nome] = (hospitais[nome] || 0) + 1;
        });
        return hospitais;
      }
    }
    if (tipo === "casos_por_municipio") {
      const res = await api.get("/pacientes");
      if (res.success && Array.isArray(res.data)) {
        // Agrupa por município
        const municipios = {};
        res.data.forEach((p) => {
          const nome = p.municipio?.nome || "Desconhecido";
          municipios[nome] = (municipios[nome] || 0) + 1;
        });
        return municipios;
      }
    }
    if (tipo === "casos_por_resultado_triagem") {
      const res = await api.get("/pacientes");
      if (res.success && Array.isArray(res.data)) {
        // Agrupa por resultado da triagem
        const resultados = {};
        res.data.forEach((p) => {
          const resultado = p.resultado_triagem || "Desconhecido";
          resultados[resultado] = (resultados[resultado] || 0) + 1;
        });
        return resultados;
      }
    }
    }

  const onSubmit = async (data) => {
    try {
      if (!dadosGerados) {
        toast.error("Não foi possível gerar os dados do relatório.");
        return;
      }

      const res = await api.post("/relatorio", {
        tipo: data.tipo,
        dados: JSON.stringify(dadosGerados),
      });

      if (res.success) {
        toast.success("Relatório salvo com sucesso!");
        navigate("/relatorio");
      } else {
        toast.error(res.message || res.error || "Erro ao salvar relatório");
        console.error(res);
        
      }
    } catch (err) {
      console.error("Erro ao salvar relatório:", err);
      console.log(err);
      
      toast.error("Erro ao salvar relatório");
    }
  };

  // Renderização amigável dos dados gerados
  function renderDadosGerados() {
    if (!dadosGerados) return null;
    if (typeof dadosGerados !== "object") return <span>{String(dadosGerados)}</span>;

    // Tabela para casos por região, hospital, município, resultado triagem, sexo, idade, evolução temporal
    const tabelasSimples = [
      "casos_por_regiao",
      "casos_por_hospital",
      "casos_por_municipio",
      "casos_por_resultado_triagem",
      "casos_por_sexo",
      "casos_por_idade",
      "evolucao_temporal"
    ];

    if (tabelasSimples.includes(tipoSelecionado)) {
      // Define cabeçalho dinâmico
      let label = "Categoria";
      if (tipoSelecionado === "casos_por_regiao") label = "Região";
      if (tipoSelecionado === "casos_por_hospital") label = "Hospital";
      if (tipoSelecionado === "casos_por_municipio") label = "Município";
      if (tipoSelecionado === "casos_por_resultado_triagem") label = "Resultado";
      if (tipoSelecionado === "casos_por_sexo") label = "Sexo";
      if (tipoSelecionado === "casos_por_idade") label = "Faixa Etária";
      if (tipoSelecionado === "evolucao_temporal") label = "Data";

      return (
        <div className="overflow-x-auto mt-2">
          <table className="min-w-[300px] w-full text-sm border rounded shadow">
            <thead>
              <tr className="bg-slate-100">
                <th className="border p-2">{label}</th>
                <th className="border p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(dadosGerados).map(([k, v]) => (
                <tr key={k} className="even:bg-slate-50">
                  <td className="border p-2 font-medium">{k}</td>
                  <td className="border p-2 text-center">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // Tabela para distribuição demográfica
    if (tipoSelecionado === "distribuicao_demografica") {
      return (
        <div className="overflow-x-auto mt-2">
          <table className="min-w-[300px] w-full text-sm border rounded shadow">
            <thead>
              <tr className="bg-slate-100">
                <th className="border p-2">Grupo</th>
                <th className="border p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(dadosGerados).map(([k, v]) => (
                <tr key={k} className="even:bg-slate-50">
                  <td className="border p-2 font-medium">{k}</td>
                  <td className="border p-2 text-center">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // Para "outro"
    return (
      <div className="bg-slate-100 p-3 rounded text-xs font-mono mt-2 border">
        <pre>{JSON.stringify(dadosGerados, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-white p-4 rounded shadow">
      <h1 className="text-2xl font-bold text-slate-700">Novo Relatório</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block mb-1">Tipo</label>
          <select {...register("tipo")} className="w-full border rounded p-2">
            <option value="">Selecione</option>
            <option value="casos_por_regiao">Casos por Região</option>
            <option value="evolucao_temporal">Evolução Temporal</option>
            <option value="distribuicao_demografica">Distribuição Demográfica</option>
            <option value="casos_por_sexo">Casos por Sexo</option>
            <option value="casos_por_idade">Casos por Idade</option>
            <option value="casos_por_hospital">Casos por Hospital</option>
            <option value="casos_por_municipio">Casos por Município</option>
            <option value="casos_por_resultado_triagem">Casos por Resultado da Triagem</option>
            <option value="outro">Outro</option>
          </select>
          {errors.tipo && <p className="text-red-500 text-sm">{errors.tipo.message}</p>}
        </div>

        {tipoSelecionado && (
          <div>
            <label className="block mb-1">Dados gerados</label>
            {loadingDados ? (
              <div className="text-slate-500">Gerando dados...</div>
            ) : (
              renderDadosGerados()
            )}
          </div>
        )}

        {tipoSelecionado === "outro" && (
          <div className="bg-yellow-100 text-yellow-800 p-2 rounded">
            Para este tipo de relatório, entre em contato com o administrador do sistema.
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            disabled={
              isSubmitting ||
              loadingDados ||
              !dadosGerados ||
              typeof dadosGerados !== "object" ||
              Array.isArray(dadosGerados) ||
              Object.keys(dadosGerados).length === 0
            }
            className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center justify-center gap-2 ${
              (isSubmitting || loadingDados || !dadosGerados || typeof dadosGerados !== "object" || Array.isArray(dadosGerados) || Object.keys(dadosGerados).length === 0)
                ? "opacity-60 cursor-not-allowed"
                : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                Salvando...
              </>
            ) : (
              "Salvar Relatório"
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate("/relatorio")}
            className="bg-slate-300 text-slate-700 px-4 py-2 rounded"
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
