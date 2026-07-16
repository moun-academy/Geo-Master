const STORAGE_KEY = 'geomaster_progress_v1';

export const createEmptyProgress = () => ({
  totalAnswers: 0,
  totalCorrect: 0,
  byMode: {},
  byContinent: {},
  countries: {},
  mistakeBank: {}
});

export const loadProgress = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved ? { ...createEmptyProgress(), ...saved } : createEmptyProgress();
  } catch {
    return createEmptyProgress();
  }
};

export const saveProgress = (progress) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    /* Progress still works for the current session if storage is unavailable. */
  }
};

const incrementBucket = (bucket = {}, correct) => ({
  answers: (bucket.answers || 0) + 1,
  correct: (bucket.correct || 0) + (correct ? 1 : 0)
});

export const recordProgressAnswer = (progress, answer) => {
  const {
    correct,
    type,
    continent,
    country,
    yourAnswer,
    correctAnswer
  } = answer;
  const mistakeKey = `${type}:${country.code}`;
  const previousCountry = progress.countries[country.code] || {
    name: country.name,
    flag: country.flag,
    answers: 0,
    correct: 0
  };
  const mistakeBank = { ...progress.mistakeBank };

  if (correct) {
    delete mistakeBank[mistakeKey];
  } else {
    const previousMistake = mistakeBank[mistakeKey];
    mistakeBank[mistakeKey] = {
      key: mistakeKey,
      type,
      continent,
      country,
      yourAnswer,
      correctAnswer,
      misses: (previousMistake?.misses || 0) + 1,
      lastMissedAt: new Date().toISOString()
    };
  }

  return {
    ...progress,
    totalAnswers: progress.totalAnswers + 1,
    totalCorrect: progress.totalCorrect + (correct ? 1 : 0),
    byMode: {
      ...progress.byMode,
      [type]: incrementBucket(progress.byMode[type], correct)
    },
    byContinent: {
      ...progress.byContinent,
      [continent]: incrementBucket(progress.byContinent[continent], correct)
    },
    countries: {
      ...progress.countries,
      [country.code]: {
        ...previousCountry,
        answers: previousCountry.answers + 1,
        correct: previousCountry.correct + (correct ? 1 : 0),
        lastAnsweredAt: new Date().toISOString()
      }
    },
    mistakeBank
  };
};

export const resetProgress = () => {
  const empty = createEmptyProgress();
  saveProgress(empty);
  return empty;
};

