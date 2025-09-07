import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  errorLogs: defineTable({
    userId: v.string(), // Clerk user ID
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
    timestamp: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_subject", ["userId", "subject"])
    .index("by_user_correct", ["userId", "isCorrect"]),
});
