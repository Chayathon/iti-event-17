import React, { useState, useEffect } from "react";
import { Data } from "@/interfaces/Stat.type";
import {
  FaCircleCheck,
  FaClock,
  FaExclamation,
  FaCashRegister,
} from "react-icons/fa6";

type Props = {
  data: Data;
};

export default function Stat({ data }: Props) {
  const [wait, setWait] = useState(0);
  const [failed, setFailed] = useState(0);
  const [success, setSuccess] = useState(0);
  const [pending, setPending] = useState(0);

  function countStatus() {
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

    setWait(statusCount.WAIT);
    setFailed(statusCount.FAILS);
    setSuccess(statusCount.COMPLETE);
    setPending(statusCount.PENDING);
  }

  useEffect(() => {
    countStatus();
  }, [data]);

  return (
    <div>
      <div className="stats shadow flex flex-col md:flex-row">
        <div className="stat bg-slate-50">
          <div className="stat-figure text-3xl text-green-400">
            <FaCircleCheck />
          </div>
          <div className="stat-title text-black">ยืนยันการชำระเงินแล้ว</div>
          <div className="stat-value text-green-400">{success}</div>
          <div className="stat-desc text-black">โต๊ะ/รายการสินค้า</div>
        </div>

        <div className="stat bg-slate-50  text-blue-400 ">
          <div className="stat-figure text-3xl  ">
            <FaCashRegister />
          </div>
          <div className="stat-title text-black">รอการตรวจสอบ</div>
          <div className="stat-value">{wait}</div>
          <div className="stat-desc text-black">โต๊ะ/รายการสินค้า</div>
        </div>

        <div className="stat bg-slate-50  text-amber-400 ">
          <div className="stat-figure text-3xl  ">
            <FaClock />
          </div>
          <div className="stat-title text-black">ค้างชำระ</div>
          <div className="stat-value">{pending}</div>
          <div className="stat-desc text-black">
            หลุดจอง/ข้อมูลไม่ถูกต้อง/อื่น ๆ
          </div>
        </div>

        <div className="stat bg-slate-50  text-red-400 ">
          <div className="stat-figure text-3xl  ">
            <FaExclamation />
          </div>
          <div className="stat-title text-black">ล้มเหลว</div>
          <div className="stat-value">{failed}</div>
          <div className="stat-desc text-black">
            หลุดจอง/ข้อมูลไม่ถูกต้อง/อื่น ๆ
          </div>
        </div>
      </div>
    </div>
  );
}
