"use client";
import { useEffect, useState } from "react";
import { IFormElement } from "../FormBuilder";
import Form from "antd/lib/form";
import FormItem from "./FormItem";
import { Button, Empty, Spin } from "antd";
import { useRouter } from "next/navigation";
import { fetchFormSchema } from "@/app/lib/fetchFormSchema";
import toast from "react-hot-toast";

const FormRenderer = ({ formId }: { formId: string }) => {
  const [form] = Form.useForm();
  const [formField, setFormField] = useState<IFormElement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();
  useEffect(() => {
    setLoading(true);
    fetchFormSchema(formId).then((form) => {
      setFormField(form);
      setLoading(false);
    });
  }, [formId]);

  if (loading) {
    return <Spin />;
  }
  return (
    <div className="min-w-[40%]">
      <div className="flex justify-between mb-5">
        <Button
          onClick={() => {
            router.push(`/form/builder/${formId}`);
          }}
        >
          Edit this Form
        </Button>
        <Button
          onClick={() => {
            router.push("/form");
          }}
        >
          Back to Form
        </Button>
      </div>
      {formField.length === 0 ? (
        <Empty description="Oh No! Your form is empty" />
      ) : (
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          validateTrigger="onBlur"
          onFinish={() => {
            toast.success("Form submitted successfully", {
              position: "top-right",
            });
          }}
        >
          {formField.map((field: IFormElement) => {
            return <FormItem {...field} key={field.id} />;
          })}
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default FormRenderer;
