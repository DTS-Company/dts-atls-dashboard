import Input from "@shared/ui/form/InputField";
import TextArea from "@shared/ui/form/TextArea";
import Checkbox from "@shared/ui/form/Checkbox";
import Select from "@shared/ui/form/Select";
import Label from "@shared/ui/form/Label";
import { useLocalization } from "@shared/lib/useLocalization";
import {
  TAtlsField,
  TAtlsFormValue,
  TAtlsFormValues,
  getEnumLabel,
  getFieldLabel,
  resolveSource,
  AtlsReferenceSelect,
} from "@entities/reference";

type Props = {
  field: TAtlsField;
  value: TAtlsFormValue;
  /** Все значения формы: источник ссылки может зависеть от других полей */
  values: TAtlsFormValues;
  onChange: (value: TAtlsFormValue) => void;
};

const AtlsFieldInput = ({ field, value, values, onChange }: Props) => {
  const { t } = useLocalization();
  const label = getFieldLabel(field, t);

  if (field.type === "boolean") {
    return (
      <div className="flex items-end pb-3">
        <Checkbox
          label={label}
          checked={value === true}
          onChange={(checked) => onChange(checked)}
        />
      </div>
    );
  }

  const text = String(value);

  const renderControl = () => {
    switch (field.type) {
      case "textarea":
        return <TextArea rows={3} value={text} onChange={onChange} />;
      case "datetime":
        return (
          <Input
            type="datetime-local"
            value={text}
            onChange={(e) => onChange(e.target.value)}
          />
        );
      case "reference": {
        const source = resolveSource(field.source, values);
        if (!source) {
          return (
            <Select
              value=""
              onChange={() => undefined}
              options={[{ value: "", label: t("atls.common.choose_first") }]}
            />
          );
        }
        return (
          <AtlsReferenceSelect
            key={source.url}
            source={source}
            value={text}
            onChange={onChange}
          />
        );
      }
      case "enum":
        return (
          <Select
            value={text}
            onChange={onChange}
            options={[
              { value: "", label: t("atls.common.not_selected") },
              ...field.values.map((option) => ({
                value: option,
                label: getEnumLabel(field, option, t),
              })),
            ]}
          />
        );
      default:
        return (
          <Input
            type="text"
            value={text}
            onChange={(e) => onChange(e.target.value)}
          />
        );
    }
  };

  return (
    <div className={field.type === "textarea" ? "sm:col-span-2" : undefined}>
      <Label>
        {label}
        {field.required && <span className="text-error-500"> *</span>}
      </Label>
      {renderControl()}
    </div>
  );
};

export default AtlsFieldInput;
