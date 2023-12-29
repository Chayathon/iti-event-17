import { Data } from "@/interfaces/Stat.type";
export function countStatus(data: Data) {
  const statusCount = {
    WAIT: 0,
    FAILS: 0,
    COMPLETE: 0,
    PENDING: 0,
  };

  data["product"].forEach(({ status }) => {
    statusCount[status]++;
  });

  data["table"].forEach(({ status }) => {
    statusCount[status]++;
  });

  return statusCount;
}

export function splitReservationStatus(data: Data) {
  const reservationStatus = {
    WAIT: [],
    FAILS: [],
    COMPLETE: [],
    PENDING: [],
  };

  data["product"].forEach((product) => {
    const { status } = product;
    reservationStatus[status].push({ ...product, type: "product" });
  });

  data["table"].forEach((table) => {
    const { status } = table;
    reservationStatus[status].push({ ...table, type: "table" });
  });

  return reservationStatus;
}
