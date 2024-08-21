import prisma from "@/lib/prisma";

export default async function handle(req, res) {
  const { email } = req.body;

  const result = await prisma.mEmployee.findUnique({
    where: { email },
    include: {
      vacationDays: true,
    },
  });
  // レスポンスとして、JSON形式で返す
  res.json(result);
}
