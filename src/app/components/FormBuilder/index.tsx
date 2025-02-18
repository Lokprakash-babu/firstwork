"use client";
import { useEffect, useState } from "react";
import QuestionItem from "./QuestionItem";
import { Button, Spin } from "antd";
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
}
const FormBuilder = ({ formId }: { formId: string }) => {
  const [formSchema, setFormSchema] = useState<IFormElement[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [previewLoading, setPreviewLoading] = useState<boolean>(false);
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const addQuestion = () => {
    const questionId = Date.now();
    setFormSchema([
      ...formSchema,

      { id: questionId, label: "", type: "text", placeholder: "" },
    ]);
    setActiveQuestion(questionId);
  };

  const deleteQuestion = (id: number) => {
    setFormSchema(formSchema.filter((question) => question.id !== id));
    setActiveQuestion(
      formSchema.length ? formSchema[formSchema.length - 1].id : null
    );
  };

  const saveQuestionToLocalStorage = () => {
    localStorage.setItem(formId, JSON.stringify(formSchema));
  };

  const saveQuestion = () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        saveQuestionToLocalStorage();
        resolve();
      }, 1000);
    });
  };

  const handlePreview = async (withRouting = true) => {
    setPreviewLoading(true);
    await saveQuestion();
    setPreviewLoading(false);
    if (withRouting) {
      router.push(`/form/preview/${formId}`);
    }
  };

  useEffect(() => {
    fetchFormSchema(formId).then((form) => {
      setFormSchema(form);
      setLoading(false);
    });
  }, []);

  useEffect(
    function autoSave() {
      const interval = setInterval(() => {
        saveQuestionToLocalStorage();
        toast.success("Form saved successfully");
      }, 10000);

      return () => clearInterval(interval);
    },
    [formSchema]
  );

  if (loading) {
    return <Spin />;
  }
  return (
    <div className="min-w-[80%] lg:min-w-[50%]">
      <div className="flex justify-between">
        <Button type="primary" onClick={addQuestion} className="mb-4">
          Add Question
        </Button>

        <div className="mb-4">
          <Button
            type="text"
            onClick={() => handlePreview()}
            loading={previewLoading}
            className="font-semibold text-blue-800"
            disabled={previewLoading}
          >
            Preview
          </Button>
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
        {formSchema.map((question) => (
          <QuestionItem
            key={question.id}
            deleteQuestion={deleteQuestion}
            formSchema={formSchema}
            question={question}
            setFormSchema={setFormSchema}
            isQuestionActive={activeQuestion === question.id}
            setActiveQuestion={setActiveQuestion}
          />
        ))}
      </div>
    </div>
  );
};

export default FormBuilder;
