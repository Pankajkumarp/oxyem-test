export const getWorkingDays = (start, end) => {
  const dates = [];
  let current = new Date(start);

  while (current <= new Date(end)) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

export const assignDatesToTasks = (tasks, start, end) => {
  const workingDays = getWorkingDays(start, end);
  const totalWeight = tasks.reduce((sum, t) => sum + t.weightage, 0);

  let index = 0;
  return tasks.map(task => {
    const days = Math.round((task.weightage / totalWeight) * workingDays.length);
    const taskStart = workingDays[index];
    const taskEnd = workingDays[Math.min(index + days - 1, workingDays.length - 1)];

    index += days;

    return {
      ...task,
      startDate: taskStart?.toISOString().split("T")[0] || "",
      endDate: taskEnd?.toISOString().split("T")[0] || ""
    };
  });
};
 export const createRowFromFields = (fields, overrides = {}, baseRow = {}) => {
    const row = {};

    fields.forEach(field => {
      if (overrides[field.name] !== undefined) {
        // 1️⃣ Template values win
        row[field.name] = overrides[field.name];
      } else if (baseRow[field.name] !== undefined) {
        // 2️⃣ Existing row/project values win
        row[field.name] = baseRow[field.name];
      } else {
        // 3️⃣ Field default
        row[field.name] = field.value ?? "";
      }
    });

    return row;
  };

  export const taskTemplateConfig = [
        {
          id: 1,
          templateName: "Development - Waterfall",
          value: "DEV_WATERFALL",
          description: "Agile-based development lifecycle with sprints",
          totalWeightage: 100,
          tasks: [
            { name: "Requirement", weightage: 10, taskCode: "e1a40844-448d-4c17-9815-a541511b89544" },
            { name: "Design", weightage: 10, taskCode: "afd643bf-af1f-4871-964b-4a45c00d4cd4" },
            { name: "Build and UT", weightage: 40, taskCode: "31fca2a3-6860-4bd4-9485-a99de5b8193b" },
            { name: "Code Review", weightage: 5, taskCode: "996d5659-9232-4ac8-9ea1-5ec3d1aac105" },
            { name: "SIT", weightage: 10, taskCode: "4fd875ef-fe33-4481-b92a-da1226a39800" },
            { name: "UAT", weightage: 20, taskCode: "b06e734a-c3e4-4b2b-acd1-2cd77d1051c3" },
            { name: "Go-Live", weightage: 5, taskCode: "afd643bf-af1f-4871-964b-4a45c00d4cd4" }
          ]
        },
        {
          id: 2,
          templateName: "BAU - Support",
          value: "BAU_SUPPORT",
          description: "Business-as-usual support and maintenance tasks",
          totalWeightage: 100,
          tasks: [
            { name: "Incident Management - Sev1", weightage: 30, taskCode: "e1a40844-448d-4c17-9815-a541511b89544" },
            { name: "Incident Management - Sev2", weightage: 25, taskCode: "afd643bf-af1f-4871-964b-4a45c00d4cd4" },
            { name: "Incident Management - Sev3", weightage: 20, taskCode: "4fd875ef-fe33-4481-b92a-da1226a39800" },
            { name: "Incident Management - Sev 4 and Sev 5", weightage: 15, taskCode: "b06e734a-c3e4-4b2b-acd1-2cd77d1051c3" },
            { name: "Minor Enhancements", weightage: 10, taskCode: "e1a40844-448d-4c17-9815-a541511b89e4" }
          ]
        }
      ];

      export const reactSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused
      ? 'var(--dropdownhoverbg)'
      : provided.borderColor,
    boxShadow: state.isFocused
      ? 'var(--dropdownbgshadow)'
      : provided.boxShadow,
    '&:hover': {
      borderColor: state.isFocused
        ? 'var(--dropdownhoverbg)'
        : provided.borderColor
    }
  }),

  indicatorSeparator: (provided) => ({
    ...provided,
    backgroundColor: 'var(--dropdownhoverbg)'
  }),

  option: (provided, state) => ({
    ...provided,
    padding: 'var(--dropdownpadding)',
    cursor: 'var(--dropdowncursorstyle)',
    backgroundColor:
      state.isFocused || state.isSelected
        ? 'var(--dropdownhoverbg)'
        : 'var(--dropdowntransparentcolor)',
    color: state.isSelected
      ? 'var(--dropdownselectcolor)'
      : 'var(--dropdowninheritcolor)',
    ':hover': {
      backgroundColor: 'var(--dropdownhoverbg)',
      color: 'var(--dropdownhovercolor)'
    }
  })
};
