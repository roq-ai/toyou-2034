import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Text,
  Button,
  Link,
  IconButton,
  Flex,
  Center,
} from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getCompanySkills, deleteCompanySkillById } from 'apiSdk/company-skills';
import { CompanySkillInterface } from 'interfaces/company-skill';
import { Error } from 'components/error';
import {
  AccessOperationEnum,
  AccessServiceEnum,
  useAuthorizationApi,
  requireNextAuth,
  withAuthorization,
} from '@roq/nextjs';
import { useRouter } from 'next/router';
import { FiTrash, FiEdit2 } from 'react-icons/fi';
import { compose } from 'lib/compose';
import { AccessInfo } from 'components/access-info';

function CompanySkillListPage() {
  const { hasAccess } = useAuthorizationApi();
  const { data, error, isLoading, mutate } = useSWR<CompanySkillInterface[]>(
    () => '/company-skills',
    () =>
      getCompanySkills({
        relations: ['company', 'skill'],
      }),
  );
  const router = useRouter();
  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteCompanySkillById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const handleView = (id: string) => {
    if (hasAccess('company_skill', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)) {
      router.push(`/company-skills/view/${id}`);
    }
  };

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <AccessInfo />
        <Flex justifyContent="space-between" mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Company Skill
          </Text>
          {hasAccess('company_skill', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
            <NextLink href={`/company-skills/create`} passHref legacyBehavior>
              <Button onClick={(e) => e.stopPropagation()} colorScheme="blue" mr="4" as="a">
                Create
              </Button>
            </NextLink>
          )}
        </Flex>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {deleteError && (
          <Box mb={4}>
            <Error error={deleteError} />{' '}
          </Box>
        )}
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  {hasAccess('company', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>company</Th>}
                  {hasAccess('skill', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>skill</Th>}

                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr cursor="pointer" onClick={() => handleView(record.id)} key={record.id}>
                    {hasAccess('company', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link as={NextLink} href={`/companies/view/${record.company?.id}`}>
                          {record.company?.name}
                        </Link>
                      </Td>
                    )}
                    {hasAccess('skill', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link as={NextLink} href={`/skills/view/${record.skill?.id}`}>
                          {record.skill?.name}
                        </Link>
                      </Td>
                    )}

                    <Td>
                      {hasAccess('company_skill', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                        <NextLink href={`/company-skills/edit/${record.id}`} passHref legacyBehavior>
                          <Button
                            onClick={(e) => e.stopPropagation()}
                            mr={2}
                            as="a"
                            variant="outline"
                            colorScheme="blue"
                            leftIcon={<FiEdit2 />}
                          >
                            Edit
                          </Button>
                        </NextLink>
                      )}
                      {hasAccess('company_skill', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(record.id);
                          }}
                          colorScheme="red"
                          variant="outline"
                          aria-label="edit"
                          icon={<FiTrash />}
                        />
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
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
    operation: AccessOperationEnum.READ,
  }),
)(CompanySkillListPage);
