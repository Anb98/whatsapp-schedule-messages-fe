import { Select } from "antd";
import { useMemo, useState } from "react";
import useFetch from "use-http";
import { ContactResponse } from "../types/responses";
import { API_URL } from "../constants/urls";

type ContactSelectProps = {
  onChange?: (value: string[]) => void;
};

const searchByName = (searchValue: string, name: string) =>
  !searchValue.length ||
  (name || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .includes(searchValue.toLowerCase().trim());

const searchByNumber = (searchValue: string, number: string) =>
  number.includes(searchValue);

export const ContactSelect = ({ onChange }: ContactSelectProps) => {
  const [searchValue, setSearchValue] = useState("");
  const { loading, data = { contacts: [] } } = useFetch<{
    contacts: ContactResponse[];
  }>(`${API_URL}/contacts`, {}, []);

  const options = useMemo(
    () => [
      {
        label: "Person",
        title: "Person",
        options: (data?.contacts || [])
          .filter(
            (item) =>
              item.type === "person" &&
              (searchByName(searchValue, item.name) ||
                searchByNumber(searchValue, item.chatId))
          )
          .map((item) => ({
            label: item.name,
            value: item.chatId,
          })),
      },
      {
        label: "Group",
        title: "Group",
        options: (data?.contacts || [])
          .filter(
            (item) =>
              item.type === "group" && searchByName(searchValue, item.name)
          )
          .map((item) => ({
            label: item.name,
            value: item.chatId,
          })),
      },
    ],
    [data?.contacts, searchValue]
  );

  return (
    <Select
      onChange={onChange}
      size="large"
      filterOption={false}
      loading={loading}
      mode="multiple"
      allowClear
      placeholder="Select a contact or group"
      onSearch={setSearchValue}
      options={options}
    />
  );
};
