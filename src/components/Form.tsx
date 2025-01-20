import { Button, DatePicker, Form, Input, message, TimePicker } from "antd";
import { ContactSelect } from "./ContactSelect";
import useFetch from "use-http";
import dayjs, { Dayjs } from "dayjs";
import { useForm } from "antd/es/form/Form";
import { API_URL } from "../constants/urls";

type FormMessageProps = {};

type FormDataType = {
  contacts: string[];
  message: string;
  date: Dayjs;
  time: Dayjs;
};

export const FormMessage = ({}: FormMessageProps) => {
  const [form] = useForm<FormDataType>();
  const [messageApi, contextHolder] = message.useMessage();

  const hasDate = !!Form.useWatch("date", form);
  const { post } = useFetch(API_URL);

  const onFinish = async (values: FormDataType) => {
    try {
      const datetime = values.time
        ? dayjs(values.date || undefined)
            .set("hour", values.time.hour())
            .set("minute", values.time.minute())
        : undefined;

      await post("/messages", {
        contacts: values.contacts,
        message: values.message,
        datetime: datetime,
      });
      form.resetFields();

      messageApi.success(
        hasDate ? "Message scheduled successfully" : "Message sent successfully"
      );
    } catch (error) {
      console.log("🚀 ~ onFinish ~ error:", error);
      messageApi.error("An error occurred while sending the message");
    }
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      {contextHolder}
      <Form.Item
        name="contacts"
        label="Contact or Group"
        className="[&>div>div>label]:text-white"
        rules={[
          { required: true, message: "Please select a contact or group" },
        ]}
      >
        <ContactSelect />
      </Form.Item>

      <Form.Item
        name="message"
        label="Message"
        className="[&>div>div>label]:text-white"
        rules={[{ required: true, message: "Please enter a message" }]}
      >
        <Input.TextArea
          autoSize={{ minRows: 4 }}
          placeholder="Enter your message"
        />
      </Form.Item>

      <div className="flex gap-2">
        <Form.Item
          name="date"
          label="Date"
          className="[&>div>div>label]:text-white flex-1"
        >
          <DatePicker minDate={dayjs()} />
        </Form.Item>
        <Form.Item
          name="time"
          label="Time"
          className="[&>div>div>label]:text-white flex-1"
          rules={[
            {
              required: hasDate,
              message: "Please select a time",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const date = getFieldValue("date");
                const hasDate = !!date;
                const selectedDate = hasDate ? dayjs(date) : dayjs();

                if (
                  dayjs(selectedDate).isSame(dayjs(), "day") &&
                  dayjs(value).isBefore(dayjs(), "hour")
                )
                  return Promise.reject("Cannot select past time");

                return Promise.resolve();
              },
            }),
          ]}
        >
          <TimePicker
            format="HH:mm a"
            use12Hours
            minuteStep={15}
            className="w-full"
          />
        </Form.Item>
      </div>

      <Button
        htmlType="submit"
        type="primary"
        className="font-semibold text-base py-5 px-16 rounded-2xl hover:opacity-80 bg-[#16a085] w-full"
      >
        Send Message
      </Button>
    </Form>
  );
};
