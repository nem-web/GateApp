/** Simplified SM-2 ease factor update. grade: 0=blackout, 1=hard, 2=good, 3=easy */
export function scheduleFlashcard(args: {
  grade: number;
  repetitions: number;
  easeFactor: number;
  interval: number;
}): { repetitions: number; easeFactor: number; interval: number; mastered: boolean } {
  let { repetitions, easeFactor, interval } = args;
  const q = Math.min(Math.max(args.grade, 0), 3);

  if (q < 2) {
    repetitions = 0;
    interval = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) interval = 1;
    else if (repetitions === 2) interval = 6;
    else interval = Math.round(interval * easeFactor);
  }

  easeFactor = easeFactor + (0.1 - (3 - q) * (0.08 + (3 - q) * 0.02));
  easeFactor = Math.min(Math.max(easeFactor, 1.3), 2.5);

  const mastered = repetitions >= 4 && interval >= 21 && q >= 2;
  return { repetitions, easeFactor, interval, mastered };
}

