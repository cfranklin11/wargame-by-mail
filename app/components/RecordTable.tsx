import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

type RecordItem = Record<string, string | number> & { id: number };
interface Column {
  key: string;
  label: string;
}
interface Props {
  columns: Column[];
  records: RecordItem[];
  buttons?: ((id: number) => JSX.Element)[];
}

export default function RecordTable({ columns, records, buttons }: Props) {
  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            {columns.map(({ key, label }) => (
              <Th key={key}>{label}</Th>
            ))}
            {buttons?.map((_, idx) => <Th key={idx}></Th>)}
          </Tr>
        </Thead>
        <Tbody>
          {records.map((record) => (
            <Tr key={record.id}>
              {columns.map(({ key }) => (
                <Td key={key}>{record[key]}</Td>
              ))}
              {buttons?.map((button, idx) => (
                <Td key={idx}>{button(record.id)}</Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
