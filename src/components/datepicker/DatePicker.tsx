import { ja } from "date-fns/locale";
import dayjs from "dayjs";
import React from "react";
import ReactDatePicker, {
  DatePickerProps,
  registerLocale,
} from "react-datepicker";

registerLocale("ja", ja);

export const DatePicker = (props: DatePickerProps) => {
  return (
    <div className="light-theme-original">
      <ReactDatePicker
        locale={ja}
        renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
          <div className="datepicker__header">
            <button className="datepicker__button" onClick={decreaseMonth}>
              {"<"}
            </button>
            <div className="datepicker__header-date">
              <div className="datepicker__header-date__year">
                {dayjs(date).year()}年
              </div>
              <div className="datepicker__header-date__month">
                {dayjs(date).month() + 1}月
              </div>
            </div>
            <button className="datepicker__button" onClick={increaseMonth}>
              {">"}
            </button>
          </div>
        )}
        {...props}
        preventOpenOnFocus // フォーカス時にカレンダーを自動で開かない
        onFocus={(e) => e.target.blur()} // フォーカス時に入力を無効にする
      />
    </div>
  );
};
