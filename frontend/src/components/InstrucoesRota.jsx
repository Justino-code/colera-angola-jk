import { useEffect, useRef, useState } from 'react';
import {
  FaArrowRight,
  FaArrowLeft,
  FaArrowUp,
  FaLocationArrow,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';

const traduzirInstrucao = (instrucao) => {
  const traducoes = {
    'Head west': 'Siga para oeste',
    'Head east': 'Siga para leste',
    'Head north': 'Siga para o norte',
    'Head south': 'Siga para o sul',
    'Turn right': 'Vire à direita',
    'Turn left': 'Vire à esquerda',
    'Continue straight': 'Continue em frente',
    'Arrive at destination': 'Chegou ao destino',
  };
  return traducoes[instrucao] || instrucao;
};

const iconeInstrucao = (instrucao) => {
  if (instrucao.includes('right')) return <FaArrowRight className="inline mr-1 text-blue-600" />;
  if (instrucao.includes('left')) return <FaArrowLeft className="inline mr-1 text-blue-600" />;
  if (instrucao.includes('straight')) return <FaArrowUp className="inline mr-1 text-blue-600" />;
  if (instrucao.includes('Arrive')) return <FaLocationArrow className="inline mr-1 text-green-600" />;
  return <FaLocationArrow className="inline mr-1 text-gray-600" />;
};

const InstrucoesRota = ({ instrucoes }) => {
  const conteudoRef = useRef(null);
  const containerRef = useRef(null);
  const [mostrar, setMostrar] = useState(false);
  const [altura, setAltura] = useState(0);

  // Abre automaticamente se tiver até 5 instruções
  useEffect(() => {
    if (instrucoes && instrucoes.length <= 5) {
      setMostrar(true);
    }
  }, [instrucoes]);

  // Atualiza altura do bloco
  useEffect(() => {
    if (conteudoRef.current) {
      setAltura(mostrar ? conteudoRef.current.scrollHeight : 0);
    }
  }, [mostrar, instrucoes]);

  // Scroll automático ao abrir
  useEffect(() => {
    if (mostrar && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [mostrar]);

  if (!instrucoes || instrucoes.length === 0) return null;

  return (
    <div ref={containerRef} className="mt-4 p-4 bg-gray-100 rounded-lg shadow-sm">
      <button
        onClick={() => setMostrar(!mostrar)}
        className="flex items-center text-sm text-blue-700 font-medium mb-2 hover:underline focus:outline-none"
      >
        {mostrar ? (
          <>
            <FaChevronUp className="mr-1" />
            Esconder instruções ({instrucoes.length})
          </>
        ) : (
          <>
            <FaChevronDown className="mr-1" />
            Mostrar instruções ({instrucoes.length})
          </>
        )}
      </button>

      <div
        className="transition-all duration-500 ease-in-out overflow-hidden"
        style={{ maxHeight: `${altura}px` }}
        ref={conteudoRef}
      >
        <h3 className="font-semibold text-gray-800 mb-2">Instruções de Navegação:</h3>
        <ol className="list-decimal list-inside text-sm text-gray-800 space-y-1">
          {instrucoes.map((instrucao, index) => (
            <li key={index} className="flex items-start">
              <span className="mr-2 mt-0.5">{iconeInstrucao(instrucao.instruction)}</span>
              <span>
                {traduzirInstrucao(instrucao.instruction)}{' '}
                <span className="text-gray-500 text-xs">
                  ({instrucao.distance?.toFixed(0)} m, {instrucao.duration?.toFixed(0)} s)
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default InstrucoesRota;
