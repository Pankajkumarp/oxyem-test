export const getDateValidationRules = (field: any) => {
  const rules: any = {};

  if (!field?.validations) return rules;

  // REQUIRED
  const requiredRule = field.validations.find(
    (v: any) => v.type === "required"
  );
  if (requiredRule) {
    rules.required = requiredRule.message;
  }

  rules.validate = {};

  field.validations.forEach((validation: any) => {
    switch (validation.type) {
      /**
       * Allow today + N days
       */
      case "noFutureDate":
        rules.validate.noFutureDate = (value: string) => {
          if (!value) return true;

          const selected = new Date(value);
          selected.setHours(0, 0, 0, 0);

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const maxDate = new Date(today);
          const days = Number(validation.checkVlaue ?? 0);
          maxDate.setDate(today.getDate() + days);

          return selected <= maxDate || validation.message;
        };
        break;

      /**
       * Allow today - N days
       */
      case "maxPastDays":
        rules.validate.maxPastDays = (value: string) => {
          if (!value) return true;

          const selected = new Date(value);
          selected.setHours(0, 0, 0, 0);

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const minDate = new Date(today);
          const days = Number(validation.checkVlaue ?? 0);
          minDate.setDate(today.getDate() - days);

          return selected >= minDate || validation.message;
        };
        break;
    }
  });

  if (Object.keys(rules.validate).length === 0) {
    delete rules.validate;
  }

  return rules;
};
