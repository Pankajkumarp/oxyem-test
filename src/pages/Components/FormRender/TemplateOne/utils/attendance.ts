import { axiosJWT } from "../../../../Auth/AddAuthorization";
import moment from 'moment-timezone';

export const convertTimeStringToDate = (
  timeString: string
): Date | null => {

  if (!timeString?.trim()) {
    return null;
  }

  const today = new Date();

  const match = timeString.match(
    /(\d+):(\d+)\s*(AM|PM)/i
  );

  if (!match) {
    return null;
  }

  const [, hours, minutes, modifier] = match;

  let hrs = parseInt(hours, 10);

  if (
    modifier.toUpperCase() === "PM" &&
    hrs !== 12
  ) {
    hrs += 12;
  }

  if (
    modifier.toUpperCase() === "AM" &&
    hrs === 12
  ) {
    hrs = 0;
  }

  today.setHours(
    hrs,
    parseInt(minutes, 10),
    0,
    0
  );

  return today;
};

interface FetchAttendanceParams {
  idEmployee: string;
  attendancedate: string;
}
const convertUtcToLocalTime = (
  utcDateTime: string,
  timeZone: string
) => {
  if (!utcDateTime) return null;

  try {
    return moment
      .utc(utcDateTime)
      .tz(timeZone)
      .toDate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
};
const getCurrentTimeZone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};
export const fetchEmployeeAttendance = async ({
  idEmployee,
  attendancedate,
}: FetchAttendanceParams) => {
  const timeZone = getCurrentTimeZone();
  const apiUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL;

  try {

    const response = await axiosJWT.get(
      `${apiUrl}/attendance/getEmpAttendanceByDate`,
      {
        params: {
          idEmployee,
          date: attendancedate,
        },
      }
    );

    if (
      response.status === 200 &&
      response.data.data
    ) {

      const infoGet = response.data.data;
      return {

        startTime: infoGet?.checkIn
          ? convertUtcToLocalTime(infoGet?.checkIn, timeZone)
          : null,

        endTime: infoGet?.checkOut
          ?  convertUtcToLocalTime(infoGet?.checkOut, timeZone)
          : null,
totalHours: infoGet?.totalHours
          ? infoGet?.totalHours
          : null,
          remarks:infoGet?.remarks
          ? infoGet?.remarks
          : null,
          reason:infoGet?.reason
          ? infoGet?.reason
          : null,
        rawData: infoGet,
      };
    }

    return null;

  } catch (error) {

    console.error(
      "Error fetching attendance:",
      error
    );

    return null;
  }
};