export const getValidationRules = (field: any) => {
  const rules: any = {};

  if (!field?.validations) return rules;

  field.validations.forEach((validation: any) => {
    switch (validation.type) {
      case "required":
        rules.required = validation.message;
        break;

      // 🔢 NUMBER
      case "minimum":
        rules.min = {
          value: validation.checkVlaue,
          message: validation.message
        };
        break;

      case "maximum":
        rules.max = {
          value: validation.checkVlaue,
          message: validation.message
        };
        break;

      // 🔤 TEXT
      case "minLength":
        rules.minLength = {
          value: validation.checkVlaue,
          message: validation.message
        };
        break;

      case "maxLength":
        rules.maxLength = {
          value: validation.checkVlaue,
          message: validation.message
        };
        break;

      case "pattern":
        rules.pattern = {
          value: new RegExp(validation.checkVlaue),
          message: validation.message
        };
        break;

      // 📅 DATE VALIDATIONS
      case "noFutureDate":
        rules.validate = {
          ...rules.validate,
          noFutureDate: (value: string) => {
            if (!value) return true;
            const selected = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            return selected <= today || validation.message;
          }
        };
        break;

      case "maxPastDays":
        rules.validate = {
          ...rules.validate,
          maxPastDays: (value: string) => {
            if (!value) return true;

            const selected = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const diffTime = today.getTime() - selected.getTime();
            const diffDays = diffTime / (1000 * 60 * 60 * 24);

            return diffDays <= validation.checkVlaue || validation.message;
          }
        };
        break;
    }
  });

  return rules;
};
