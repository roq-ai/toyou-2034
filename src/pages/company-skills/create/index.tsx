import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createCompanySkill } from 'apiSdk/company-skills';
import { Error } from 'components/error';
import { companySkillValidationSchema } from 'validationSchema/company-skills';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { CompanyInterface } from 'interfaces/company';
import { SkillInterface } from 'interfaces/skill';
import { getCompanies } from 'apiSdk/companies';
import { getSkills } from 'apiSdk/skills';
import { CompanySkillInterface } from 'interfaces/company-skill';

function CompanySkillCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: CompanySkillInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createCompanySkill(values);
      resetForm();
      router.push('/company-skills');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<CompanySkillInterface>({
    initialValues: {
      company_id: (router.query.company_id as string) ?? null,
      skill_id: (router.query.skill_id as string) ?? null,
    },
    validationSchema: companySkillValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Company Skill
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <AsyncSelect<CompanyInterface>
            formik={formik}
            name={'company_id'}
            label={'Select Company'}
            placeholder={'Select Company'}
            fetcher={getCompanies}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <AsyncSelect<SkillInterface>
            formik={formik}
            name={'skill_id'}
            label={'Select Skill'}
            placeholder={'Select Skill'}
            fetcher={getSkills}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'company_skill',
    operation: AccessOperationEnum.CREATE,
  }),
)(CompanySkillCreatePage);
