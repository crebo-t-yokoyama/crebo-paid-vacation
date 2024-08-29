type ISO8601DateTime = string;
type Decimal = string;

type MEmployee = {
  employeeCode: string;
  email: string;
  name: string;
  joinDate: ISO8601DateTime;
  insertUser: string;
  insertDatetime: ISO8601DateTime;
  updateUser: string;
  updateDatetime: ISO8601DateTime;
  vacationDays: TVacationDays[];
  vacationHistory: TVacationHistory[];
};

type MVacationDays = {
  employmentYears: Decimal;
  grantDays: number;
  insertUser: string;
  insertDatetime: ISO8601DateTime;
  updateUser: string;
  updateDatetime: ISO8601DateTime;
};

type TVacationDays = {
  employeeCode: string;
  employmentYears: Decimal;
  remainingDays: Decimal;
  insertUser: string;
  insertDatetime: ISO8601DateTime;
  updateUser: string;
  updateDatetime: ISO8601DateTime;
  employee: MEmployee;
};

type TVacationHistory = {
  employeeCode: string;
  acquisitionDate: ISO8601DateTime;
  employmentYears: Decimal;
  halfFlg: boolean;
  delFlg: boolean;
  insertUser: string;
  insertDatetime: ISO8601DateTime;
  updateUser: string;
  updateDatetime: ISO8601DateTime;
  employee: MEmployee;
};
