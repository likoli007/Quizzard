'use server';

import { v4 as uuid } from 'uuid';
import { db } from '@/db';
import { quizAnswers, createQuizAnswerValidator } from '@/db/schema/quizAnswers';
import { quizKeyEntries } from '@/db/schema/quizKeys';
import { eq, and } from 'drizzle-orm';

export async function submitQuizAnswer(raw: {
  quizId: string;
  attemptId: string;
  questionId: string;
  answer: any;
}) {
  try {
    const { quizAttemptId, questionId, answer: rawAnswer } =
      createQuizAnswerValidator.parse({
        quizAttemptId: raw.attemptId,
        questionId: raw.questionId,
        answer: raw.answer
      });
      
      let selectedAnswer: number;

      if (typeof raw.answer === 'boolean') {
        selectedAnswer = raw.answer ? 1 : 0;
      } else if (typeof raw.answer === 'number') {
        selectedAnswer = raw.answer;
      } else {
        throw new Error('Invalid answer format');
      }
      
      if (!Number.isFinite(selectedAnswer)) {
        throw new Error('Answer is not a finite number');
      }
      

    const keyRow = await db
      .select({ answerValue: quizKeyEntries.answerValue })
      .from(quizKeyEntries)
      .where(
        and(
          eq(quizKeyEntries.quizId, raw.quizId),
          eq(quizKeyEntries.questionId, questionId)
        )
      )
      .limit(1)
      .get();

    if (!keyRow) {
      throw new Error('No key found for question ' + questionId);
    }

    const correctValue = JSON.parse(keyRow.answerValue);
    const correctNumeric =
      typeof correctValue === 'boolean' ? (correctValue ? 1 : 0) : Number(correctValue);

    const wasCorrect = selectedAnswer === correctNumeric;

    await db.insert(quizAnswers).values({
      id: uuid(),
      quizAttemptId,
      questionId,
      selectedAnswer,
      isCorrect: wasCorrect
    });

    return { success: true, wasCorrect };
  } catch (err: any) {
    console.error('Error in submitQuizAnswer:', err);
    throw new Error(err.message || 'Submission failed');
  }
}
