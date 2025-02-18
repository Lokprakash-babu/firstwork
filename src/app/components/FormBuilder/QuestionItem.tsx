import { Button, Checkbox, Collapse, Input, Select } from "antd";
import { IFormElement } from "./index";
import { useState } from "react";

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

          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <Select
              className="flex-1"
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
            <Checkbox
              className="flex items-center w-[40%]"
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
