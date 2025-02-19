"use client";
import { useEffect, useState } from "react";
import QuestionItem from "./QuestionItem";
import { Button, Spin, Empty, Tooltip } from "antd";
import { useRouter } from "next/navigation";
import { fetchFormSchema } from "@/app/lib/fetchFormSchema";
import toast from "react-hot-toast";

export type TFormElementType = "text" | "number" | "select";
export interface IFormItemValidations {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
}
export interface IFormElement {
  id: number;
  label: string;
  type: TFormElementType;
  placeholder: string;
  validations?: IFormItemValidations;
  defaultValue?: string;
  options?: { label: string; value: string }[];
}

const FormBuilder = ({ formId }: { formId: string }) => {
  const [formSchema, setFormSchema] = useState<IFormElement[]>([]);
  const [errors, setErrors] = useState<{ [key: number]: string }>({});
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [previewLoading, setPreviewLoading] = useState<boolean>(false);
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);

  // Add a new question to the form schema
  const addQuestion = () => {
    const questionId = Date.now();
    setFormSchema([
      ...formSchema,
      { id: questionId, label: "", type: "text", placeholder: "" },
    ]);
    setActiveQuestion(questionId);
  };

  // Delete a question from the form schema
  const deleteQuestion = (id: number) => {
    setFormSchema(formSchema.filter((question) => question.id !== id));
    setActiveQuestion(
      formSchema.length ? formSchema[formSchema.length - 1].id : null
    );
  };

  // Save the form schema to local storage
  const saveQuestionToLocalStorage = () => {
    localStorage.setItem(formId, JSON.stringify(formSchema));
  };

  // Save the form schema with a delay
  const saveQuestion = () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        saveQuestionToLocalStorage();
        resolve();
      }, 1000);
    });
  };

  // Handle the preview action
  const handlePreview = async (withRouting = true) => {
    setPreviewLoading(true);
    await saveQuestion();
    setPreviewLoading(false);
    if (withRouting) {
      router.push(`/form/preview/${formId}`);
    }
  };

  // Validate the form schema
  const validateFormSchema = () => {
    const newErrors: { [key: number]: string } = {};
    formSchema.forEach((question) => {
      if (!question.label) {
        newErrors[question.id] = "Label is required";
      }
      if (question.validations?.required && !question.defaultValue) {
        newErrors[question.id] = "This field is required";
      }
      if (
        question.type === "number" &&
        question.defaultValue &&
        question.validations?.min !== undefined &&
        parseFloat(question.defaultValue) < question.validations.min
      ) {
        newErrors[question.id] = `Minimum value is ${question.validations.min}`;
      }
      if (
        question.type === "number" &&
        question.defaultValue &&
        question.validations?.max !== undefined &&
        parseFloat(question.defaultValue) > question.validations.max
      ) {
        newErrors[question.id] = `Maximum value is ${question.validations.max}`;
      }
      if (
        question.type === "text" &&
        question.defaultValue &&
        question.validations?.minLength !== undefined &&
        question.defaultValue.length < question.validations.minLength
      ) {
        newErrors[
          question.id
        ] = `Minimum length is ${question.validations.minLength}`;
      }
      if (
        question.type === "text" &&
        question.defaultValue &&
        question.validations?.maxLength !== undefined &&
        question.defaultValue.length > question.validations.maxLength
      ) {
        newErrors[
          question.id
        ] = `Maximum length is ${question.validations.maxLength}`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fetch the form schema on component mount
  useEffect(() => {
    fetchFormSchema(formId).then((form) => {
      setFormSchema(form);
      setLoading(false);
    });
  }, [formId]);

  // Validate the form schema whenever it changes
  useEffect(() => {
    validateFormSchema();
  }, [formSchema]);

  // Auto-save the form schema with a debounce
  useEffect(() => {
    const handleAutoSave = () => {
      saveQuestionToLocalStorage();
      toast.success("Form saved successfully");
    };

    const debounceTimeout = setTimeout(handleAutoSave, 5000); // 5-second debounce period

    return () => clearTimeout(debounceTimeout);
  }, [formSchema]);

  if (loading) {
    return <Spin />;
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="min-w-[80%] lg:min-w-[50%]">
      <div className="flex justify-between">
        <Button type="primary" onClick={addQuestion} className="mb-4">
          Add Question
        </Button>

        <div className="mb-4">
          <Tooltip
            title={
              hasErrors
                ? "One of your form fields is invalid or label is missing. Ensure that form fields are valid and label is provided for all the fields."
                : ""
            }
          >
            <Button
              type="text"
              onClick={() => {
                if (validateFormSchema()) {
                  handlePreview();
                }
              }}
              loading={previewLoading}
              className="font-semibold text-blue-800"
              disabled={previewLoading || hasErrors}
            >
              Preview
            </Button>
          </Tooltip>
          <Button
            type="text"
            onClick={() => {
              handlePreview(false);
              router.push("/form");
            }}
            disabled={previewLoading}
          >
            Back to Form
          </Button>
        </div>
      </div>
      <div className="min-w-1/2">
        {formSchema.length === 0 ? (
          <Empty description="No questions added yet">
            <Button type="primary" onClick={addQuestion}>
              Add Question
            </Button>
          </Empty>
        ) : (
          formSchema.map((question) => (
            <QuestionItem
              key={question.id}
              deleteQuestion={deleteQuestion}
              formSchema={formSchema}
              question={question}
              setFormSchema={setFormSchema}
              isQuestionActive={activeQuestion === question.id}
              setActiveQuestion={setActiveQuestion}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default FormBuilder;
