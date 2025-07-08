import useFetch from "use-http";
import { MessagesResponse } from "../types/responses";
import { FormMessage } from "./Form";
import { History } from "./History";
import { API_URL } from "../constants/urls";
import { useState } from "react";

const defaultTake = 10;
const defaultSkip = 0;

export const Logged = () => {
  const [skip, setSkip] = useState(defaultSkip);

  const {
    loading,
    data: response,
    get,
  } = useFetch<MessagesResponse>(
    `${API_URL}/messages?skip=${skip}&take=${defaultTake}`,
    {},
    [skip]
  );

  const handleLoadMore = () => {
    setSkip((prev) => prev + defaultTake);
  };

  const refetchMessages = () => {
    get(`&retry=${Math.random()}`);
  };

  const handleMessageSent = () => {
    setSkip(defaultSkip);
    refetchMessages();
  };

  return (
    <div className="w-full flex gap-8 justify-center flex-col md:flex-row">
      <FormMessage onMessageSent={handleMessageSent} />
      <History
        data={response?.messages || []}
        loading={loading}
        onDeleteMessage={refetchMessages}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
};
