import Select from 'react-select';
import DatePicker from "react-datepicker";

const SkillSection = ({
  title,
  sectionKey,
  items,
  fields,
  handleArrayChange,
  addSectionItem,
  removeSectionItem,
}) => (
  <div className="space-y-4 border border-gray-300 p-6 shadow-sm rounded-lg">
    <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full gap-4 mt-2"> */}
    {items.map((item, index) => (
      <div
        key={index}
        className="border flex  gap-2 border-gray-200 p-4 rounded-lg shadow-sm space-y-2 relative"
      >
        {fields.map((field) =>
          field.type === "date" || field.name === "startDate" || field.name === "endDate" ? (
            <div key={field.name}>
              <DatePicker
                selected={item[field.name] ? item[field.name] : null}
                onChange={(date) => {
                  handleArrayChange(index, field.name, sectionKey, date);
                }}
                dateFormat="dd-MM-yyyy"
                placeholderText={field.label || field.name}
                className={`input border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#4DC3AB]`}
                style={{ height: "48px" }}
              />
            </div>
          ) : field.type === 'textarea' ? (
            <textarea
              key={field.name}
              placeholder={field.label || field.name}
              value={item[field.name] || ''}
              onChange={e =>
                handleArrayChange(index, field.name, sectionKey, e.target.value)
              }
              className='input border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#4DC3AB] resize-none'
              rows={2}
            />
          ) : (
            <input
              key={field.name}
              type={field.type || "text"}
              placeholder={field.label || field.name}
              value={item[field.name] || ""}
              onChange={(e) =>
                handleArrayChange(index, field.name, sectionKey, e.target.value)
              }
              className="input border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#4DC3AB]"
            />
          )
        )}
        <button
          type="button"
          onClick={() => removeSectionItem(index)}
          className="!mt-0 absolute right-[17px] top-[17px]"
        >
          <img src="/assets/DeleteButton.svg" alt="Delete" />
        </button>
      </div>
    ))}
    {/* </div> */}
    <button
      type="button"
      onClick={addSectionItem}
      className="text-sm font-semibold p-2 rounded-lg text-[#005151] border border-[#005151] bg-[#e5f2ea] hover:bg-[#d9ece1] px-4 py-2"
    >
      Add {title}
    </button>
  </div>
);

export default SkillSection;
