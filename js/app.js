/**
 * Desafio Pilates de Parede - 28 Dias
 * Especialista: Beatriz Araujo
 * Controlador Principal da Aplicação SPA (App.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

const App = {
  currentTab: 'dashboard',
  selectedWeek: 1,
  deferredInstallPrompt: null,

  init() {
    this.initPWA();
    WorkoutPlayer.init();
    this.bindEvents();
    this.renderAll();
    this.setupConfetti();
    this.checkOnboarding();
  },

  /**
   * Registro do PWA e captura de evento de instalação
   */
  initPWA() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(err => {
        console.log('SW registration note:', err);
      });
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredInstallPrompt = e;
      const installBanner = document.getElementById('pwa-install-banner');
      if (installBanner) {
        installBanner.classList.remove('hidden');
      }
    });

    const installBtn = document.getElementById('btn-pwa-install');
    if (installBtn) {
      installBtn.addEventListener('click', async () => {
        if (this.deferredInstallPrompt) {
          this.deferredInstallPrompt.prompt();
          const { outcome } = await this.deferredInstallPrompt.userChoice;
          if (outcome === 'accepted') {
            document.getElementById('pwa-install-banner').classList.add('hidden');
          }
          this.deferredInstallPrompt = null;
        } else {
          alert('Para instalar no seu celular:\n• No iPhone: Toque no botão Compartilhar e selecione "Adicionar à Tela de Início".\n• No Android: Toque nos 3 pontinhos do Chrome e selecione "Instalar Aplicativo".');
        }
      });
    }

    const closeInstallBanner = document.getElementById('btn-close-install-banner');
    if (closeInstallBanner) {
      closeInstallBanner.addEventListener('click', () => {
        document.getElementById('pwa-install-banner').classList.add('hidden');
      });
    }
  },

  bindEvents() {
    // Abas de Navegação Inferior
    const tabButtons = document.querySelectorAll('.nav-tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        this.switchTab(tab);
      });
    });

    // Filtros de Exercícios na Biblioteca
    const filterPills = document.querySelectorAll('.library-filter-btn');
    filterPills.forEach(btn => {
      btn.addEventListener('click', () => {
        filterPills.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.renderLibrary(btn.dataset.category);
      });
    });

    // Seletor de Semanas no Dashboard
    const weekTabs = document.querySelectorAll('.week-tab-pill');
    weekTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        weekTabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedWeek = parseInt(btn.dataset.week, 10);
        this.renderDaysGrid();
      });
    });

    // Botões de Ação Principal
    const startTodayBtn = document.getElementById('btn-start-today-workout');
    if (startTodayBtn) {
      startTodayBtn.addEventListener('click', () => {
        const activeDay = AppStorage.getCurrentActiveDay();
        this.startWorkout(activeDay);
      });
    }

    const startFromWorkoutTabBtn = document.getElementById('btn-start-from-tab');
    if (startFromWorkoutTabBtn) {
      startFromWorkoutTabBtn.addEventListener('click', () => {
        const activeDay = AppStorage.getCurrentActiveDay();
        this.startWorkout(activeDay);
      });
    }

    // Modal de Detalhes do Exercício da Biblioteca
    const closeExDetailBtn = document.getElementById('modal-ex-detail-close');
    if (closeExDetailBtn) {
      closeExDetailBtn.addEventListener('click', () => {
        document.getElementById('modal-ex-detail').classList.remove('active');
        document.body.classList.remove('modal-open');
        const modalVideo = document.querySelector('#modal-ex-visual video');
        if (modalVideo) modalVideo.pause();
      });
    }

    // Botão de Praticar Exercício Isolado
    const practiceExBtn = document.getElementById('btn-practice-isolated');
    if (practiceExBtn) {
      practiceExBtn.addEventListener('click', () => {
        const exId = practiceExBtn.dataset.exerciseId;
        if (exId) {
          document.getElementById('modal-ex-detail').classList.remove('active');
          this.startIsolatedExercise(exId);
        }
      });
    }

    // Modal de Conclusão do Treino
    const celebrationCloseBtn = document.getElementById('btn-celebration-done');
    if (celebrationCloseBtn) {
      celebrationCloseBtn.addEventListener('click', () => {
        document.getElementById('modal-celebration').classList.remove('active');
        document.body.classList.remove('modal-open');
        this.renderAll();
      });
    }

    // Botão de Reset do Desafio
    const resetBtn = document.getElementById('btn-reset-challenge');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        const ok = confirm('Tem certeza de que deseja reiniciar todo o progresso do desafio? Suas medalhas e dias concluídos serão zerados.');
        if (ok) {
          AppStorage.resetAllProgress(true);
          this.renderAll();
          alert('Progresso reiniciado com sucesso! Vamos começar uma nova jornada com Beatriz Araujo.');
        }
      });
    }

    // Formulário de Onboarding / Boas-Vindas (Nome & Idade)
    const onboardingForm = document.getElementById('form-onboarding');
    const inputName = document.getElementById('input-user-name');
    const inputAge = document.getElementById('input-user-age');
    const errName = document.getElementById('error-user-name');
    const errAge = document.getElementById('error-user-age');

    if (onboardingForm) {
      onboardingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameVal = inputName ? inputName.value.trim() : '';
        const ageVal = inputAge ? parseInt(inputAge.value, 10) : NaN;

        let hasError = false;

        // Validação do Nome
        if (!nameVal || nameVal.length < 2) {
          if (inputName) inputName.classList.add('has-error');
          if (errName) errName.classList.remove('hidden');
          hasError = true;
        } else {
          if (inputName) inputName.classList.remove('has-error');
          if (errName) errName.classList.add('hidden');
        }

        // Validação da Idade
        if (isNaN(ageVal) || ageVal < 12 || ageVal > 105) {
          if (inputAge) inputAge.classList.add('has-error');
          if (errAge) errAge.classList.remove('hidden');
          hasError = true;
        } else {
          if (inputAge) inputAge.classList.remove('has-error');
          if (errAge) errAge.classList.add('hidden');
        }

        if (hasError) return;

        // Salva os dados no LocalStorage
        AppStorage.saveProfile(nameVal, ageVal);
        this.closeOnboardingModal();
        SoundEngine.playStartSound();
        this.renderAll();
      });
    }

    // Limpa erros ao digitar
    if (inputName) {
      inputName.addEventListener('input', () => {
        if (inputName.value.trim().length >= 2) {
          inputName.classList.remove('has-error');
          if (errName) errName.classList.add('hidden');
        }
      });
    }

    if (inputAge) {
      inputAge.addEventListener('input', () => {
        const val = parseInt(inputAge.value, 10);
        if (!isNaN(val) && val >= 12 && val <= 105) {
          inputAge.classList.remove('has-error');
          if (errAge) errAge.classList.add('hidden');
        }
      });
    }

    // Botão de Editar Perfil na aba Progresso
    const editProfileBtn = document.getElementById('btn-edit-profile');
    if (editProfileBtn) {
      editProfileBtn.addEventListener('click', () => {
        this.showOnboardingModal(true);
      });
    }

    // Botão de Fechar Modal de Onboarding (quando em modo edição)
    const closeOnboardingBtn = document.getElementById('btn-close-onboarding-modal');
    if (closeOnboardingBtn) {
      closeOnboardingBtn.addEventListener('click', () => {
        this.closeOnboardingModal();
      });
    }
  },

  switchTab(tabId) {
    this.currentTab = tabId;

    // Atualiza botões da barra de navegação
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    // Atualiza visibilidade dos painéis
    document.querySelectorAll('.tab-view-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === `tab-view-${tabId}`);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Renderizações específicas de cada aba
    if (tabId === 'dashboard') {
      this.renderDashboard();
    } else if (tabId === 'workout') {
      this.renderWorkoutTab();
    } else if (tabId === 'library') {
      this.renderLibrary('all');
    } else if (tabId === 'progress') {
      this.renderProgressView();
    }
  },

  renderAll() {
    this.renderHeader();
    this.renderDashboard();
    this.renderWorkoutTab();
    this.renderLibrary('all');
    this.renderProgressView();
  },

  checkOnboarding() {
    if (!AppStorage.hasCompletedOnboarding()) {
      setTimeout(() => {
        this.showOnboardingModal(false);
      }, 350);
    }
  },

  showOnboardingModal(isEditing = false) {
    const modal = document.getElementById('modal-onboarding');
    const closeBtn = document.getElementById('btn-close-onboarding-modal');
    const titleEl = document.getElementById('onboarding-modal-title');
    const descEl = document.getElementById('onboarding-modal-desc');
    const submitBtnText = document.getElementById('btn-submit-onboarding-text');
    const nameInput = document.getElementById('input-user-name');
    const ageInput = document.getElementById('input-user-age');

    if (!modal) return;

    const data = AppStorage.load();

    if (isEditing) {
      if (closeBtn) closeBtn.classList.remove('hidden');
      if (titleEl) titleEl.textContent = 'Editar Seus Dados';
      if (descEl) descEl.innerHTML = 'Atualize seu nome ou idade sempre que desejar. Seus dias e medalhas já conquistadas serão mantidos intactos!';
      if (submitBtnText) submitBtnText.textContent = 'Salvar Alterações';
      if (nameInput) nameInput.value = data.userName || '';
      if (ageInput) ageInput.value = data.userAge || '';
    } else {
      if (closeBtn) closeBtn.classList.add('hidden');
      if (titleEl) titleEl.textContent = 'Seja muito bem-vinda!';
      if (descEl) descEl.innerHTML = 'Olá! Sou a <strong>Beatriz Araujo</strong>. Vamos juntas transformar sua postura e seu corpo com o Pilates de Parede. Antes de começarmos seu primeiro treino, me conte um pouco sobre você:';
      if (submitBtnText) submitBtnText.textContent = 'Começar Meu Desafio →';
      if (nameInput) nameInput.value = data.userName && data.userName !== 'Aluna' ? data.userName : '';
      if (ageInput) ageInput.value = data.userAge || '';
    }

    // Limpa erros anteriores
    document.querySelectorAll('#form-onboarding .app-input').forEach(inp => inp.classList.remove('has-error'));
    document.querySelectorAll('#form-onboarding .form-error-msg').forEach(msg => msg.classList.add('hidden'));

    modal.classList.add('active');
    document.body.classList.add('modal-open');

    setTimeout(() => {
      if (nameInput) nameInput.focus();
    }, 150);
  },

  closeOnboardingModal() {
    const modal = document.getElementById('modal-onboarding');
    if (modal) {
      modal.classList.remove('active');
      document.body.classList.remove('modal-open');
    }
  },

  renderHeader() {
    const data = AppStorage.load();
    const completedCount = data.completedDays.length;
    const progressPercent = Math.round((completedCount / 28) * 100);
    const activeDay = AppStorage.getCurrentActiveDay();

    const userNameEl = document.getElementById('header-user-name');
    if (userNameEl) {
      if (data.userName && data.userName.trim()) {
        userNameEl.textContent = `Olá, ${data.userName}! 👋`;
      } else {
        userNameEl.textContent = 'Bem-vinda! 👋';
      }
    }

    const progressSummaryEl = document.getElementById('header-progress-summary');
    if (progressSummaryEl) {
      progressSummaryEl.textContent = `Dia ${String(activeDay).padStart(2, '0')} de 28 • ${progressPercent}% Concluído`;
    }

    const streakEl = document.getElementById('header-streak-count');
    if (streakEl) {
      streakEl.textContent = `${data.streakDays} dias seguidos`;
    }

    const quoteEl = document.getElementById('quote-beatriz');
    if (quoteEl) {
      const quoteIndex = (activeDay - 1) % MOTIVATIONAL_QUOTES.length;
      quoteEl.textContent = MOTIVATIONAL_QUOTES[quoteIndex];
    }
  },

  renderDashboard() {
    const data = AppStorage.load();
    const activeDay = AppStorage.getCurrentActiveDay();
    const todaySchedule = DAYS_SCHEDULE.find(d => d.day === activeDay) || DAYS_SCHEDULE[0];

    // Card de Destaque: "Treino de Hoje"
    const todayTitleEl = document.getElementById('today-workout-title');
    const todayMetaEl = document.getElementById('today-workout-meta');
    const todayFocusEl = document.getElementById('today-workout-focus');
    const todayExercisesPreview = document.getElementById('today-exercises-preview');

    if (todayTitleEl) {
      todayTitleEl.textContent = `Dia ${todaySchedule.day}: ${todaySchedule.title}`;
    }
    if (todayMetaEl) {
      todayMetaEl.textContent = `⏱️ ${todaySchedule.durationMinutes} min • 5 exercícios • Queima estimada: ${Math.round(todaySchedule.durationMinutes * 7.2)} kcal`;
    }
    if (todayFocusEl) {
      todayFocusEl.textContent = `Foco: ${todaySchedule.focus}`;
    }

    if (todayExercisesPreview) {
      todayExercisesPreview.innerHTML = todaySchedule.exercises.slice(0, 4).map(exId => {
        const ex = EXERCISES_DATA[exId];
        return `
          <div class="today-preview-pill">
            <span class="preview-dot"></span>
            <span class="preview-name">${ex ? ex.shortName : exId}</span>
          </div>
        `;
      }).join('');
    }

    // Alinha a semana selecionada com o dia ativo se for a primeira vez
    const activeWeek = todaySchedule.week;
    if (!this.selectedWeek || this.selectedWeek === 1) {
      this.selectedWeek = activeWeek;
      document.querySelectorAll('.week-tab-pill').forEach(pill => {
        pill.classList.toggle('active', parseInt(pill.dataset.week, 10) === activeWeek);
      });
    }

    this.renderDaysGrid();
  },

  renderDaysGrid() {
    const container = document.getElementById('days-grid-container');
    if (!container) return;

    const data = AppStorage.load();
    const activeDay = AppStorage.getCurrentActiveDay();
    const weekInfo = WEEKS_DATA.find(w => w.week === this.selectedWeek);

    // Cabeçalho da Semana Selecionada
    const weekTitleEl = document.getElementById('week-theme-title');
    const weekDescEl = document.getElementById('week-theme-desc');
    if (weekTitleEl && weekInfo) {
      weekTitleEl.textContent = weekInfo.title;
    }
    if (weekDescEl && weekInfo) {
      weekDescEl.textContent = weekInfo.description;
    }

    const daysToRender = DAYS_SCHEDULE.filter(d => d.week === this.selectedWeek);

    container.innerHTML = daysToRender.map(dayItem => {
      const isCompleted = data.completedDays.includes(dayItem.day);
      const isCurrent = dayItem.day === activeDay;
      const isLocked = !isCompleted && dayItem.day > activeDay;

      let cardClass = 'day-card';
      let statusBadge = '';

      if (isCompleted) {
        cardClass += ' completed';
        statusBadge = `<span class="badge-status-completed"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg> Concluído</span>`;
      } else if (isCurrent) {
        cardClass += ' current pulse-focus';
        statusBadge = `<span class="badge-status-current">Liberado • Hoje</span>`;
      } else {
        cardClass += ' future';
        statusBadge = `<span class="badge-status-locked"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg> Dia ${dayItem.day}</span>`;
      }

      const exerciseThumbnails = dayItem.exercises.slice(0, 3).map(id => {
        const ex = EXERCISES_DATA[id];
        return `<span class="day-chip">${ex ? ex.shortName : id}</span>`;
      }).join('');

      return `
        <div class="${cardClass}" data-day="${dayItem.day}">
          <div class="day-card-header">
            <div class="day-number-circle">Dia ${String(dayItem.day).padStart(2, '0')}</div>
            <div class="day-status-pill">${statusBadge}</div>
          </div>
          <div class="day-card-body">
            <h4 class="day-card-title">${dayItem.title}</h4>
            <div class="day-card-meta">
              <span>⏱️ ${dayItem.durationMinutes} min</span>
              <span>🎯 ${dayItem.focus}</span>
            </div>
            <div class="day-card-chips">
              ${exerciseThumbnails}
            </div>
          </div>
          <div class="day-card-action">
            <button class="btn-day-start" data-day="${dayItem.day}">
              ${isCompleted ? 'Refazer Treino' : (isCurrent ? 'Iniciar Treino de Hoje' : 'Ver Treino')}
            </button>
            <button class="btn-day-toggle-check" title="Marcar como feito" data-day="${dayItem.day}">
              ${isCompleted ? '✓' : '○'}
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Adiciona cliques para os botões do card
    container.querySelectorAll('.btn-day-start').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const day = parseInt(btn.dataset.day, 10);
        this.startWorkout(day);
      });
    });

    container.querySelectorAll('.btn-day-toggle-check').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const day = parseInt(btn.dataset.day, 10);
        AppStorage.toggleDayManual(day);
        this.renderAll();
      });
    });
  },

  renderWorkoutTab() {
    const activeDay = AppStorage.getCurrentActiveDay();
    const dayData = DAYS_SCHEDULE.find(d => d.day === activeDay) || DAYS_SCHEDULE[0];

    const titleEl = document.getElementById('workout-tab-day-title');
    const descEl = document.getElementById('workout-tab-note');
    const listEl = document.getElementById('workout-tab-exercises-list');

    if (titleEl) {
      titleEl.textContent = `Dia ${dayData.day}: ${dayData.title}`;
    }
    if (descEl) {
      descEl.textContent = dayData.expertNote;
    }

    if (listEl) {
      listEl.innerHTML = dayData.exercises.map((exId, idx) => {
        const ex = EXERCISES_DATA[exId] || EXERCISES_DATA['wall-sit'];
        return `
          <div class="workout-tab-item" data-exercise-id="${ex.id}">
            <div class="workout-item-badge">${idx + 1}</div>
            <div class="workout-item-visual">
              ${SVGExercises.render(ex.id)}
            </div>
            <div class="workout-item-info">
              <h5 class="workout-item-name">${ex.name}</h5>
              <p class="workout-item-muscles">${ex.targetMuscles}</p>
              <div class="workout-item-tags">
                <span class="tag-duration">⏱️ ${ex.defaultDuration}s</span>
                <span class="tag-category">${ex.category}</span>
              </div>
            </div>
          </div>
        `;
      }).join('');

      // Clique para ver detalhes de qualquer exercício da lista
      listEl.querySelectorAll('.workout-tab-item').forEach(item => {
        item.addEventListener('click', () => {
          this.openExerciseModal(item.dataset.exerciseId);
        });
      });
    }
  },

  renderLibrary(category = 'all') {
    const grid = document.getElementById('library-grid');
    if (!grid) return;

    let exercises = Object.values(EXERCISES_DATA);
    if (category !== 'all') {
      exercises = exercises.filter(ex => ex.category === category);
    }

    grid.innerHTML = exercises.map(ex => {
      return `
        <div class="library-card" data-exercise-id="${ex.id}">
          <div class="library-card-visual">
            ${SVGExercises.render(ex.id)}
            <span class="library-card-tag">${ex.category}</span>
          </div>
          <div class="library-card-info">
            <h4 class="library-card-title">${ex.name}</h4>
            <p class="library-card-muscles">🎯 ${ex.targetMuscles}</p>
            <p class="library-card-desc">${ex.description.slice(0, 95)}...</p>
            <div class="library-card-footer">
              <span class="library-card-diff">${ex.difficulty}</span>
              <button class="btn-inspect-exercise">Ver Movimento & Dicas →</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.library-card').forEach(card => {
      card.addEventListener('click', () => {
        this.openExerciseModal(card.dataset.exerciseId);
      });
    });
  },

  openExerciseModal(exerciseId) {
    const ex = EXERCISES_DATA[exerciseId];
    if (!ex) return;

    const modal = document.getElementById('modal-ex-detail');
    const visual = document.getElementById('modal-ex-visual');
    const title = document.getElementById('modal-ex-title');
    const category = document.getElementById('modal-ex-category');
    const muscles = document.getElementById('modal-ex-muscles');
    const desc = document.getElementById('modal-ex-desc');
    const breathing = document.getElementById('modal-ex-breathing');
    const benefits = document.getElementById('modal-ex-benefits');
    const tipsList = document.getElementById('modal-ex-tips');
    const practiceBtn = document.getElementById('btn-practice-isolated');

    title.textContent = ex.name;
    category.textContent = ex.category;
    muscles.textContent = ex.targetMuscles;
    desc.textContent = ex.description;
    breathing.textContent = ex.breathing;
    benefits.textContent = ex.benefits;

    visual.innerHTML = SVGExercises.render(ex.id);

    tipsList.innerHTML = ex.tips.map((tip, idx) => `
      <li><span class="tip-num">${idx + 1}</span> ${tip}</li>
    `).join('');

    practiceBtn.dataset.exerciseId = ex.id;

    modal.classList.add('active');
    document.body.classList.add('modal-open');
  },

  renderProgressView() {
    const data = AppStorage.load();
    const completedCount = data.completedDays.length;
    const progressPercent = Math.round((completedCount / 28) * 100);

    // Card de Perfil da Aluna
    const profileNameEl = document.getElementById('profile-user-name');
    const profileAgeEl = document.getElementById('profile-user-age');
    const profileInitialsEl = document.getElementById('profile-avatar-initials');

    if (profileNameEl) {
      profileNameEl.textContent = data.userName || 'Aluna';
    }
    if (profileAgeEl) {
      profileAgeEl.textContent = data.userAge ? `${data.userAge} anos` : '-- anos';
    }
    if (profileInitialsEl) {
      const name = (data.userName || 'Aluna').trim();
      const parts = name.split(/\s+/);
      let initials = 'AL';
      if (parts.length > 1 && parts[0] && parts[parts.length - 1]) {
        initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      } else if (name.length >= 2) {
        initials = name.substring(0, 2).toUpperCase();
      } else if (name.length === 1) {
        initials = name[0].toUpperCase();
      }
      profileInitialsEl.textContent = initials;
    }

    // Contadores Numéricos
    const completedDaysEl = document.getElementById('stat-completed-days');
    const totalMinutesEl = document.getElementById('stat-total-minutes');
    const totalCaloriesEl = document.getElementById('stat-total-calories');
    const streakDaysEl = document.getElementById('stat-streak-days');
    const percentEl = document.getElementById('stat-progress-percent');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const progressBarFillLarge = document.getElementById('progress-bar-fill-large');

    if (completedDaysEl) completedDaysEl.textContent = completedCount;
    if (totalMinutesEl) totalMinutesEl.textContent = data.totalMinutes;
    if (totalCaloriesEl) totalCaloriesEl.textContent = data.totalCalories;
    if (streakDaysEl) streakDaysEl.textContent = data.streakDays;
    if (percentEl) percentEl.textContent = `${progressPercent}%`;
    if (progressBarFill) progressBarFill.style.width = `${progressPercent}%`;
    if (progressBarFillLarge) progressBarFillLarge.style.width = `${progressPercent}%`;

    // Render das Conquistas/Medalhas
    const badgesContainer = document.getElementById('badges-grid');
    if (badgesContainer) {
      badgesContainer.innerHTML = BADGES_DATA.map(badge => {
        const isUnlocked = data.unlockedBadges.includes(badge.id) || completedCount >= badge.reqDays;
        return `
          <div class="badge-card ${isUnlocked ? 'unlocked' : 'locked'}">
            <div class="badge-icon-wrap">
              <span class="badge-icon">${badge.icon}</span>
              ${isUnlocked ? '<span class="badge-check">✓</span>' : '<span class="badge-lock">🔒</span>'}
            </div>
            <h5 class="badge-title">${badge.title}</h5>
            <p class="badge-subtitle">${badge.subtitle}</p>
            <p class="badge-desc">${badge.description}</p>
          </div>
        `;
      }).join('');
    }
  },

  startWorkout(dayNumber) {
    WorkoutPlayer.startDayWorkout(dayNumber, (summary) => {
      this.handleWorkoutCompletion(summary);
    });
  },

  startIsolatedExercise(exerciseId) {
    const ex = EXERCISES_DATA[exerciseId];
    if (!ex) return;

    // Cria um treino de prática rápida para o exercício isolado
    const customDay = {
      day: 0,
      title: `Prática: ${ex.name}`,
      exercises: [exerciseId]
    };

    WorkoutPlayer.dayData = customDay;
    WorkoutPlayer.exercisesQueue = [ex];
    WorkoutPlayer.currentIndex = 0;
    WorkoutPlayer.elapsedTotalSeconds = 0;
    WorkoutPlayer.isPaused = false;

    WorkoutPlayer.elements.dayTitle.textContent = customDay.title;
    WorkoutPlayer.renderProgressDots();
    WorkoutPlayer.elements.modal.classList.add('active');
    document.body.classList.add('modal-open');

    WorkoutPlayer.startPreparePhase();
  },

  handleWorkoutCompletion(summary) {
    const { dayNumber, minutes, calories } = summary;

    // Se for treino do desafio (dia 1 a 28), salva no storage
    let newBadges = [];
    if (dayNumber >= 1 && dayNumber <= 28) {
      const result = AppStorage.completeWorkout(dayNumber, minutes, calories);
      newBadges = result.newBadges;
    }

    // Atualiza modal de comemoração
    const celebrationModal = document.getElementById('modal-celebration');
    const celebrationTitle = document.getElementById('celebration-title');
    const celebrationStats = document.getElementById('celebration-stats');
    const celebrationBadgeAlert = document.getElementById('celebration-badge-alert');

    const data = AppStorage.load();
    const studentName = data.userName ? `, ${data.userName}` : '';

    if (celebrationTitle) {
      celebrationTitle.textContent = dayNumber > 0 ? `Treino do Dia ${dayNumber} Vencido${studentName}!` : `Treino de Prática Concluído${studentName}!`;
    }

    if (celebrationStats) {
      celebrationStats.innerHTML = `
        <div class="celebration-stat-pill">
          <span class="stat-num">${minutes} min</span>
          <span class="stat-lbl">Tempo Dedicado</span>
        </div>
        <div class="celebration-stat-pill">
          <span class="stat-num">${calories} kcal</span>
          <span class="stat-lbl">Queima Estimada</span>
        </div>
      `;
    }

    if (celebrationBadgeAlert) {
      if (newBadges.length > 0) {
        celebrationBadgeAlert.classList.remove('hidden');
        celebrationBadgeAlert.innerHTML = `
          <div class="new-badge-box">
            <span class="new-badge-star">🌟</span>
            <div>
              <strong>Nova Conquista Desbloqueada!</strong>
              <p>${newBadges[0].title}: ${newBadges[0].description}</p>
            </div>
          </div>
        `;
      } else {
        celebrationBadgeAlert.classList.add('hidden');
      }
    }

    celebrationModal.classList.add('active');
    document.body.classList.add('modal-open');

    // Lança confetes festivos
    this.launchConfetti();
  },

  setupConfetti() {
    this.confettiCanvas = document.getElementById('confetti-canvas');
    if (this.confettiCanvas) {
      this.confettiCtx = this.confettiCanvas.getContext('2d');
      this.resizeConfetti();
      window.addEventListener('resize', () => this.resizeConfetti());
    }
  },

  resizeConfetti() {
    if (!this.confettiCanvas) return;
    this.confettiCanvas.width = window.innerWidth;
    this.confettiCanvas.height = window.innerHeight;
  },

  launchConfetti() {
    if (!this.confettiCanvas || !this.confettiCtx) return;
    const ctx = this.confettiCtx;
    const width = this.confettiCanvas.width;
    const height = this.confettiCanvas.height;

    const confettiPieces = [];
    const colors = ['#0D9488', '#14B8A6', '#FF6B6B', '#F97316', '#FCD34D', '#A78BFA'];

    for (let i = 0; i < 90; i++) {
      confettiPieces.push({
        x: width / 2 + (Math.random() - 0.5) * 150,
        y: height / 2 - 100,
        r: Math.random() * 6 + 4,
        d: Math.random() * 80 + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 10,
        tiltAngleIncremental: (Math.random() * 0.07) + 0.05,
        tiltAngle: 0,
        vx: (Math.random() - 0.5) * 12,
        vy: -Math.random() * 12 - 4
      });
    }

    let animationFrame;
    let frames = 0;

    const render = () => {
      frames++;
      ctx.clearRect(0, 0, width, height);

      confettiPieces.forEach((p) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (p.vy += 0.35);
        p.x += p.vx;
        p.tilt = Math.sin(p.tiltAngle - (frames / 3)) * 15;

        ctx.beginPath();
        ctx.lineWidth = p.r / 2;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + (p.r / 4), p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + (p.r / 4));
        ctx.stroke();
      });

      if (frames < 220) {
        animationFrame = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    render();
  }
};
