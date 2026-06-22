/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { axiosJWT } from "../../../../Auth/AddAuthorization";

export const useLeaveSummary = ({
  isFor,
  isPage,
  idEmployee,
  leaveType,
  fromDate,
  toDate,
  setValue
}: any) => {
  const isCalling = useRef(false);
  const [apiMessage, setApiMessage] = useState<string | null>(null);
    useEffect(() => {
    if (
      ["EarnedLeaveHalfDay", "Birthday", "Paternity", "Maternity"].includes(leaveType) &&
      fromDate
    ) {
      setValue("toDate", fromDate, {
        shouldDirty: true,
        shouldTouch: true
      });
    }
  }, [leaveType, fromDate]);
  const isSingleDayLeave = [
  "EarnedLeaveHalfDay",
  "Birthday",
  "Paternity",
  "Maternity"
].includes(leaveType);

const effectiveToDate = isSingleDayLeave ? fromDate : toDate;

  const [popupdata, setpopupdata] = useState<any>(null);
  const [isModalOpeninput, setIsModalOpeninput] = useState(false);
  const [LossOfPayApplicable, setLossOfPayApplicable] = useState("no");

  const handleApplyLossOfPay = () => {
    if (!popupdata) return;

    setLossOfPayApplicable("yes");

    setValue("numberofDays", popupdata.NumberofDays, {
      shouldDirty: true,
      shouldTouch: true
    });

    setValue("remaingLeaves", popupdata.RemainingLeaves, {
      shouldDirty: true,
      shouldTouch: true
    });

    // optional – store breakup
        setValue("isLossOfPayApplicable", "yes", {
      shouldDirty: true,
      shouldTouch: true
    });

    setIsModalOpeninput(false);
  };
  const handleCancelLossOfPay = () => {
    setLossOfPayApplicable("no");
    setpopupdata(null);
    setIsModalOpeninput(false);

    setValue("numberofDays", "");
    setValue("remaingLeaves", "");
  };


  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setApiMessage(null);

    if (
      isFor !== "applyLeave" ||
      !leaveType ||
      !fromDate ||
      (!isSingleDayLeave && !toDate)
    ) {
      setValue("numberofDays", "");
      setValue("remaingLeaves", "");
      return;
    }

    if (isPage === "admin" && !idEmployee) return;
    if (isCalling.current) return;

    isCalling.current = true;

    (async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        const payload: any = {
  leaveType,
  fromDate,
  toDate: effectiveToDate
};
        if (isPage === "admin") payload.idEmployee = idEmployee;

        const response = await axiosJWT.post(
          `${apiUrl}/leave/getNoOfLeaves`,
          payload
        );

        const apiData = response?.data?.data;

        if (apiData?.status === "notOk") {
          if (apiData?.isLossOfPayApplicable === "yes") {
            setpopupdata(apiData);
            setIsModalOpeninput(true);
            setLossOfPayApplicable("no");
          } else {
            setValue("numberofDays", "");
            setValue("remaingLeaves", "");
            setValue("toDate", "");
          }
          return;
        }

        if (apiData?.status === "ok") {
          if (apiData.toDate) {
            setValue("toDate", apiData.toDate, {
              shouldDirty: true,
              shouldTouch: true
            });
          }
          setValue("numberofDays", apiData.NumberofDays, {
            shouldDirty: true,
            shouldTouch: true
          });

          setValue("remaingLeaves", apiData.RemainingLeaves, {
            shouldDirty: true,
            shouldTouch: true
          });
        }

      } catch (err: any) {
        setApiMessage(
          err?.response?.data?.message ||
          err?.message ||
          "Something went wrong while fetching leave summary"
        );
      } finally {
        isCalling.current = false;
      }
    })();
  }, [leaveType, fromDate, toDate, isFor, isPage, idEmployee]);

  // ✅ expose clear function
  const clearApiMessage = () => setApiMessage(null);

  return {
    apiMessage,
    clearApiMessage,
    popupdata,
    isModalOpeninput,
    LossOfPayApplicable,
    handleApplyLossOfPay,
    handleCancelLossOfPay
  };
};
