import { FormState } from "@/types/RestaurantForm";

export function sanitizeFormData(form: FormState) {
  const sanitized = {
    ...form,
    name: form.name.trim(),
    description: form.description.trim(),
    address: form.address.trim(),
    email: form.email.trim().toLowerCase(),
    phone: form.phone.trim().replace(/\s+/g, ""),
    inst_url: form.inst_url.trim(),
    cuisine: form.cuisine.trim(),
    rating: String(form.rating).trim(),
    operating_hours: Object.fromEntries(
      Object.entries(form.operating_hours).map(([day, time]) => [
        day,
        `${time.open.trim()} - ${time.close.trim()}`,
      ])
    ),
  };

  return sanitized;
}
