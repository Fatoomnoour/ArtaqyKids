import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { createFaq, deleteFaq, listAllFaqs, listPublishedFaqs, updateFaq } from "./db";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  faq: router({
    listPublished: publicProcedure.query(() => listPublishedFaqs()),
    adminList: adminProcedure.query(() => listAllFaqs()),
    create: adminProcedure.input(z.object({
      question: z.string().trim().min(3).max(500),
      answer: z.string().trim().min(3),
      category: z.string().trim().min(1).max(32),
      icon: z.string().trim().min(1).max(32),
      sortOrder: z.number().int().default(0),
      isPublished: z.boolean().default(true),
    })).mutation(({ input }) => createFaq({ ...input, isPublished: input.isPublished ? 1 : 0 })),
    update: adminProcedure.input(z.object({
      id: z.number().int().positive(),
      data: z.object({
        question: z.string().trim().min(3).max(500).optional(),
        answer: z.string().trim().min(3).optional(),
        category: z.string().trim().min(1).max(32).optional(),
        icon: z.string().trim().min(1).max(32).optional(),
        sortOrder: z.number().int().optional(),
        isPublished: z.boolean().optional(),
      }),
    })).mutation(({ input }) => updateFaq(input.id, {
      ...(input.data.question === undefined ? {} : { question: input.data.question }),
      ...(input.data.answer === undefined ? {} : { answer: input.data.answer }),
      ...(input.data.category === undefined ? {} : { category: input.data.category }),
      ...(input.data.icon === undefined ? {} : { icon: input.data.icon }),
      ...(input.data.sortOrder === undefined ? {} : { sortOrder: input.data.sortOrder }),
      ...(input.data.isPublished === undefined ? {} : { isPublished: input.data.isPublished ? 1 : 0 }),
    })),
    remove: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => deleteFaq(input.id)),
  }),
});

export type AppRouter = typeof appRouter;
