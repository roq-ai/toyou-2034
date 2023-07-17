import * as yup from 'yup';

export const companySkillValidationSchema = yup.object().shape({
  company_id: yup.string().nullable().required(),
  skill_id: yup.string().nullable().required(),
});
