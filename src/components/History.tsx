import { Button, List, Popconfirm } from "antd";
import { Message, MessageStatus } from "../types/responses";
import { useMemo } from "react";
import dayjs from "dayjs";
import cx from "classnames";
import { DeleteOutlined } from "@ant-design/icons";
import { API_URL } from "../constants/urls";
import useFetch from "use-http";

type HistoryProps = {
  data: Message[] | undefined;
  loading: boolean;
  onLoadMore: () => void;
  onDeleteMessage: () => void;
};

const getDateFormat = (value: Date) => dayjs(value).format("DD/MM/YYYY HH:mm");

export const History = ({
  data,
  loading,
  onLoadMore,
  onDeleteMessage,
}: HistoryProps) => {
  const { del } = useFetch(`${API_URL}/messages`);

  const dataSource = useMemo(() => {
    return (
      data?.map((message) => ({
        key: message.id,
        text: <p className="text-white">{message.text}</p>,
        title: (
          <div>
            <div className="flex justify-between">
              <p className="font-bold text-white">
                Created at:{" "}
                <span className="font-normal">
                  {getDateFormat(message.createdAt)}
                </span>
              </p>
              {message.scheduledAt && (
                <p className="font-bold text-white">
                  Scheduled at:{" "}
                  <span className="font-normal">
                    {getDateFormat(message.scheduledAt)}
                  </span>
                </p>
              )}
              <div className="flex items-center gap-2">
                <p
                  className={cx(
                    "px-2 py-1 rounded-full text-white text-xs",
                    message.status === MessageStatus.FAILED && "bg-red-600",
                    message.status === MessageStatus.SENT && "bg-green-600",
                    [MessageStatus.PARTIAL, MessageStatus.CANCELED].includes(
                      message.status
                    ) && "bg-orange-600",
                    message.status === MessageStatus.PENDING && "bg-gray-400"
                  )}
                >
                  {message.status.toLocaleUpperCase()}
                </p>
                {message.scheduledAt &&
                  message.status === MessageStatus.PENDING && (
                    <Popconfirm
                      title="Are you sure to cancel this message?"
                      onConfirm={async () => {
                        await del(`/${message.id}`);
                        onDeleteMessage();
                      }}
                      okText="Yes"
                      cancelText="No"
                    >
                      <button className="text-black">
                        <DeleteOutlined />
                      </button>
                    </Popconfirm>
                  )}
              </div>
            </div>

            <p className="text-white font-bold mb-0">
              Contacts:{" "}
              <span className="font-normal">
                {message.contacts
                  .map((contact) => contact.name || contact.chatId)
                  .join(", ")}
              </span>
            </p>
          </div>
        ),
        // descriptions: (

        // ),
      })) ?? []
    );
  }, [data]);

  return (
    <div className="md:w-1/2 ">
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
        itemLayout="vertical"
        dataSource={dataSource}
        loading={loading}
        renderItem={(item) => (
          <List.Item
            className="px-4 bg-slate-600 rounded-lg mb-2"
            key={item.key}
          >
            <List.Item.Meta title={item.title} />
            {item.text}
          </List.Item>
        )}
      />
    </div>
  );
};
