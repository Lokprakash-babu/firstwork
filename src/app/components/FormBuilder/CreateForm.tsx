"use client";
import { Button } from "antd";
import { useRouter } from "next/navigation";

const CreateForm = () => {
  const router = useRouter();
  const createForm = () => {
    const formId = Date.now();
    localStorage.setItem(formId.toString(), JSON.stringify([]));
    router.push(`/form/builder/${formId}`);
  };
  return (
    <Button type="primary" onClick={createForm}>
      Create Form
    </Button>
  );
};

export default CreateForm;
