import Switch from "./index";

const SwitchField = (props: {
  id: string;
  label: string;
  desc: string;
  placeholder?: string;
  mt: any;
  mb: any;
  onChange?: any;
  [x: string]: any;
}) => {
  const { id, label, onChange, desc, mt, mb, ...rest } = props;
  return (
    <div className={`flex justify-between ${mt} ${mb} items-center`}>
      <label
        htmlFor={id}
        className="max-w-[80%] hover:cursor-pointer lg:max-w-[65%]"
      >
        <h5 className="text-base font-bold text-navy-700 dark:text-white">
          {label}
        </h5>
        <p className={`text-base text-gray-600`}>{desc}</p>
      </label>
      <div>
        <Switch onChange={onChange} id={id} {...rest} />
      </div>
    </div>
  );
};

export default SwitchField;
