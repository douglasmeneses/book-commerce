import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

export const dateFormater = (date: string | Date) => {
  const data = dayjs(date).format("DD [de] MMMM [de] YYYY");
  return data;
};
