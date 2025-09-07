import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Save an MCQ attempt to the error log
export const saveMCQAttempt = mutation({
  args: {
    mcqId: v.string(),
    question: v.string(),
    options: v.object({
      A: v.string(),
      B: v.string(),
      C: v.string(),
      D: v.string(),
    }),
    correctOption: v.union(v.literal("A"), v.literal("B"), v.literal("C"), v.literal("D")),
    explanation: v.string(),
    userAnswer: v.union(v.literal("A"), v.literal("B"), v.literal("C"), v.literal("D")),
    isCorrect: v.boolean(),
    subject: v.string(),
    topic: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.insert("errorLogs", {
      userId: identity.subject,
      timestamp: Date.now(),
      ...args,
    });
  },
});

// Get all error logs for the current user
export const getErrorLogs = query({
  args: {
    limit: v.optional(v.number()),
    subject: v.optional(v.string()),
    isCorrect: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Simple query without complex filtering for now
    const result = await ctx.db
      .query("errorLogs")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .take(args.limit || 100);

    return result;
  },
});

// Get error log statistics
export const getErrorLogStats = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const allLogs = await ctx.db
      .query("errorLogs")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .collect();

    const totalAttempts = allLogs.length;
    const correctAttempts = allLogs.filter(log => log.isCorrect).length;
    const incorrectAttempts = totalAttempts - correctAttempts;
    const accuracy = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;

    // Group by subject
    const subjectStats = allLogs.reduce((acc, log) => {
      if (!acc[log.subject]) {
        acc[log.subject] = { total: 0, correct: 0 };
      }
      acc[log.subject].total++;
      if (log.isCorrect) {
        acc[log.subject].correct++;
      }
      return acc;
    }, {} as Record<string, { total: number; correct: number }>);

    // Group by topic per subject
    const topicStats = allLogs.reduce((acc, log) => {
      const key = `${log.subject}::${log.topic}`;
      if (!acc[key]) {
        acc[key] = { subject: log.subject, topic: log.topic, total: 0, correct: 0 };
      }
      acc[key].total++;
      if (log.isCorrect) acc[key].correct++;
      return acc;
    }, {} as Record<string, { subject: string; topic: string; total: number; correct: number }>);

    // Determine strong and weak topics (min attempts threshold to avoid noise)
    const MIN_ATTEMPTS = 3;
    const topicsArray = Object.values(topicStats).map(t => ({
      subject: t.subject,
      topic: t.topic,
      total: t.total,
      correct: t.correct,
      accuracy: t.total > 0 ? (t.correct / t.total) * 100 : 0,
    }));

    const eligibleTopics = topicsArray.filter(t => t.total >= MIN_ATTEMPTS);
    const strongTopics = [...eligibleTopics]
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 8);
    const weakTopics = [...eligibleTopics]
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 8);

    return {
      totalAttempts,
      correctAttempts,
      incorrectAttempts,
      accuracy: Math.round(accuracy * 100) / 100,
      subjectStats,
      topicStats: topicsArray,
      strongTopics,
      weakTopics,
    };
  },
});

// Delete all error logs for the current user
export const clearErrorLogs = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const logs = await ctx.db
      .query("errorLogs")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .collect();

    // Delete all logs
    await Promise.all(logs.map(log => ctx.db.delete(log._id)));
  },
});
