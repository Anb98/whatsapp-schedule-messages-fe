import useFetch from "use-http";
import { Message, MessagesResponse } from "../types/responses";
import { FormMessage } from "./Form";
import { History } from "./History";
import { API_URL } from "../constants/urls";
import { useEffect, useState } from "react";

export const Logged = () => {
  const [data, setData] = useState<Message[]>([]);
  const { loading, data: response } = useFetch<MessagesResponse>(
    `${API_URL}/messages`,
    {},
    []
  );

  useEffect(() => {
    if (response) {
      setData(response.messages);
    }
  }, [response]);

  return (
    <div className="w-full flex gap-8 justify-center flex-col md:flex-row">
      <FormMessage
        onMessageSent={(item) => setData((prev) => [...prev, item])}
      />
      <History data={data} loading={loading} />
    </div>
  );
};
