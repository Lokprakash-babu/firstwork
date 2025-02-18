import FormRenderer from "@/app/components/FormRenderer";

const FormRendererPage = async ({
  params,
}: {
  params: Promise<{ form_id: string }>;
}) => {
  const formId = (await params).form_id;

  return (
    <div className="flex w-full justify-center p-5">
      <FormRenderer formId={formId} />
    </div>
  );
};

export default FormRendererPage;
