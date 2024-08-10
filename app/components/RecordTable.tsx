import {
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

type RecordItem = Record<string, string | number> & { id: number };
interface Column {
  key: string;
  label: string;
}
interface Props {
  columns: Column[];
  records: RecordItem[];
}

export default function RecordTable({ columns, records }: Props) {
  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            {columns.map(({ key, label }) => (
              <Th key={key}>{label}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {records.map((record) => (
            <Tr key={record.id}>
              {columns.map(({ key }) => (
                <Td key={key}>{record[key]}</Td>
              ))}
              <Td textAlign="right" paddingRight="0.25rem">
                <IconButton
                  aria-label="Edit"
                  icon={<EditIcon boxSize={{ base: 6 }} />}
                  padding="1rem"
                ></IconButton>
              </Td>
              <Td paddingLeft="0.25rem">
                <IconButton
                  aria-label="Delete"
                  icon={<DeleteIcon boxSize={{ base: 6 }} />}
                  padding="1rem"
                ></IconButton>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
