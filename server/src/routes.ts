import { FastifyInstance } from "fastify";
import { prisma } from "./lib/prisma";
import { z } from "zod";
import dayjs from "dayjs";

export async function appRoutes(app: FastifyInstance) {
    app.post('/habits', async (req) => {
        const createHabityBody = z.object({
            title: z.string(),
            weekDays: z.array(z.number().min(0).max(6))
        })

        const { title, weekDays } = createHabityBody.parse(req.body);

        const today = dayjs().startOf('day').toDate();

        await prisma.habit.create({
            data: {
                title,
                created_at: today,
                weekDays: {
                    create: weekDays.map(weekDay => {
                        return {
                            week_day: weekDay,
                        }
                    })
                }
            }
        })
    });

    app.get('/day', async (req) => {
        const getDayParams = z.object({
            date: z.coerce.date()
        });

        const { date } = getDayParams.parse(req.query);

        const parseDate = dayjs(date).startOf('day');
        const weekDay = dayjs(date).get('day');

        //todos os hábitos possíveis
        //hábitos que ja foram completados

        const possibleHabits = await prisma.habit.findMany({
            where: {
                created_at: {
                    lte: date,
                },
                weekDays: {
                    some: {
                        week_day: weekDay,
                    }
                }
            }
        });

        const day = await prisma.day.findUnique({
            where: {
                date: parseDate.toDate(),
            },
            include: {
                dayHabits: true,
            }
        });

        const completedHabits = day?.dayHabits.map(dayHabit => {
            return dayHabit.habit_id;
        });

        return {
            possibleHabits
        }
    });

}
