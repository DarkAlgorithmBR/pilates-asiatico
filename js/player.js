/**
 * Desafio Pilates de Parede - 28 Dias
 * Especialista: Beatriz Araujo
 * Player Interativo de Treino (Modo Execução)
 * Controle de tempo preciso, transições automáticas de descanso e áudio nativo
 */

const WorkoutPlayer = {
  // Estado do treino atual
  dayData: null,
  exercisesQueue: [],
  currentIndex: 0,
  
  // Fases: 'PREPARE' | 'WORK' | 'REST' | 'PAUSED' | 'COMPLETED'
  phase: 'PREPARE',
  previousPhase: 'PREPARE',
  
  // Temporizador
  timeTotal: 0,
  timeLeft: 0,
  timerInterval: null,
  isPaused: false,
  elapsedTotalSeconds: 0,

  // Callbacks
  onFinishCallback: null,

  init() {
    this.bindDOM();
  },

  bindDOM() {
    this.elements = {
      modal: document.getElementById('player-modal'),
      closeBtn: document.getElementById('player-close-btn'),
      soundBtn: document.getElementById('player-sound-btn'),
      soundIcon: document.getElementById('player-sound-icon'),
      
      // Cabeçalho do Treino
      dayTitle: document.getElementById('player-day-title'),
      progressDots: document.getElementById('player-progress-dots'),
      exerciseIndexText: document.getElementById('player-exercise-index'),
      
      // Área Visual
      visualContainer: document.getElementById('player-visual-container'),
      phaseBadge: document.getElementById('player-phase-badge'),
      nextPreviewBanner: document.getElementById('player-next-preview'),
      
      // Detalhes do Exercício
      exName: document.getElementById('player-ex-name'),
      exMuscles: document.getElementById('player-ex-muscles'),
      exTipsList: document.getElementById('player-tips-list'),
      
      // Timer Circular
      timerText: document.getElementById('player-timer-text'),
      timerSubtext: document.getElementById('player-timer-subtext'),
      timerRingProgress: document.getElementById('player-ring-progress'),
      
      // Controles
      playPauseBtn: document.getElementById('player-btn-playpause'),
      playPauseIcon: document.getElementById('player-icon-playpause'),
      skipBtn: document.getElementById('player-btn-skip'),
      restartBtn: document.getElementById('player-btn-restart'),
      
      // Overlay de Pausa
      pausedOverlay: document.getElementById('player-paused-overlay'),
      resumeBtn: document.getElementById('player-btn-resume')
    };

    if (this.elements.closeBtn) {
      this.elements.closeBtn.addEventListener('click', () => this.confirmExit());
    }
    if (this.elements.playPauseBtn) {
      this.elements.playPauseBtn.addEventListener('click', () => this.togglePause());
    }
    if (this.elements.skipBtn) {
      this.elements.skipBtn.addEventListener('click', () => this.skipStep());
    }
    if (this.elements.restartBtn) {
      this.elements.restartBtn.addEventListener('click', () => this.restartCurrentExercise());
    }
    if (this.elements.resumeBtn) {
      this.elements.resumeBtn.addEventListener('click', () => this.togglePause());
    }
    if (this.elements.soundBtn) {
      this.elements.soundBtn.addEventListener('click', () => {
        const isMuted = SoundEngine.toggleMute();
        this.updateSoundButtonUI(isMuted);
      });
    }

    this.updateSoundButtonUI(SoundEngine.isMuted());
  },

  updateSoundButtonUI(isMuted) {
    if (!this.elements.soundIcon) return;
    if (isMuted) {
      this.elements.soundIcon.innerHTML = `
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
      `;
      this.elements.soundBtn.classList.add('muted');
    } else {
      this.elements.soundIcon.innerHTML = `
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      `;
      this.elements.soundBtn.classList.remove('muted');
    }
  },

  /**
   * Inicia o treino de um dia específico
   */
  startDayWorkout(dayNumber, onFinish) {
    const day = DAYS_SCHEDULE.find(d => d.day === dayNumber);
    if (!day) return;

    this.dayData = day;
    this.onFinishCallback = onFinish;
    this.currentIndex = 0;
    this.elapsedTotalSeconds = 0;
    this.isPaused = false;

    // Constrói a fila com dados completos dos exercícios
    this.exercisesQueue = day.exercises.map(id => EXERCISES_DATA[id] || EXERCISES_DATA['wall-sit']);

    // Configura UI do modal
    this.elements.dayTitle.textContent = `Dia ${day.day}: ${day.title}`;
    this.renderProgressDots();

    // Abre modal em tela cheia
    this.elements.modal.classList.add('active');
    document.body.classList.add('modal-open');

    // Desbloqueia AudioContext ao iniciar
    SoundEngine.getAudioContext();

    // Começa na fase de preparação (5 segundos)
    this.startPreparePhase();
  },

  /**
   * Renderiza os indicadores de progresso no topo do player
   */
  renderProgressDots() {
    this.elements.progressDots.innerHTML = '';
    this.exercisesQueue.forEach((ex, idx) => {
      const dot = document.createElement('div');
      dot.className = 'player-progress-dot';
      if (idx < this.currentIndex) {
        dot.classList.add('completed');
      } else if (idx === this.currentIndex) {
        dot.classList.add('current');
      }
      this.elements.progressDots.appendChild(dot);
    });

    this.elements.exerciseIndexText.textContent = `Exercício ${this.currentIndex + 1} de ${this.exercisesQueue.length}`;
  },

  /**
   * FASE 1: PREPARAÇÃO (5 segundos para se posicionar)
   */
  startPreparePhase() {
    this.phase = 'PREPARE';
    this.timeTotal = 5;
    this.timeLeft = 5;

    const currentEx = this.exercisesQueue[this.currentIndex];

    // UI da fase de preparação
    this.elements.phaseBadge.textContent = 'PREPARE-SE';
    this.elements.phaseBadge.className = 'phase-badge prepare';
    this.elements.nextPreviewBanner.classList.add('hidden');

    this.elements.exName.textContent = currentEx.name;
    this.elements.exMuscles.textContent = currentEx.targetMuscles;
    this.renderTips(currentEx.tips);

    // Carrega o SVG do exercício
    this.elements.visualContainer.innerHTML = SVGExercises.render(currentEx.id);

    this.elements.timerSubtext.textContent = 'Para começar';
    this.updateTimerDisplay();

    this.runTimer(() => {
      SoundEngine.playStartSound();
      this.startWorkPhase();
    });
  },

  /**
   * FASE 2: EXECUÇÃO DO EXERCÍCIO (ex: 40 segundos)
   */
  startWorkPhase() {
    this.phase = 'WORK';
    const currentEx = this.exercisesQueue[this.currentIndex];
    
    this.timeTotal = currentEx.defaultDuration || 40;
    this.timeLeft = this.timeTotal;

    this.elements.phaseBadge.textContent = 'EM EXECUÇÃO';
    this.elements.phaseBadge.className = 'phase-badge work';
    this.elements.nextPreviewBanner.classList.add('hidden');

    this.elements.exName.textContent = currentEx.name;
    this.elements.exMuscles.textContent = currentEx.targetMuscles;
    this.renderTips(currentEx.tips);

    // Garante que o SVG está ativo
    this.elements.visualContainer.innerHTML = SVGExercises.render(currentEx.id);

    this.elements.timerSubtext.textContent = 'Tempo restante';
    this.renderProgressDots();
    this.updateTimerDisplay();

    this.runTimer(() => {
      // Se não for o último exercício, vai para descanso
      if (this.currentIndex < this.exercisesQueue.length - 1) {
        SoundEngine.playRestSound();
        this.startRestPhase();
      } else {
        this.finishWorkout();
      }
    });
  },

  /**
   * FASE 3: DESCANSO & RESPIRAÇÃO (20 segundos)
   */
  startRestPhase() {
    this.phase = 'REST';
    this.timeTotal = 20;
    this.timeLeft = 20;

    const nextEx = this.exercisesQueue[this.currentIndex + 1];

    this.elements.phaseBadge.textContent = 'DESCANSO';
    this.elements.phaseBadge.className = 'phase-badge rest';

    // Mostra banner com prévia do próximo exercício
    this.elements.nextPreviewBanner.classList.remove('hidden');
    this.elements.nextPreviewBanner.innerHTML = `
      <div class="next-label">A Seguir:</div>
      <div class="next-title">${nextEx.name}</div>
      <button class="btn-skip-rest" id="btn-skip-rest-action">Pular Descanso →</button>
    `;

    const skipRestBtn = document.getElementById('btn-skip-rest-action');
    if (skipRestBtn) {
      skipRestBtn.addEventListener('click', () => this.skipStep());
    }

    // Área visual durante descanso: ilustração calma de respiração com prévia do próximo
    this.elements.visualContainer.innerHTML = `
      <div class="rest-visual-card">
        <div class="rest-breathing-circle">
          <div class="rest-inner-circle">
            <span class="rest-icon">🧘‍♀️</span>
            <span class="rest-guide-text">Inspire & Relaxe</span>
          </div>
        </div>
        <p class="rest-advice">Solte os ombros e beba um gole d'água</p>
      </div>
    `;

    this.elements.timerSubtext.textContent = 'Descanso';
    this.updateTimerDisplay();

    this.runTimer(() => {
      this.currentIndex += 1;
      SoundEngine.playStartSound();
      this.startWorkPhase();
    });
  },

  /**
   * Renderiza as 3 dicas de postura da especialista
   */
  renderTips(tipsArray) {
    if (!this.elements.exTipsList) return;
    this.elements.exTipsList.innerHTML = '';
    tipsArray.forEach((tip, idx) => {
      const li = document.createElement('li');
      li.innerHTML = `<span class="tip-number">${idx + 1}</span> <span>${tip}</span>`;
      this.elements.exTipsList.appendChild(li);
    });
  },

  /**
   * Mecanismo do Timer com precisão por segundo
   */
  runTimer(onComplete) {
    clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      if (this.isPaused) return;

      this.timeLeft -= 1;
      this.elapsedTotalSeconds += 1;
      this.updateTimerDisplay();

      // Alertas sonoros nos 3 últimos segundos
      if (this.timeLeft === 3 || this.timeLeft === 2 || this.timeLeft === 1) {
        SoundEngine.playCountdownBeep(this.timeLeft === 1 ? 1000 : 800);
      }

      if (this.timeLeft <= 0) {
        clearInterval(this.timerInterval);
        if (onComplete) onComplete();
      }
    }, 1000);
  },

  /**
   * Atualiza número do timer e animação do círculo SVG
   */
  updateTimerDisplay() {
    this.elements.timerText.textContent = this.timeLeft;

    // Cálculo do círculo SVG (circunferência = 2 * PI * r = 2 * 3.14159 * 54 ~= 339.29)
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.max(0, this.timeLeft / this.timeTotal);
    const offset = circumference - (progress * circumference);

    if (this.elements.timerRingProgress) {
      this.elements.timerRingProgress.style.strokeDasharray = `${circumference}`;
      this.elements.timerRingProgress.style.strokeDashoffset = `${offset}`;
    }
  },

  /**
   * Pausar ou Retomar Treino
   */
  togglePause() {
    this.isPaused = !this.isPaused;

    // Sincroniza vídeo ativo se houver
    const activeVideo = this.elements.visualContainer ? this.elements.visualContainer.querySelector('video') : null;
    if (activeVideo) {
      if (this.isPaused) {
        activeVideo.pause();
      } else {
        activeVideo.play().catch(() => {});
      }
    }

    if (this.isPaused) {
      this.elements.pausedOverlay.classList.remove('hidden');
      this.elements.playPauseIcon.innerHTML = `
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      `;
    } else {
      this.elements.pausedOverlay.classList.add('hidden');
      this.elements.playPauseIcon.innerHTML = `
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      `;
    }
  },

  /**
   * Pula para o próximo passo (exercício ou fim do descanso)
   */
  skipStep() {
    clearInterval(this.timerInterval);
    if (this.isPaused) this.togglePause();

    if (this.phase === 'PREPARE') {
      this.startWorkPhase();
    } else if (this.phase === 'WORK') {
      if (this.currentIndex < this.exercisesQueue.length - 1) {
        this.startRestPhase();
      } else {
        this.finishWorkout();
      }
    } else if (this.phase === 'REST') {
      this.currentIndex += 1;
      this.startWorkPhase();
    }
  },

  /**
   * Reinicia o exercício atual do zero
   */
  restartCurrentExercise() {
    clearInterval(this.timerInterval);
    if (this.isPaused) this.togglePause();

    const activeVideo = this.elements.visualContainer ? this.elements.visualContainer.querySelector('video') : null;
    if (activeVideo) {
      activeVideo.currentTime = 0;
      activeVideo.play().catch(() => {});
    }

    this.startWorkPhase();
  },

  /**
   * Confirmação para sair do treino antes de terminar
   */
  confirmExit() {
    const confirmLeave = confirm('Deseja realmente pausar e sair do treino agora?');
    if (confirmLeave) {
      this.closePlayer();
    }
  },

  closePlayer() {
    clearInterval(this.timerInterval);
    const activeVideo = this.elements.visualContainer ? this.elements.visualContainer.querySelector('video') : null;
    if (activeVideo) {
      activeVideo.pause();
    }
    this.elements.modal.classList.remove('active');
    document.body.classList.remove('modal-open');
    this.elements.pausedOverlay.classList.add('hidden');
  },

  /**
   * Finalização do treino completo
   */
  finishWorkout() {
    clearInterval(this.timerInterval);
    this.phase = 'COMPLETED';

    SoundEngine.playVictorySound();

    // Fecha player e dispara callback para abrir tela de celebração
    this.closePlayer();

    // Cálculos de minutos e calorias reais
    const minutesDone = Math.max(1, Math.round(this.elapsedTotalSeconds / 60));
    const estimatedKcal = Math.round(minutesDone * 7.5);

    if (this.onFinishCallback) {
      this.onFinishCallback({
        dayNumber: this.dayData.day,
        minutes: minutesDone,
        calories: estimatedKcal
      });
    }
  }
};
