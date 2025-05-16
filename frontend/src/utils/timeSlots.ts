import { addMinutes, format, parse } from "date-fns";

export const generateTimeSlots = (
  openingTime: string,
  closingTime: string
): string[] => {
  const slots: string[] = [];

  const start = parse(openingTime, "HH:mm", new Date());
  const end = parse(closingTime, "HH:mm", new Date());

  let current = start;

  while (current < end) {
    slots.push(format(current, "HH:mm"));
    current = addMinutes(current, 30);
  }

  return slots;
};
