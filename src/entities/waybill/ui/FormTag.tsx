import { useLocalization } from "@shared/lib/useLocalization";

/** Форма путевого листа — метка «2-Б», «1-АД» */
const FormTag = ({ form }: { form?: string | null }) => {
  const { t } = useLocalization();
  if (!form) return <>—</>;
  return (
    <span className="inline-block whitespace-nowrap rounded-lg atls-gradient px-2.5 py-0.5 text-[11.5px] font-extrabold text-white">
      {t(`atls.enums.form.${form}`)}
    </span>
  );
};

export default FormTag;
