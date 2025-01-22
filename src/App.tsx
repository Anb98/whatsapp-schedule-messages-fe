import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthEvent, QREvent } from "./types/socket";
import { Badge, Popconfirm, QRCode, Spin } from "antd";
import { LoadingOutlined, LogoutOutlined } from "@ant-design/icons";
import useFetch from "use-http";
import { API_URL, SOCKET_URL } from "./constants/urls";
import { Logged } from "./components/Logged";

function App() {
  const [connected, setConnected] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const { post } = useFetch(`${API_URL}/auth`);

  useEffect(() => {
    const socket = io(SOCKET_URL);

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onAuthChange = (data: AuthEvent) => {
      const isLogged = data.status === "logged_in";
      setIsLogged(isLogged);

      if (isLogged) setQrCode("");
    };
    const onQRChange = (data: QREvent) => setQrCode(data.qrCode);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("auth", onAuthChange);
    socket.on("qr", onQRChange);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("auth", onAuthChange);
      socket.off("qr", onQRChange);
    };
  }, []);

  const isLoading = !isLogged && !qrCode;

  const handleLogout = () => post("/logout");

  return (
    <main className="bg-slate-800 min-h-screen ">
      <div className="container m-auto">
        <div className="flex justify-between pt-2 px-2 mb-5">
          <Badge
            count={connected ? "Online" : "Offline"}
            color={connected ? "green" : "red"}
          />
          {isLogged ? (
            <Popconfirm
              title="Are you sure to Logout"
              onConfirm={handleLogout}
              okText="Yes"
              cancelText="No"
            >
              <button className="text-white flex gap-2 items-center">
                <LogoutOutlined />
                Logout
              </button>
            </Popconfirm>
          ) : (
            <div />
          )}
        </div>

        <div className="flex justify-center items-center">
          {isLoading && (
            <Spin
              indicator={
                <LoadingOutlined
                  style={{ fontSize: 48, color: "#16a085" }}
                  spin
                />
              }
            />
          )}

          {!!qrCode && (
            <QRCode className="bg-white" type="svg" value={qrCode} />
          )}

          {isLogged && <Logged />}
        </div>
      </div>
    </main>
  );
}

export default App;
