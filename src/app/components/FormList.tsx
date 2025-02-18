"use client";
import { useEffect, useState } from "react";
import { Table, Button, Empty } from "antd";
import { useRouter } from "next/navigation";

interface Form {
  id: number;
  name: string;
  createdAt: string;
}

const FormList = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const router = useRouter();

  useEffect(() => {
    const formIds = JSON.parse(localStorage.getItem("formIds") || "[]");
    const formList = formIds.map((id: number) => ({
      id,
      name: `Form ${id}`,
      createdAt: new Date(id).toLocaleString(),
    }));
    setForms(formList);
  }, []);

  const columns = [
    {
      title: "Form Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record: Form) => (
        <div>
          <Button
            type="link"
            onClick={() => {
              router.push(`/form/builder/${record.id}`);
            }}
          >
            Edit
          </Button>
          <Button
            type="link"
            onClick={() => {
              router.push(`/form/preview/${record.id}`);
            }}
          >
            Preview
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full p-5">
      {forms.length === 0 ? (
        <Empty description="No forms available"></Empty>
      ) : (
        <Table dataSource={forms} columns={columns} rowKey="id" />
      )}
    </div>
  );
};

export default FormList;
