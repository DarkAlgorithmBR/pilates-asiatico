/**
 * Desafio Pilates de Parede - 28 Dias
 * Especialista: Beatriz Araujo
 * Gerenciador de Persistência no LocalStorage
 */

const STORAGE_KEY = 'pilates_desafio_28dias_data_v1';

const AppStorage = {
  getDefaults() {
    return {
      completedDays: [],
      currentDay: 1,
      totalWorkouts: 0,
      totalMinutes: 0,
      totalCalories: 0,
      unlockedBadges: [],
      lastWorkoutDate: null,
      streakDays: 0,
      userName: '',
      userAge: null,
      onboardingCompleted: false
    };
  },

  load() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return this.getDefaults();
      const parsed = JSON.parse(data);
      return { ...this.getDefaults(), ...parsed };
    } catch (e) {
      console.warn('Erro ao carregar dados do localStorage:', e);
      return this.getDefaults();
    }
  },

  save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Erro ao salvar dados no localStorage:', e);
    }
  },

  hasCompletedOnboarding() {
    const data = this.load();
    return !!(data.onboardingCompleted && data.userName && data.userName.trim().length > 0 && data.userAge);
  },

  saveProfile(name, age) {
    const data = this.load();
    data.userName = (name || '').trim();
    data.userAge = age ? parseInt(age, 10) : null;
    data.onboardingCompleted = true;
    this.save(data);
    return data;
  },

  isDayCompleted(dayNum) {
    const data = this.load();
    return data.completedDays.includes(dayNum);
  },

  getCurrentActiveDay() {
    const data = this.load();
    for (let day = 1; day <= 28; day++) {
      if (!data.completedDays.includes(day)) {
        return day;
      }
    }
    return 28;
  },

  completeWorkout(dayNum, durationMinutes, caloriesBurned) {
    const data = this.load();
    const todayStr = new Date().toISOString().split('T')[0];

    // Adiciona dia aos concluídos se ainda não estava
    if (!data.completedDays.includes(dayNum)) {
      data.completedDays.push(dayNum);
      data.completedDays.sort((a, b) => a - b);
    }

    data.totalWorkouts += 1;
    data.totalMinutes += Math.round(durationMinutes);
    data.totalCalories += Math.round(caloriesBurned);

    // Cálculo da Sequência (Streak)
    if (!data.lastWorkoutDate) {
      data.streakDays = 1;
    } else {
      const lastDate = new Date(data.lastWorkoutDate);
      const today = new Date(todayStr);
      const diffTime = Math.abs(today - lastDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        data.streakDays += 1;
      } else if (diffDays > 1) {
        data.streakDays = 1; // quebrou a sequência
      }
      // Se for no mesmo dia, mantém o streak atual
    }
    data.lastWorkoutDate = todayStr;

    // Próximo dia ativo sugerido
    data.currentDay = this.getCurrentActiveDay();

    // Checar e desbloquear novas medalhas/conquistas
    const newBadges = this.evaluateBadges(data);

    this.save(data);

    return {
      data,
      newBadges
    };
  },

  toggleDayManual(dayNum) {
    const data = this.load();
    const idx = data.completedDays.indexOf(dayNum);

    if (idx >= 0) {
      data.completedDays.splice(idx, 1);
    } else {
      data.completedDays.push(dayNum);
      data.completedDays.sort((a, b) => a - b);
      data.totalWorkouts += 1;
      data.totalMinutes += 14;
      data.totalCalories += 95;
    }

    data.currentDay = this.getCurrentActiveDay();
    this.evaluateBadges(data);
    this.save(data);
    return data;
  },

  evaluateBadges(data) {
    const newlyUnlocked = [];
    const completedCount = data.completedDays.length;

    BADGES_DATA.forEach(badge => {
      if (!data.unlockedBadges.includes(badge.id)) {
        if (completedCount >= badge.reqDays) {
          data.unlockedBadges.push(badge.id);
          newlyUnlocked.push(badge);
        }
      }
    });

    return newlyUnlocked;
  },

  resetAllProgress(keepProfile = true) {
    const current = this.load();
    const defaults = this.getDefaults();
    if (keepProfile && current.userName) {
      defaults.userName = current.userName;
      defaults.userAge = current.userAge;
      defaults.onboardingCompleted = current.onboardingCompleted;
    }
    this.save(defaults);
    return defaults;
  }
};
