export enum AuthStatus {
  LOGGED_IN = "logged_in",
  LOGGED_OUT = "logged_out",
}

export type AuthEvent = {
  status: AuthStatus;
};

export type QREvent = {
  qrCode: string;
};
