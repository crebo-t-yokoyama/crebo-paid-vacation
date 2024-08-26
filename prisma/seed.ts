import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const employees = [
  {
    employeeCode: "EMP001",
    email: "yokoyama@crebo.co.jp",
    name: "横山 太軌",
    manageFlg: true,
    joinDate: new Date("2021-10-01"),
  },
  {
    employeeCode: "EMP002",
    email: "tanaka@example.com",
    name: "田中花子",
    manageFlg: false,
    joinDate: new Date("2021-04-01"),
  },
  {
    employeeCode: "EMP003",
    email: "suzuki@example.com",
    name: "鈴木一郎",
    manageFlg: false,
    joinDate: new Date("2022-04-01"),
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
    employmentYears: 0.5,
    remainingDays: 0,
    expiredFlg: true,
  },
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
    employmentYears: 0.5,
    remainingDays: 10,
    expiredFlg: false,
  },
  {
    employeeCode: "EMP003",
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
