import { Button, List } from "antd";
import { Message, MessageStatus } from "../types/responses";
import { useMemo } from "react";
import dayjs from "dayjs";
import cx from "classnames";

type HistoryProps = {
  data: Message[] | undefined;
  loading: boolean;
  onLoadMore: () => void;
};

const getDateFormat = (value: Date) => dayjs(value).format("DD/MM/YYYY HH:mm");

export const History = ({ data, loading, onLoadMore }: HistoryProps) => {
  const dataSource = useMemo(() => {
    return (
      data?.reverse().map((message) => ({
        key: message.id,
        text: message.text,
        title: (
          <div className="flex justify-between">
            <p className="font-bold">
              Created at:{" "}
              <span className="font-normal">
                {getDateFormat(message.createdAt)}
              </span>
            </p>
            {message.scheduledAt && (
              <p className="font-bold">
                Scheduled at:{" "}
                <span className="font-normal">
                  {getDateFormat(message.scheduledAt)}
                </span>
              </p>
            )}
            <div>
              <p
                className={cx(
                  "px-2 py-1 rounded-full text-white text-xs",
                  message.status === MessageStatus.FAILED && "bg-red-600",
                  message.status === MessageStatus.SENT && "bg-green-600",
                  message.status === MessageStatus.PARTIAL && "bg-orange-600",
                  message.status === MessageStatus.PENDING && "bg-gray-400"
                )}
              >
                {message.status.toLocaleUpperCase()}
              </p>
            </div>
          </div>
        ),
        descriptions: (
          <p className="text-black font-bold mb-0">
            Contacts:{" "}
            <span className="font-normal">
              {message.contacts
                .map((contact) => contact.name || contact.chatId)
                .join(", ")}
            </span>
          </p>
        ),
      })) ?? []
    );
  }, [data]);

  return (
    <div className="md:w-1/2">
      <List
        loadMore={
          <div
            style={{
              textAlign: "center",
              marginTop: 12,
              height: 32,
              lineHeight: "32px",
            }}
          >
            <Button onClick={onLoadMore}>Load more</Button>
          </div>
        }
        itemLayout="horizontal"
        dataSource={dataSource}
        loading={loading}
        renderItem={(item) => (
          <List.Item
            className="px-4 bg-slate-400 rounded-lg mb-2"
            key={item.key}
          >
            <List.Item.Meta
              title={item.title}
              description={item.descriptions}
            />
            {item.text}
          </List.Item>
        )}
      />
    </div>
  );
};
