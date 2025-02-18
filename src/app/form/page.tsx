import CreateForm from "../components/FormBuilder/CreateForm";
import FormList from "../components/FormList";

const FormPage = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex w-full justify-center p-5">
        <CreateForm />
      </div>
      <FormList />
    </div>
  );
};

export default FormPage;
