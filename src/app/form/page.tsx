import CreateForm from "../components/FormBuilder/CreateForm";

const FormPage = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex w-full justify-center p-5">
        <CreateForm />
      </div>
      <p>Coming soon! Table to show the list of created forms</p>
    </div>
  );
};

export default FormPage;
