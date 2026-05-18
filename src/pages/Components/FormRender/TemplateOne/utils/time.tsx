export const calculateWorkingHours = (
  startTime: Date,
  endTime: Date
) => {

  // Create same-day dates
  const start = new Date();
  start.setHours(
    startTime.getHours(),
    startTime.getMinutes(),
    0,
    0
  );

  const end = new Date();
  end.setHours(
    endTime.getHours(),
    endTime.getMinutes(),
    0,
    0
  );

  // Handle next day
  if (end < start) {
    end.setDate(end.getDate() + 1);
  }

  // Difference in milliseconds
  const diffMs = end.getTime() - start.getTime();

  // Total minutes
  const totalMinutes = Math.floor(diffMs / 1000 / 60);

  // Hours & minutes
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}m`;
};

export const getDayType = (
  dateValue: string | Date
) => {

  const date = new Date(dateValue);

  const day = date.getDay();

  return day === 0 || day === 6
    ? "Weekend"
    : "Weekday";
};