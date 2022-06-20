interface TextInputConfig {
  prefix?: string;
  label: string;
  name: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}

export default function TextInput({
  prefix,
  name,
  label,
  placeholder,
  onChange,
  value,
}: TextInputConfig) {
  return (
    <>
      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm"> {prefix} </span>
          </div>
          <input
            type="text"
            name={name}
            // id="price"
            className="block w-full pl-7 pr-12 py-1 sm:text-sm border border-gray-300 rounded-md"
            placeholder={placeholder}
            onChange={onChange}
            value={value}
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            <label htmlFor="currency" className="sr-only">
              Currency
            </label>

            {/* <select
              id="currency"
              name="currency"
              className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
            >
              <option>USD</option>
              <option>CAD</option>
              <option>EUR</option>
            </select> */}
          </div>
        </div>
      </div>
    </>
  );
}
