import { Button, Checkbox, Collapse, Input, Select } from "antd";
import { IFormElement } from "./index";
import { useState, useEffect } from "react";

interface QuestionItemProps {
  question: IFormElement;
  formSchema: IFormElement[];
  setFormSchema: React.Dispatch<React.SetStateAction<IFormElement[]>>;
  deleteQuestion: (id: number) => void;
  isQuestionActive: boolean;
  setActiveQuestion: React.Dispatch<React.SetStateAction<number | null>>;
}

const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
  formSchema,
  setFormSchema,
  deleteQuestion,
  isQuestionActive,
  setActiveQuestion,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [newOption, setNewOption] = useState<string>("");
  const [optionError, setOptionError] = useState<string | null>(null);
  const [defaultValueError, setDefaultValueError] = useState<string | null>(
    null
  );

  const validateMinMax = (min: number, max: number) => {
    if (!max) {
      setError("");
      return;
    }
    if (min > max) {
      setError("Max value should be greater than Min value");
    } else {
      setError(null);
    }
  };

  const validateMinMaxLength = (minLength: number, maxLength: number) => {
    if (!maxLength) {
      setError("");
      return;
    }
    if (minLength > maxLength) {
      setError("Max Length should be greater than Min Length");
    } else {
      setError(null);
    }
  };

  const validateDefaultValue = (value: string) => {
    if (!value) {
      setDefaultValueError("");
      return;
    }
    if (question.type === "number") {
      const defaultValueNumber = parseFloat(value);
      if (isNaN(defaultValueNumber)) {
        setDefaultValueError("Default value must be a number");
      } else if (
        (question.validations?.min !== undefined &&
          defaultValueNumber < question.validations.min) ||
        (question.validations?.max !== undefined &&
          defaultValueNumber > question.validations.max)
      ) {
        setDefaultValueError(
          `Default value must be between ${
            question.validations.min !== undefined
              ? question.validations.min
              : ""
          } and ${
            question.validations.max !== undefined
              ? question.validations.max
              : ""
          }`
        );
      } else {
        setDefaultValueError(null);
      }
    } else if (question.type === "text") {
      const defaultValueLength = value.length;

      if (
        (question.validations?.minLength !== undefined &&
          defaultValueLength < question.validations.minLength) ||
        (question.validations?.maxLength !== undefined &&
          defaultValueLength > question.validations.maxLength)
      ) {
        setDefaultValueError(
          `Default value length must be between ${
            question.validations.minLength !== undefined
              ? question.validations.minLength
              : ""
          } and ${
            question.validations.maxLength !== undefined
              ? question.validations.maxLength
              : ""
          }`
        );
      } else {
        setDefaultValueError(null);
      }
    } else if (question.type === "select") {
      const isValidDefault = question.options?.some(
        (option) => option.value === value
      );
      if (!isValidDefault) {
        setDefaultValueError("Default value must be one of the options");
      } else {
        setDefaultValueError(null);
      }
    }
  };

  useEffect(() => {
    validateDefaultValue(question.defaultValue || "");
  }, [
    question.defaultValue,
    question.type,
    question.validations,
    question.options,
  ]);

  const addOption = () => {
    if (newOption.trim() === "") {
      setOptionError("Option cannot be empty");
      return;
    }
    if (question.options?.some((option) => option.value === newOption)) {
      setOptionError("Option already exists");
      return;
    }
    setFormSchema(
      formSchema.map((q) =>
        q.id === question.id
          ? {
              ...q,
              options: [
                ...(q.options || []),
                { label: newOption, value: newOption },
              ],
            }
          : q
      )
    );
    setNewOption("");
    setOptionError(null);
  };

  const deleteOption = (optionValue: string) => {
    setFormSchema(
      formSchema.map((q) =>
        q.id === question.id
          ? {
              ...q,
              options: q.options?.filter(
                (option) => option.value !== optionValue
              ),
            }
          : q
      )
    );
  };

  const deleteButton = () => {
    return (
      <Button
        onClick={() => {
          deleteQuestion(question.id);
        }}
        color="danger"
        variant="link"
      >
        Delete
      </Button>
    );
  };

  const formFieldItems = [
    {
      key: question.id,
      label: question.label || "NA",
      children: (
        <div key={question.id} className="question-item">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <Input
              addonBefore={<>Label</>}
              className="flex-1"
              type="text"
              placeholder="Question Label"
              value={question.label}
              onChange={(e) => {
                const value = e.target.value;
                setFormSchema(
                  formSchema.map((q) =>
                    q.id === question.id ? { ...q, label: value } : q
                  )
                );
              }}
            />
            <Input
              addonBefore={<>Helper Text</>}
              type="text"
              placeholder="Helper Text"
              value={question.placeholder}
              onChange={(e) => {
                const value = e.target.value;
                setFormSchema(
                  formSchema.map((q) =>
                    q.id === question.id ? { ...q, placeholder: value } : q
                  )
                );
              }}
              className="flex-1"
            />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
            <div className="flex-1">
              <label>Type</label>
              <Select
                className="w-full"
                placeholder="Select a type"
                options={[
                  {
                    value: "text",
                    label: "Text",
                  },
                  { value: "number", label: "Number" },
                  { value: "select", label: "Select" },
                ]}
                value={question.type}
                onChange={(value) => {
                  setFormSchema(
                    formSchema.map((q) =>
                      q.id === question.id ? { ...q, type: value } : q
                    )
                  );
                }}
              ></Select>
            </div>
            <div className="flex items-center w-[40%]">
              <Checkbox
                onChange={(e) => {
                  const value = e.target.checked;
                  setFormSchema(
                    formSchema.map((q) =>
                      q.id === question.id
                        ? {
                            ...q,
                            validations: { ...q.validations, required: value },
                          }
                        : q
                    )
                  );
                }}
                checked={question.validations?.required}
              >
                <p>Required</p>
              </Checkbox>
            </div>
          </div>

          {question.type !== "select" && (
            <p className="font-bold mb-2">Validations</p>
          )}

          {question.type === "number" && (
            <div className="flex flex-col lg:flex-row  gap-4 mb-4">
              <Input
                addonBefore={<>Min</>}
                type="number"
                placeholder="Min"
                value={question.validations?.min || ""}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  setFormSchema(
                    formSchema.map((q) =>
                      q.id === question.id
                        ? {
                            ...q,
                            validations: { ...q.validations, min: value },
                          }
                        : q
                    )
                  );
                  validateMinMax(value, question.validations?.max || 0);
                }}
              />
              <Input
                addonBefore={<>Max</>}
                type="number"
                placeholder="Max"
                value={question.validations?.max || ""}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  setFormSchema(
                    formSchema.map((q) =>
                      q.id === question.id
                        ? {
                            ...q,
                            validations: { ...q.validations, max: value },
                          }
                        : q
                    )
                  );
                  validateMinMax(question.validations?.min || 0, value);
                }}
              />
            </div>
          )}
          {question.type === "text" && (
            <div className="flex flex-col lg:flex-row  gap-4 mb-4">
              <Input
                addonBefore={<>Min Length</>}
                type="number"
                placeholder="Min Length"
                value={question.validations?.minLength || ""}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  setFormSchema(
                    formSchema.map((q) =>
                      q.id === question.id
                        ? {
                            ...q,
                            validations: { ...q.validations, minLength: value },
                          }
                        : q
                    )
                  );
                  validateMinMaxLength(
                    value,
                    question.validations?.maxLength || 0
                  );
                }}
              />
              <Input
                addonBefore={<>Max Length</>}
                type="number"
                placeholder="Max Length"
                value={question.validations?.maxLength || ""}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  setFormSchema(
                    formSchema.map((q) =>
                      q.id === question.id
                        ? {
                            ...q,
                            validations: { ...q.validations, maxLength: value },
                          }
                        : q
                    )
                  );
                  validateMinMaxLength(
                    question.validations?.minLength || 0,
                    value
                  );
                }}
              />
            </div>
          )}
          {question.type === "select" && (
            <div className="flex flex-col gap-4 mb-4">
              <div className="flex gap-4">
                <Input
                  type="text"
                  placeholder="Option"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                />
                <Button type="primary" onClick={addOption}>
                  Add Option
                </Button>
              </div>
              {optionError && <p className="text-red-500">{optionError}</p>}
              <div>
                {question.options?.map((option) => (
                  <div
                    key={option.value}
                    className="flex justify-between items-center mb-2"
                  >
                    <span>{option.label}</span>
                    <Button
                      type="link"
                      onClick={() => deleteOption(option.value)}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <Input
              addonBefore={<>Default Value</>}
              type={question.type === "number" ? "number" : "text"}
              placeholder="Default Value"
              value={question.defaultValue || ""}
              onChange={(e) => {
                const value = e.target.value;
                setFormSchema(
                  formSchema.map((q) =>
                    q.id === question.id ? { ...q, defaultValue: value } : q
                  )
                );
                validateDefaultValue(value);
              }}
              className="flex-1"
            />
            {defaultValueError && (
              <p className="text-red-500">{defaultValueError}</p>
            )}
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      ),
      extra: deleteButton(),
    },
  ];
  return (
    <Collapse
      items={formFieldItems}
      defaultActiveKey={question.id}
      onChange={(clickedQuestionId) => {
        setActiveQuestion(+clickedQuestionId[1]);
      }}
      activeKey={isQuestionActive ? question.id : ""}
      className="mb-4 w-full"
    ></Collapse>
  );
};

export default QuestionItem;
