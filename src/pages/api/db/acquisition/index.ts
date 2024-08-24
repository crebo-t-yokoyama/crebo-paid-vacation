import dayjs from "dayjs";
import ja from "dayjs/locale/ja";

import prisma from "@/lib/prisma";

dayjs.locale(ja);

export default async function handle(req, res) {
  try {
    const { acquisitionDate, employeeCode, halfFlg } = req.body;

    // acquisitionDateを解析してISO 8601形式に変換
    const parsedDate = dayjs(acquisitionDate, "YYYY/M/D").toISOString();

    // 年次別取得
    const tVacationDays = await prisma.tVacationDays.findMany({
      where: {
        employeeCode: employeeCode,
        expiredFlg: false,
        remainingDays: { gt: 0 },
      },
      orderBy: { employmentYears: "asc" },
    });

    // 今回消化日数
    const days = halfFlg ? 0.5 : 1;

    // 残日数合計
    const remainTotal = tVacationDays.reduce(
      (r, c) => r + Number(c.remainingDays),
      0
    );

    // 残日数不足
    if (remainTotal < days) {
      return res.status(400).json({
        success: false,
        message: "利用可能な有給休暇がありません。",
        code: "SHORTAGE_ERROR",
      });
    }

    const first = tVacationDays[0];
    const firstEmpYears = Number(first.employmentYears);

    // 古い年次の残数が0.5 && 全休取得
    if (Number(first.remainingDays) < 1 && !halfFlg) {
      // 古い年次 -0.5
      await updateVacationDays(
        firstEmpYears,
        Number(first.remainingDays) - 0.5,
        employeeCode
      );

      await createVacationHistory(
        employeeCode,
        parsedDate,
        firstEmpYears,
        true
      );

      // 新しい年次 -0.5
      const second = tVacationDays[1];

      const secondEmpYears = Number(second.employmentYears);

      await updateVacationDays(
        secondEmpYears,
        Number(second.remainingDays) - 0.5,
        employeeCode
      );

      await createVacationHistory(
        employeeCode,
        parsedDate,
        secondEmpYears,
        true
      );
    } else {
      // その他は通常ケース
      await updateVacationDays(
        firstEmpYears,
        Number(first.remainingDays) - days,
        employeeCode
      );

      await createVacationHistory(
        employeeCode,
        parsedDate,
        firstEmpYears,
        halfFlg
      );
    }
    res.json(null);
  } catch {
    res.status(500).json({
      success: false,
      message: "サーバーエラーが発生しました。",
      code: "INTERNAL SERVER ERROR",
    });
  }
}

// 有給休暇日数の更新
async function updateVacationDays(
  employmentYears: number,
  remainingDays: number,
  employeeCode: string
) {
  await prisma.tVacationDays.update({
    where: {
      employeeCode_employmentYears: {
        employeeCode: employeeCode,
        employmentYears: employmentYears,
      },
    },
    data: {
      remainingDays: remainingDays,
      updateUser: employeeCode,
    },
  });
}

// 休暇履歴の作成
async function createVacationHistory(
  employeeCode: string,
  parsedDate: string,
  employmentYears: number,
  halfFlg: boolean
) {
  await prisma.tVacationHistory.create({
    data: {
      employeeCode: employeeCode,
      acquisitionDate: parsedDate,
      employmentYears: employmentYears,
      halfFlg,
      insertUser: employeeCode,
      updateUser: employeeCode,
    },
  });
}
