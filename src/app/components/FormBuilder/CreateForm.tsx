"use client";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CreateForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const createForm = () => {
    setLoading(true);
    const formId = Date.now();
    const formIds = JSON.parse(localStorage.getItem("formIds") || "[]");
    formIds.push(formId);
    localStorage.setItem("formIds", JSON.stringify(formIds));
    localStorage.setItem(formId.toString(), JSON.stringify([]));

    setTimeout(() => {
      setLoading(false);
      router.push(`/form/builder/${formId}`);
    }, 1000); // Simulate a 1-second API delay
  };

  return (
    <Button type="primary" onClick={createForm} loading={loading}>
      Create Form
    </Button>
  );
};

export default CreateForm;
