import { Form, Input, Select } from "antd";
import { Rule } from "antd/lib/form";
import { IFormItemValidations, TFormElementType } from "../FormBuilder";

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

  return validationArray;
};

interface IFormItem {
  label: string;
  placeholder: string;
  validations?: IFormItemValidations;
  type: TFormElementType;
  options?: { label: string; value: string }[];
  defaultValue?: string;
}

const FormItem = ({
  label,
  placeholder,
  validations = {},
  type,
  options = [],
  defaultValue = "",
}: IFormItem) => {
  const renderFormItem = () => {
    switch (type) {
      case "text":
        return (
          <Input
            placeholder={placeholder}
            defaultValue={defaultValue}
            minLength={validations.minLength}
            maxLength={validations.maxLength}
          />
        );
      case "number":
        return (
          <Input
            type="number"
            placeholder={placeholder}
            defaultValue={defaultValue}
            min={validations.min}
            max={validations.max}
          />
        );
      case "select":
        return (
          <Select placeholder={placeholder} defaultValue={defaultValue}>
            {options.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        );
      default:
        return <Input placeholder={placeholder} defaultValue={defaultValue} />;
    }
  };

  return (
    <Form.Item
      name={label}
      rules={convertValidationsToArray(validations)}
      label={label}
    >
      {renderFormItem()}
    </Form.Item>
  );
};

export default FormItem;
