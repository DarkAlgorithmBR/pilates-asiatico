/**
 * Desafio Pilates de Parede - 28 Dias
 * Especialista: Beatriz Araujo
 * Base de Dados: Exercícios, Cronograma dos 28 Dias e Conquistas
 */

const EXERCISES_DATA = {
  'wall-sit': {
    id: 'wall-sit',
    name: 'Wall Sit (Cadeira na Parede)',
    shortName: 'Wall Sit',
    category: 'Pernas & Glúteos',
    targetMuscles: 'Quadríceps, Glúteos, Posterior de Coxa e Core',
    difficulty: 'Iniciante / Intermediário',
    defaultDuration: 40,
    defaultRest: 20,
    kcalPerMinute: 7.2,
    description: 'Apoie as costas completamente contra a parede e deslize até que os joelhos fiquem flexionados em aproximadamente 90 graus, como se estivesse sentada em uma cadeira invisível. Mantenha os calcanhares firmes no chão.',
    breathing: 'Inspire expandindo as costelas e expire sugando o umbigo em direção à coluna durante a sustentação.',
    tips: [
      'Mantenha as costas e a lombar alinhadas e apoiadas na parede.',
      'Os joelhos nunca devem ultrapassar a linha das pontas dos pés.',
      'Distribua o peso uniformemente pelos calcanhares, sem tensionar os ombros.'
    ],
    benefits: 'Fortalece intensamente as coxas, estabiliza os joelhos e ativa a musculatura estabilizadora profunda do abdômen.'
  },

  'glute-bridge': {
    id: 'glute-bridge',
    name: 'Elevação Pélvica com Apoio na Parede',
    shortName: 'Elevação Pélvica',
    category: 'Pernas & Glúteos',
    targetMuscles: 'Glúteo Máximo, Isquiotibiais, Lombar e Core',
    difficulty: 'Iniciante',
    defaultDuration: 40,
    defaultRest: 20,
    kcalPerMinute: 6.8,
    description: 'Deitada de costas no tapete, flexione os joelhos e apoie a sola dos pés na parede na altura dos joelhos. Pressione os pés contra a parede e eleve o quadril até formar uma linha reta entre ombros e joelhos.',
    breathing: 'Inspire no chão; expire com força contraindo os glúteos e o abdômen ao subir a pelve.',
    tips: [
      'Aperte os glúteos no topo do movimento por 1 segundo antes de descer.',
      'Mantenha os braços estendidos ao lado do corpo para estabilidade.',
      'Não arqueie excessivamente a lombar no topo; o movimento vem do quadril.'
    ],
    benefits: 'Tonifica e levanta os glúteos sem sobrecarregar a coluna lombar, promovendo alinhamento pélvico.'
  },

  'incline-plank': {
    id: 'incline-plank',
    name: 'Prancha Inclinada na Parede',
    shortName: 'Prancha na Parede',
    category: 'Abdômen & Core',
    targetMuscles: 'Transverso Abdominal, Ombros, Peitoral e Estabilizadores',
    difficulty: 'Iniciante',
    defaultDuration: 40,
    defaultRest: 20,
    kcalPerMinute: 6.0,
    description: 'Fique de pé a cerca de um passo da parede. Apoie as palmas das mãos na parede na altura do peito, mantendo o corpo em linha reta da cabeça aos calcanhares. Ative o core mantendo a prancha firme.',
    breathing: 'Respiração profunda e contínua: expire recolhendo as costelas para ativar a musculatura profunda.',
    tips: [
      'Mantenha o corpo como uma prancha rígida, sem deixar o quadril cair ou empinar.',
      'Empurre a parede ativamente para afastar as escápulas e proteger os ombros.',
      'Apoie os calcanhares no chão para alongar a panturrilha ou eleve-os para maior intensidade.'
    ],
    benefits: 'Fortalece o abdômen profundo prevenindo a diástase e alivia dores nas costas causadas por má postura.'
  },

  'wall-crunch': {
    id: 'wall-crunch',
    name: 'Crunch Abdominal com Pés na Parede',
    shortName: 'Crunch na Parede',
    category: 'Abdômen & Core',
    targetMuscles: 'Reto Abdominal, Oblíquos e Flexores do Quadril',
    difficulty: 'Iniciante / Intermediário',
    defaultDuration: 40,
    defaultRest: 20,
    kcalPerMinute: 6.5,
    description: 'Deite-se no tapete com o quadril próximo à parede. Apoie as solas dos pés na parede com as pernas em ângulo de 90 graus. Cruze as mãos atrás da cabeça e eleve as escápulas do chão focando na contração abdominal.',
    breathing: 'Inspire relaxando as escápulas no chão; expire profundamente ao flexionar o tronco em direção aos joelhos.',
    tips: [
      'Não puxe a cabeça com as mãos; mantenha um espaço de uma maçã entre o queixo e o peito.',
      'Foque em aproximar as costelas do osso do quadril a cada subida.',
      'Mantenha a lombar sempre em contato suave com o tapete.'
    ],
    benefits: 'Define a musculatura abdominal frontal sem forçar o pescoço e sem impacto sobre as vértebras.'
  },

  'hamstring-stretch': {
    id: 'hamstring-stretch',
    name: 'Alongamento Posterior na Parede',
    shortName: 'Alongamento Posterior',
    category: 'Flexibilidade & Postura',
    targetMuscles: 'Isquiotibiais, Panturrilhas, Glúteos e Fáscia Plantar',
    difficulty: 'Iniciante',
    defaultDuration: 40,
    defaultRest: 20,
    kcalPerMinute: 4.5,
    description: 'Deite-se no chão aproximando os glúteos da base da parede. Estenda as pernas para cima apoiadas na parede, formando uma letra L. Mantenha os braços relaxados e respire profundamente, sentindo o alívio na circulação.',
    breathing: 'Respiração restaurativa: inspire pelo nariz em 4 segundos e expire suavemente pela boca em 6 segundos.',
    tips: [
      'Relaxe os ombros e apoie toda a extensão das costas no tapete.',
      'Se sentir repuxar muito, afaste o quadril ligeiramente da parede (10 a 15 cm).',
      'Puxe suavemente as pontas dos pés para baixo para intensificar o alongamento posterior.'
    ],
    benefits: 'Descomprime a coluna vertebral, melhora a drenagem linfática nas pernas e alivia o cansaço do final do dia.'
  },

  'wall-pushup': {
    id: 'wall-pushup',
    name: 'Flexão Inclinada na Parede',
    shortName: 'Flexão na Parede',
    category: 'Braços & Peitoral',
    targetMuscles: 'Peitoral Maior, Tríceps, Deltoides Anteriores e Core',
    difficulty: 'Iniciante / Intermediário',
    defaultDuration: 40,
    defaultRest: 20,
    kcalPerMinute: 7.0,
    description: 'Fique de pé com as mãos apoiadas na parede na largura dos ombros. Afaste os pés para trás. Flexione os cotovelos aproximando o peito da parede de forma controlada e empurre de volta estendendo os braços.',
    breathing: 'Inspire ao aproximar o peito da parede; expire com força empurrando a parede e ativando o peitoral.',
    tips: [
      'Mantenha os cotovelos apontando a 45 graus em relação ao tronco, sem abrir demais.',
      'O corpo deve descer e subir em bloco contínuo, sem curvar o pescoço ou o quadril.',
      'Quanto mais longe os pés estiverem da parede, maior será a intensidade do exercício.'
    ],
    benefits: 'Tonifica os braços, elimina a flacidez no "músculo do tchauzinho" e fortalece a região peitoral e postural.'
  },

  'calf-raise': {
    id: 'calf-raise',
    name: 'Panturrilha com Apoio na Parede',
    shortName: 'Panturrilha na Parede',
    category: 'Pernas & Glúteos',
    targetMuscles: 'Gastrocnêmio, Sóleo e Tornozelos',
    difficulty: 'Iniciante',
    defaultDuration: 40,
    defaultRest: 20,
    kcalPerMinute: 5.8,
    description: 'De frente para a parede, apoie levemente as pontas dos dedos para equilíbrio. Com a coluna ereta, eleve os calcanhares o mais alto possível ficando na ponta dos pés, e desça suavemente sem tocar o chão por completo.',
    breathing: 'Inspire ao descer os calcanhares; expire ao subir no ponto mais alto contraindo as panturrilhas.',
    tips: [
      'Segure no topo por 1 segundo para máxima contração muscular.',
      'Desça de forma lenta e controlada, resistindo à gravidade.',
      'Mantenha a postura elegante: ombros baixos, peito aberto e olhar na horizontal.'
    ],
    benefits: 'Estimula o "segundo coração" do corpo, melhorando o retorno venoso, prevenindo varizes e inchaço.'
  },

  'thoracic-opener': {
    id: 'thoracic-opener',
    name: 'Abertura Torácica na Parede',
    shortName: 'Abertura Torácica',
    category: 'Flexibilidade & Postura',
    targetMuscles: 'Coluna Torácica, Peitorais, Trapézio Médio e Ombros',
    difficulty: 'Iniciante',
    defaultDuration: 40,
    defaultRest: 20,
    kcalPerMinute: 5.0,
    description: 'Fique em pé de lado para a parede. Apoie uma mão na parede e realize uma rotação ampla do tronco com o braço livre abrindo para trás, acompanhando com o olhar. Retorne suavemente à posição inicial e alterne os lados.',
    breathing: 'Inspire na posição neutra; expire soltando todo o ar enquanto abre o peito e gira suavemente o tronco.',
    tips: [
      'Mantenha o quadril voltado para a frente; o movimento deve acontecer no meio das costas (torácica).',
      'Não force o ombro além do seu limite confortável de rotação.',
      'Sinta as escápulas se aproximarem promovendo alívio imediato nas costas.'
    ],
    benefits: 'Corrige ombros caídos para a frente ("postura de celular"), expande a capacidade respiratória e reduz dores cervicais.'
  }
};

/**
 * Matriz dos 28 Dias do Desafio
 * 4 Semanas Temáticas com Progressão Inteligente
 */
const WEEKS_DATA = [
  {
    week: 1,
    title: 'Semana 1: Ativação & Correção Postural',
    theme: 'Despertar Muscular e Alinhamento',
    badge: 'Semana 1 Vencida',
    days: [1, 2, 3, 4, 5, 6, 7],
    description: 'Foco em conectar a mente aos músculos, aprender a respirar com o abdômen e aliviar dores nas costas.'
  },
  {
    week: 2,
    title: 'Semana 2: Queima Abdominal & Glúteos',
    theme: 'Firmeza no Core e Glúteos Definidos',
    badge: 'Mestre da Parede',
    days: [8, 9, 10, 11, 12, 13, 14],
    description: 'Intensificamos os exercícios de sustentação e contração pélvica para afinar a cintura e tonificar pernas.'
  },
  {
    week: 3,
    title: 'Semana 3: Flexibilidade & Força Funcional',
    theme: 'Amplitude Articular e Resistência',
    badge: 'Postura de Rainha',
    days: [15, 16, 17, 18, 19, 20, 21],
    description: 'Abertura torácica profunda, força de sustentação e alívio da retenção de líquidos com foco postural.'
  },
  {
    week: 4,
    title: 'Semana 4: Tonificação Total & Queima Acelerada',
    theme: 'Escultura Corporal e Vitalidade',
    badge: 'Deusa do Pilates',
    days: [22, 23, 24, 25, 26, 27, 28],
    description: 'Combinação dos melhores movimentos em circuitos dinâmicos para máxima queima e resultado duradouro.'
  }
];

const DAYS_SCHEDULE = [
  // SEMANA 1
  {
    day: 1,
    week: 1,
    title: 'Alinhamento & Respiração Consciente',
    focus: 'Postura & Core Básico',
    durationMinutes: 12,
    exercises: ['wall-sit', 'glute-bridge', 'incline-plank', 'thoracic-opener', 'hamstring-stretch'],
    expertNote: 'Bem-vinda, guerreira! No primeiro dia, o segredo não é a força bruta, mas sim sentir o apoio seguro da parede e a respiração profunda.'
  },
  {
    day: 2,
    week: 1,
    title: 'Firmeza de Glúteos & Base Forte',
    focus: 'Glúteos & Pernas',
    durationMinutes: 14,
    exercises: ['glute-bridge', 'wall-sit', 'calf-raise', 'incline-plank', 'hamstring-stretch'],
    expertNote: 'Aperte os glúteos conscientemente no topo de cada elevação. A parede potencializa a contração em até 40% a mais!'
  },
  {
    day: 3,
    week: 1,
    title: 'Adeus Tensão nos Ombros & Pescoço',
    focus: 'Coluna & Postura',
    durationMinutes: 12,
    exercises: ['thoracic-opener', 'wall-pushup', 'incline-plank', 'wall-sit', 'hamstring-stretch'],
    expertNote: 'Sinta suas escápulas se conectarem. Você vai terminar o dia com a postura 2 cm mais alta e elegante.'
  },
  {
    day: 4,
    week: 1,
    title: 'Ativação Abdominal Sem Dor no Pescoço',
    focus: 'Abdômen & Cintura',
    durationMinutes: 14,
    exercises: ['wall-crunch', 'incline-plank', 'glute-bridge', 'wall-sit', 'hamstring-stretch'],
    expertNote: 'Ao fazer o crunch com os pés na parede, sua lombar fica protegida. Concentre toda a força abaixo do umbigo.'
  },
  {
    day: 5,
    week: 1,
    title: 'Circulação & Leveza nas Pernas',
    focus: 'Pernas & Drenagem',
    durationMinutes: 13,
    exercises: ['calf-raise', 'wall-sit', 'glute-bridge', 'thoracic-opener', 'hamstring-stretch'],
    expertNote: 'O estímulo nas panturrilhas funciona como uma massagem linfática natural. Suas pernas vão agradecer!'
  },
  {
    day: 6,
    week: 1,
    title: 'Circuito Postural Express',
    focus: 'Corpo Todo Integrado',
    durationMinutes: 15,
    exercises: ['wall-pushup', 'wall-sit', 'wall-crunch', 'calf-raise', 'thoracic-opener'],
    expertNote: 'Estamos quase fechando a primeira semana. Sinta como seu corpo já reconhece o apoio da parede com facilidade.'
  },
  {
    day: 7,
    week: 1,
    title: 'Recuperação Ativa & Descompressão',
    focus: 'Alongamento & Alívio',
    durationMinutes: 10,
    exercises: ['hamstring-stretch', 'thoracic-opener', 'glute-bridge', 'incline-plank', 'hamstring-stretch'],
    expertNote: 'Parabéns pela primeira semana! Hoje é um dia regenerativo para alongar a fáscia e preparar para a queima da semana 2.'
  },

  // SEMANA 2
  {
    day: 8,
    week: 2,
    title: 'Cintura Fina & Estabilidade Pélvica',
    focus: 'Core & Glúteos',
    durationMinutes: 14,
    exercises: ['glute-bridge', 'wall-crunch', 'wall-sit', 'incline-plank', 'hamstring-stretch'],
    expertNote: 'Iniciamos a Semana 2! Foque em expulsar todo o ar na contração abdominal para ativar o músculo transverso.'
  },
  {
    day: 9,
    week: 2,
    title: 'Pernas Firmes & Coxas Torneadas',
    focus: 'Quadríceps & Glúteos',
    durationMinutes: 15,
    exercises: ['wall-sit', 'calf-raise', 'glute-bridge', 'wall-pushup', 'hamstring-stretch'],
    expertNote: 'Ao fazer o Wall Sit hoje, tente focar na respiração ritmada. Você é mais forte do que imagina!'
  },
  {
    day: 10,
    week: 2,
    title: 'Braços Firmes & Postura Alinhada',
    focus: 'Membros Superiores & Costas',
    durationMinutes: 13,
    exercises: ['wall-pushup', 'thoracic-opener', 'incline-plank', 'wall-sit', 'calf-raise'],
    expertNote: 'Nada de braço flácido! A flexão inclinada é perfeita para desenhar os tríceps e peitoral sem sobrecarga nos pulsos.'
  },
  {
    day: 11,
    week: 2,
    title: 'Super Queima de Abdômen',
    focus: 'Abdômen Profundo',
    durationMinutes: 15,
    exercises: ['wall-crunch', 'incline-plank', 'glute-bridge', 'wall-crunch', 'hamstring-stretch'],
    expertNote: 'Dose dupla de ativação de core! Mantenha a cabeça relaxada e sinta o abdômen queimar de forma saudável.'
  },
  {
    day: 12,
    week: 2,
    title: 'Levantamento de Glúteos na Parede',
    focus: 'Glúteos & Posterior',
    durationMinutes: 14,
    exercises: ['glute-bridge', 'wall-sit', 'calf-raise', 'glute-bridge', 'hamstring-stretch'],
    expertNote: 'Pressione os calcanhares na parede com firmeza. Essa pressão gera a ativação perfeita para empinar os glúteos.'
  },
  {
    day: 13,
    week: 2,
    title: 'Circuito Queima & Tonificação',
    focus: 'Corpo Inteiro',
    durationMinutes: 16,
    exercises: ['wall-sit', 'wall-pushup', 'wall-crunch', 'glute-bridge', 'thoracic-opener'],
    expertNote: 'Você atingiu metade do desafio! Seu fôlego e sua postura já estão visivelmente transformados.'
  },
  {
    day: 14,
    week: 2,
    title: 'Celebração da Metade & Alongamento',
    focus: 'Alívio & Flexibilidade',
    durationMinutes: 12,
    exercises: ['hamstring-stretch', 'thoracic-opener', 'calf-raise', 'incline-plank', 'hamstring-stretch'],
    expertNote: '14 dias consecutivos! Comemore essa vitória pessoal. Hoje descomprimimos as articulações para a fase avançada.'
  },

  // SEMANA 3
  {
    day: 15,
    week: 3,
    title: 'Força Funcional & Controle Total',
    focus: 'Resistência & Postura',
    durationMinutes: 15,
    exercises: ['wall-sit', 'incline-plank', 'wall-pushup', 'glute-bridge', 'thoracic-opener'],
    expertNote: 'Bem-vinda à Fase Avançada! Agora seus movimentos são muito mais precisos e conscientes.'
  },
  {
    day: 16,
    week: 3,
    title: 'Pelve Forte & Glúteos Esculpidos',
    focus: 'Glúteos & Core',
    durationMinutes: 16,
    exercises: ['glute-bridge', 'wall-sit', 'calf-raise', 'wall-crunch', 'hamstring-stretch'],
    expertNote: 'Concentre-se em não balançar o quadril. O pilates é sobre elegância e precisão sob controle.'
  },
  {
    day: 17,
    week: 3,
    title: 'Abertura de Peito & Alívio de Tensão',
    focus: 'Coluna & Ombros',
    durationMinutes: 14,
    exercises: ['thoracic-opener', 'wall-pushup', 'incline-plank', 'calf-raise', 'hamstring-stretch'],
    expertNote: 'Respire fundo expandindo as costelas laterais. Vamos liberar qualquer nó de estresse acumulado.'
  },
  {
    day: 18,
    week: 3,
    title: 'Abdômen Reto & Cintura Fina',
    focus: 'Abdômen & Estabilidade',
    durationMinutes: 15,
    exercises: ['wall-crunch', 'incline-plank', 'wall-sit', 'glute-bridge', 'hamstring-stretch'],
    expertNote: 'Imagine fechar um zíper bem apertado da base do quadril até as costelas a cada expiração.'
  },
  {
    day: 19,
    week: 3,
    title: 'Pernas Leves & Tornozelos Fortes',
    focus: 'Membros Inferiores',
    durationMinutes: 14,
    exercises: ['calf-raise', 'wall-sit', 'glute-bridge', 'wall-pushup', 'hamstring-stretch'],
    expertNote: 'A força dos seus tornozelos e panturrilhas é a fundação para caminhadas mais leves e sem dores articulares.'
  },
  {
    day: 20,
    week: 3,
    title: 'Circuito Força & Equilíbrio',
    focus: 'Corpo Total',
    durationMinutes: 16,
    exercises: ['wall-sit', 'incline-plank', 'wall-crunch', 'thoracic-opener', 'calf-raise'],
    expertNote: 'Apenas mais um dia para vencer a Semana 3. Olhe no espelho e veja o orgulho de quem não desiste!'
  },
  {
    day: 21,
    week: 3,
    title: 'Descompressão da Coluna & Respiração',
    focus: 'Flexibilidade & Recuperação',
    durationMinutes: 12,
    exercises: ['hamstring-stretch', 'thoracic-opener', 'glute-bridge', 'calf-raise', 'hamstring-stretch'],
    expertNote: '21 dias! A ciência comprova que 21 dias constroem um hábito permanente. Você se tornou uma mulher ativa!'
  },

  // SEMANA 4
  {
    day: 22,
    week: 4,
    title: 'Ritmo Acelerado & Energia Total',
    focus: 'Queima & Tonificação',
    durationMinutes: 16,
    exercises: ['wall-sit', 'glute-bridge', 'wall-pushup', 'wall-crunch', 'calf-raise'],
    expertNote: 'Última semana do desafio! Vamos dar o nosso melhor com energia renovada e técnica impecável.'
  },
  {
    day: 23,
    week: 4,
    title: 'Glúteos & Abdômen de Aço',
    focus: 'Core & Membros Inferiores',
    durationMinutes: 16,
    exercises: ['glute-bridge', 'wall-crunch', 'wall-sit', 'incline-plank', 'hamstring-stretch'],
    expertNote: 'Conexão máxima no core. Você sente a firmeza no abdômen até mesmo quando está parada em pé.'
  },
  {
    day: 24,
    week: 4,
    title: 'Costas Definidas & Porte Elegante',
    focus: 'Postura & Membros Superiores',
    durationMinutes: 15,
    exercises: ['wall-pushup', 'thoracic-opener', 'incline-plank', 'wall-sit', 'calf-raise'],
    expertNote: 'Postura imponente de mulher confiante. Seus ombros nunca mais voltarão a ficar curvados.'
  },
  {
    day: 25,
    week: 4,
    title: 'Queima Máxima na Parede',
    focus: 'Resistência & Metabolismo',
    durationMinutes: 17,
    exercises: ['wall-sit', 'incline-plank', 'wall-crunch', 'wall-pushup', 'glute-bridge'],
    expertNote: 'Hoje nosso circuito trabalha todas as 5 estações principais. Mantenha a respiração fluida e constante.'
  },
  {
    day: 26,
    week: 4,
    title: 'Pernas Esculpidas & Drenagem Intensa',
    focus: 'Pernas & Drenagem',
    durationMinutes: 15,
    exercises: ['calf-raise', 'wall-sit', 'glute-bridge', 'thoracic-opener', 'hamstring-stretch'],
    expertNote: 'Sensação maravilhosa de pernas leves e tonificadas. A retenção hídrica foi embora!'
  },
  {
    day: 27,
    week: 4,
    title: 'Penúltimo Dia: O Poder da Constância',
    focus: 'Corpo Total',
    durationMinutes: 16,
    exercises: ['wall-sit', 'wall-crunch', 'wall-pushup', 'glute-bridge', 'thoracic-opener'],
    expertNote: 'Respire fundo e sinta gratidão pelo seu corpo. Amanhã é a nossa grande formatura!'
  },
  {
    day: 28,
    week: 4,
    title: 'Grande Final: A Sua Transformação',
    focus: 'Consagração & Celebração',
    durationMinutes: 18,
    exercises: ['wall-sit', 'glute-bridge', 'incline-plank', 'wall-crunch', 'wall-pushup', 'thoracic-opener', 'hamstring-stretch'],
    expertNote: 'VOCÊ CONSEGUIU! 28 dias transformando seu corpo, sua postura e sua autoestima. Parabéns, você é uma Deusa do Pilates!'
  }
];

const BADGES_DATA = [
  {
    id: 'first_workout',
    title: 'Primeiro Passo',
    subtitle: 'Concluiu o 1º Treino',
    icon: '🌱',
    reqDays: 1,
    description: 'Deu o primeiro e mais importante passo na sua jornada de transformação.'
  },
  {
    id: 'streak_3',
    title: 'Foco Inabalável',
    subtitle: '3 Dias Concluídos',
    icon: '🔥',
    reqDays: 3,
    description: 'Mostrou consistência e determinação nos três primeiros dias.'
  },
  {
    id: 'week_1_done',
    title: 'Semana 1 Vencida',
    subtitle: '7 Dias Concluídos',
    icon: '⭐',
    reqDays: 7,
    description: 'Venceu a primeira semana e estabeleceu uma postura alinhada.'
  },
  {
    id: 'wall_master',
    title: 'Mestre da Parede',
    subtitle: '14 Dias Concluídos',
    icon: '💎',
    reqDays: 14,
    description: 'Chegou na metade do desafio com tônus muscular e respiração dominados.'
  },
  {
    id: 'posture_queen',
    title: 'Postura de Rainha',
    subtitle: '21 Dias Concluídos',
    icon: '👑',
    reqDays: 21,
    description: 'Transformou o pilates em um hábito fixo no seu estilo de vida.'
  },
  {
    id: 'challenge_champion',
    title: 'Deusa do Pilates',
    subtitle: '28 Dias Concluídos',
    icon: '🏆',
    reqDays: 28,
    description: 'Concluiu com maestria o Desafio Oficial de 28 Dias de Beatriz Araujo!'
  }
];

const MOTIVATIONAL_QUOTES = [
  '“O segredo do Pilates não é a pressa, é o controle de cada respiração.” — Beatriz Araujo',
  '“A parede é a sua melhor aliada: ela não mente sobre a sua postura.” — Beatriz Araujo',
  '“15 minutos por dia é tudo o que você precisa para se sentir livre de dores.” — Beatriz Araujo',
  '“A cada treino concluído, seu corpo ganha 1 ano de vitalidade e alinhamento.” — Beatriz Araujo',
  '“Respeite o seu tempo, mas nunca subestime a sua força interior.” — Beatriz Araujo'
];
