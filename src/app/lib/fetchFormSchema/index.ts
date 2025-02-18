import { IFormElement } from "@/app/components/FormBuilder";

export const fetchFormSchema = (formId: string): Promise<IFormElement[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const form = JSON.parse(localStorage.getItem(formId) || "[]");
      resolve(form);
    }, 1000); // Simulate a 1-second delay
  });
};
