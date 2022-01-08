interface APHeaderStringNodeProps {
  label: string;
  value: string;
  maxLength?: number;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  restrict?: (value: string) => string | null;
}
const APHeaderStringNode: React.FC<APHeaderStringNodeProps> = ({
  label,
  value,
  maxLength,
  setValue,
  restrict,
}) => {
  const onNameChange: React.ChangeEventHandler<HTMLInputElement> = ({
    currentTarget,
  }) => {
    setValue(currentTarget.value);
  };

  return (
    <div className="setting">
      <b>{label}</b>:{" "}
      <input type="text" value={value} onChange={onNameChange} maxLength={maxLength} />
      {restrict ? restrict(value) : null}
    </div>
  );
};
export { APHeaderStringNode };
