import { Form, Input } from "antd";

import { Rule } from "antd/lib/form";
import { IFormItemValidations } from "../FormBuilder";

const convertValidationsToArray = (
  validations: IFormItemValidations
): Rule[] => {
  const validationArray: Rule[] = [];

  if (validations.required !== undefined) {
    validationArray.push({
      required: validations.required,
      message: "This field is required",
    });
  }
  if (validations.min !== undefined) {
    validationArray.push({
      type: "number",
      min: validations.min,
      message: `Minimum value is ${validations.min}`,
    });
  }
  if (validations.max !== undefined) {
    validationArray.push({
      type: "number",
      max: validations.max,
      message: `Maximum value is ${validations.max}`,
    });
  }
  if (validations.minLength !== undefined) {
    validationArray.push({
      min: validations.minLength,
      message: `Minimum length is ${validations.minLength}`,
    });
  }
  if (validations.maxLength !== undefined) {
    validationArray.push({
      max: validations.maxLength,
      message: `Maximum length is ${validations.maxLength}`,
    });
  }

  return validationArray;
};

interface IFormItem {
  label: string;
  placeholder: string;
  validations?: IFormItemValidations;
}
const FormItem = ({ label, placeholder, validations = {} }: IFormItem) => {
  return (
    <Form.Item
      name={label}
      rules={convertValidationsToArray(validations)}
      label={label}
    >
      <Input placeholder={placeholder} />
    </Form.Item>
  );
};

export default FormItem;
