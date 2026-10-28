const handleSearch = ({
  event,
  externalOnSearch,
  initialOptions,
  setCurrentOptions,
  setSearchTerm
}) => {
  setSearchTerm(event.target.value);
  if (externalOnSearch) {
    externalOnSearch(event);
  } else {
    const options = [...initialOptions];
    const searchTerms = event.target.value.trim().split(",").filter((item) => item !== "");
    if (searchTerms.length > 0) {
      const searchResults = options.filter(
        (option) => searchTerms.some(
          (term) => option.label.toString().toLowerCase().includes(term.toLowerCase().trim())
        )
      );
      setCurrentOptions([...searchResults]);
    } else {
      setCurrentOptions(initialOptions);
    }
  }
};
const handleSelectAllWhenCompLoads = ({
  currentOptions,
  selectedOptions,
  setSelectedOptions
}) => {
  const restCurrentOptions = currentOptions.filter(
    (option) => !selectedOptions.find(
      (selectedOption) => selectedOption.label === option.label && option.value === selectedOption.value
    )
  );
  setSelectedOptions([...selectedOptions, ...restCurrentOptions]);
};
const handleDropdownClose = ({
  externalOnDropdownClose,
  setCurrentOptions,
  initialOptions,
  currentOptions,
  setIsOpen,
  onBlur,
  event
}) => {
  setIsOpen(false);
  if (onBlur && event) {
    onBlur(event);
  }
  if (externalOnDropdownClose) {
    externalOnDropdownClose();
  } else {
    setCurrentOptions(initialOptions.length > 0 ? initialOptions : currentOptions);
  }
};
const handleDropdownOpen = ({
  externalOnDropdownOpen,
  isOpen,
  setIsOpen
}) => {
  if (externalOnDropdownOpen) {
    externalOnDropdownOpen();
    setIsOpen(!isOpen);
  } else {
    setIsOpen(!isOpen);
  }
};
const getPlaceholder = (isMulti, selectedOptions, placeholder, customPlaceholderAfterSelect = null, selectionLabels = {}, t = (key) => key === "select.selectedLabel" ? "Selected" : key) => {
  var _a;
  if (!isMulti && Object.entries(selectedOptions ?? {}).length > 0) {
    const single = selectedOptions;
    return typeof single.value !== "undefined" ? single.label : placeholder ?? "";
  } else if (isMulti && Array.isArray(selectedOptions) && selectedOptions.length > 0) {
    return selectedOptions.length === 1 ? ((_a = selectedOptions[0]) == null ? void 0 : _a.label) ?? placeholder ?? "" : `${selectionLabels.selected ?? t("select.selectedLabel")} (${customPlaceholderAfterSelect ?? selectedOptions.length})`;
  }
  return placeholder ?? "";
};
const flattenOptions = (options) => {
  if (!options || !Array.isArray(options)) return [];
  return options.reduce((flatOptions, option) => {
    if (option.options) {
      return [...flatOptions, ...option.options];
    }
    return [...flatOptions, option];
  }, []);
};
export {
  flattenOptions,
  getPlaceholder,
  handleDropdownClose,
  handleDropdownOpen,
  handleSearch,
  handleSelectAllWhenCompLoads
};
