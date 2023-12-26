import axios from "axios";

export type NotifyData = {
  message?: string;
  icon?: string;
  timeout?: number;
  imageThumbnail?: string;
  imageFullsize?: string;
  imageFile?: string;
  stickerPackageId?: number;
  stickerId?: number;
  notificationDisabled?: boolean;
  type?: "sticker" | "image" | "imageThumbnail" | "imageFullsize";
};

const LINE_API_URL = "https://notify-api.line.me/api/notify";
const LINE_TOKEN =
  process.env.NODE_ENV === "production"
    ? process.env.LINE_NOTIFY_TOKEN
    : process.env.LINE_NOTIFY_TOKEN_DEV;

export default async function notify(data: NotifyData) {
  try {
    const payload: NotifyData = data.stickerId
      ? {
          stickerId: data.stickerId ? data.stickerId : 51626533,
          stickerPackageId: data.stickerPackageId
            ? data.stickerPackageId
            : 11537,
          message: `${data.message}`,
        }
      : {
          message: `${data.message}`,
        };

    await axios.post(LINE_API_URL, payload, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${LINE_TOKEN}`,
      },
    });

    return true;
  } catch (error) {
    console.error("LINE Notify Error:", error);
    return false;
  }
}
