import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const employees = [
  {
    employeeCode: "EMP001",
    email: "kuroki@crebo.co.jp",
    name: "黒木 健太郎",
    manageFlg: true,
    joinDate: new Date("2018-03-01"),
  },
  {
    employeeCode: "EMP002",
    email: "hashimoto@crebo.co.jp",
    name: "橋本 早都季",
    manageFlg: false,
    joinDate: new Date("2018-08-01"),
  },
  {
    employeeCode: "EMP003",
    email: "ito@crebo.co.jp",
    name: "伊藤 俊輔",
    manageFlg: false,
    joinDate: new Date("2019-02-01"),
  },
  {
    employeeCode: "EMP004",
    email: "iizuka@crebo.co.jp",
    name: "飯塚 未佐子",
    manageFlg: true,
    joinDate: new Date("2019-05-16"),
  },
  {
    employeeCode: "EMP005",
    email: "kano@crebo.co.jp",
    name: "加野 大輔",
    manageFlg: false,
    joinDate: new Date("2019-12-01"),
  },
  {
    employeeCode: "EMP006",
    email: "yokoyama@crebo.co.jp",
    name: "横山 太軌",
    manageFlg: true,
    joinDate: new Date("2021-11-01"),
  },
  {
    employeeCode: "EMP007",
    email: "yoshida@crebo.co.jp",
    name: "吉田 雄樹",
    manageFlg: false,
    joinDate: new Date("2022-05-01"),
  },
  {
    employeeCode: "EMP008",
    email: "fujita@crebo.co.jp",
    name: "藤田 学",
    manageFlg: false,
    joinDate: new Date("2022-10-01"),
  },
  {
    employeeCode: "EMP009",
    email: "terashima@crebo.co.jp",
    name: "寺島 康之",
    manageFlg: false,
    joinDate: new Date("2023-06-01"),
  },
  {
    employeeCode: "EMP010",
    email: "fujimoto@crebo.co.jp",
    name: "藤本 達也",
    manageFlg: false,
    joinDate: new Date("2023-06-01"),
  },
  {
    employeeCode: "EMP011",
    email: "oka@crebo.co.jp",
    name: "岡 隆志",
    manageFlg: false,
    joinDate: new Date("2024-01-01"),
  },
  {
    employeeCode: "EMP012",
    email: "honda@crebo.co.jp",
    name: "本多 愛花",
    manageFlg: false,
    joinDate: new Date("2024-04-01"),
  },
  {
    employeeCode: "EMP013",
    email: "ogata@crebo.co.jp",
    name: "尾形 空",
    manageFlg: false,
    joinDate: new Date("2024-09-01"),
  },
];

const vacationDaysMapping = [
  { employmentYears: 0.5, grantDays: 10 },
  { employmentYears: 1.5, grantDays: 11 },
  { employmentYears: 2.5, grantDays: 12 },
  { employmentYears: 3.5, grantDays: 14 },
  { employmentYears: 4.5, grantDays: 16 },
  { employmentYears: 5.5, grantDays: 18 },
  { employmentYears: 6.5, grantDays: 20 },
];

const vacationDays = [
  {
    employeeCode: "EMP001",
    employmentYears: 1.5,
    remainingDays: 2,
    expiredFlg: false,
  },
  {
    employeeCode: "EMP001",
    employmentYears: 2.5,
    remainingDays: 3,
    expiredFlg: false,
  },
  {
    employeeCode: "EMP002",
    employmentYears: 4.5,
    remainingDays: 5,
    expiredFlg: false,
  },
  {
    employeeCode: "EMP002",
    employmentYears: 5.5,
    remainingDays: 18,
    expiredFlg: false,
  },
  {
    employeeCode: "EMP003",
    employmentYears: 4.5,
    remainingDays: 0,
    expiredFlg: false,
  },
  {
    employeeCode: "EMP003",
    employmentYears: 5.5,
    remainingDays: 12,
    expiredFlg: false,
  },
  {
    employeeCode: "EMP004",
    employmentYears: 3.5,
    remainingDays: 10,
    expiredFlg: false,
  },
  {
    employeeCode: "EMP004",
    employmentYears: 4.5,
    remainingDays: 16,
    expiredFlg: false,
  },
  {
    employeeCode: "EMP005",
    employmentYears: 3.5,
    remainingDays: 10,
    expiredFlg: false,
  },
  {
    employeeCode: "EMP005",
    employmentYears: 4.5,
    remainingDays: 16,
    expiredFlg: false,
  },
  {
    employeeCode: "EMP006",
    employmentYears: 1.5,
    remainingDays: 11,
    expiredFlg: false,
  },
  {
    employeeCode: "EMP006",
    employmentYears: 2.5,
    remainingDays: 12,
    expiredFlg: false,
  },
  {
    employeeCode: "EMP007",
    employmentYears: 0.5,
    remainingDays: 10,
    expiredFlg: false,
  },
  {
    employeeCode: "EMP007",
    employmentYears: 1.5,
    remainingDays: 11,
    expiredFlg: false,
  },
  {
    employeeCode: "EMP008",
    employmentYears: 0.5,
    remainingDays: 10,
    expiredFlg: false,
  },
  {
    employeeCode: "EMP008",
    employmentYears: 1.5,
    remainingDays: 11,
    expiredFlg: false,
  },
  {
    employeeCode: "EMP009",
    employmentYears: 0.5,
    remainingDays: 0,
    expiredFlg: false,
  },
  {
    employeeCode: "EMP010",
    employmentYears: 0.5,
    remainingDays: 10,
    expiredFlg: false,
  },
  {
    employeeCode: "EMP011",
    employmentYears: 0.5,
    remainingDays: 10,
    expiredFlg: false,
  },
];

async function main() {
  // MEmployee データの投入
  for (const employee of employees) {
    await prisma.mEmployee.create({
      data: employee,
    });
  }

  // MVacationDays データの投入
  for (const mapping of vacationDaysMapping) {
    await prisma.mVacationDays.create({
      data: mapping,
    });
  }

  // 6.5年以降のデータを50年まで追加
  for (let i = 7; i <= 50; i += 1) {
    await prisma.mVacationDays.create({
      data: {
        employmentYears: i + 0.5,
        grantDays: 20,
      },
    });
  }

  // TVacationDays データの投入
  for (const vd of vacationDays) {
    await prisma.tVacationDays.create({
      data: vd,
    });
  }

  console.log("Seed data inserted successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
