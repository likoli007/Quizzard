import { NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import { db } from '@/db';
import { quizAnswers, createQuizAnswerValidator } from '@/db/schema/quizAnswers';
import { quizKeyEntries } from '@/db/schema/quizKeys';
import { eq, and } from 'drizzle-orm';

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quizId } = await context.params;
    const body = await req.json();

    const { quizAttemptId, questionId, answer: raw } =
      createQuizAnswerValidator.parse({
        quizAttemptId: body.attemptId,
        questionId: body.questionId,
        answer: body.answer
      });

    const parsed = JSON.parse(raw);
    const selectedAnswer =
      typeof parsed === 'boolean' ? (parsed ? 1 : 0) : parsed;

    const keyRow = await db
      .select({ answerValue: quizKeyEntries.answerValue })
      .from(quizKeyEntries)
      .where(
        and(
          eq(quizKeyEntries.quizId, quizId),
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
      typeof correctValue === 'boolean' ? (correctValue ? 1 : 0) : correctValue;

    const wasCorrect = selectedAnswer === correctNumeric;

    await db.insert(quizAnswers).values({
      id: uuid(),
      quizAttemptId,
      questionId,
      selectedAnswer,
      isCorrect: wasCorrect
    });

    return NextResponse.json({ success: true, wasCorrect });
  } catch (err: any) {
    console.error('Error in /api/quiz/[id]/answer:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
