import prisma from "@/lib/prisma";

export default async function handle(req, res) {
  const { id, employeeCode } = req.body;

  const updateTVacationHistory = await prisma.tVacationHistory.update({
    where: {
      id: id,
      employeeCode: employeeCode,
    },
    data: {
      delFlg: true,
      updateUser: employeeCode,
    },
    include: { vacationDays: true },
  });

  const updateTVacationDays = await prisma.tVacationDays.update({
    where: {
      employeeCode_employmentYears: {
        employeeCode: employeeCode,
        employmentYears: updateTVacationHistory.employmentYears,
      },
    },
    data: {
      remainingDays:
        Number(updateTVacationHistory.vacationDays.remainingDays) +
        (updateTVacationHistory.halfFlg ? 0.5 : 1),
    },
  });

  res.json(null);
}
