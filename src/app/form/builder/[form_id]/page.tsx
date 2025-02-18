import FormBuilder from "@/app/components/FormBuilder";
const FormBuilderPage = async ({
  params,
}: {
  params: Promise<{ form_id: string }>;
}) => {
  const formId = (await params).form_id;
  return (
    <div className="flex w-full justify-center p-5">
      <FormBuilder formId={formId} />
    </div>
  );
};

export default FormBuilderPage;
