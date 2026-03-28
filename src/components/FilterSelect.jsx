function FilterSelect({
  label,
  value,
  onChange,
  options,
  includeAll = true
}) {
  return (
    <div className="filter-item">
      <label>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}>
        {includeAll && <option value="Barchasi">Barchasi</option>}
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FilterSelect;