"use client";
import Image from "next/image";
import React, { FormEvent, useContext, useState } from "react";
import { Service, Slot } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hook";
import { useRemaningSlotsQuery } from "@/redux/features/slots/slots.api";
import { toast } from "react-toastify";
import { useCreateBookingMutation } from "@/redux/features/booking/booking.api";
import Swal from "sweetalert2";
import { BtnSpenner } from "./Spinner";
import { context } from "@/app/Context";
import { useRouter } from "next/navigation";
import { BusinessDayPicker, TWeekday } from "./ui/DatePicker";
import { validateAndSelectSlots } from "@/lib/helpers";
import { convertMinutesToTotalDuration } from "@/lib/getDurationFromMinute";
import { cn } from "@/lib/utils";

// type FormValues = {
//   [key: string]: FormDataEntryValue | undefined;
// };

export default function Checkout({
  selectedServices,
  profileId,
  allowedWeekdays,
}: {
  selectedServices: Service[];
  profileId: string;
  allowedWeekdays: TWeekday[];
}) {
  const router = useRouter();
  const appContext = useContext(context);
  const { user } = useAppSelector((state) => state.auth);
  const [selectedSlot, setSelectedSlot] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [selectedSlotInfo, setSelectedSlotInfo] = useState<Slot[]>([]);
  const [isPreviousAvailable, setIsPreviousAvailable] =
    useState<boolean>(false);
  const { data, isLoading } = useRemaningSlotsQuery(
    {
      args: [{ name: "date", value: selectedDate?.getTime() }],
      profileId,
    },
    { skip: !setSelectedDate }
  );
  const [dispatch, { isLoading: muLoading }] = useCreateBookingMutation();

  const total = selectedServices.reduce(
    (sum, service) => sum + service.price,
    0
  );
  const totalTime = selectedServices.reduce(
    (sum, service) => sum + service.time,
    0
  );
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // const formData = new FormData(e.currentTarget);
    // const formValues = Object.values(Object.fromEntries(formData.entries()));
    if (selectedSlot.length < totalTime / 30) {
      toast.error("Please select the slots in order");
      return;
    }
    if (isButtonDisabled) {
      toast.error("Please select the slots in order");
      return;
    }
    const payload = {
      profileId,
      isPreviousAvailable,
      bookingDate: selectedDate?.getTime(),
      serviceIds: selectedServices.map((item) => item.id),
      timeSlotIds: selectedSlot,
      slots: selectedSlotInfo,
    };
    try {
      await dispatch(payload).unwrap();
      appContext?.setModal(null);
      Swal.fire({
        icon: "success",
        title: "Booking success!!",
        text: "Your booking request has been sent successfully! 🎉",
      });
      router.push("/dashboard/bookings/pending");
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Failed!!",
        text:
          error.message ||
          error?.data?.message ||
          "Something went wrong. Please try again later.",
      });
    }
  };
  console.log(selectedServices);
  const handleSlotChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const slotNeed = totalTime / 30;

    if (slotNeed > data?.data?.length) {
      setIsButtonDisabled(true);
      toast.error(
        `Beautician does not have ${convertMinutesToTotalDuration(
          totalTime
        )} to book!`,
        {
          position: "bottom-center",
        }
      );
      return;
    }
    const index = data?.data.findIndex(
      (item: Slot) => item.id === e.target.value
    );
    if (index === -1) {
      toast.error("Please select the slots in order");
      throw new Error("Invalid slot selected");
      return;
    }

    try {
      let selectedIds: { ids: string[]; info: Slot[] };
      if (index !== 0) {
        selectedIds = validateAndSelectSlots(
          index - 1,
          slotNeed + 1,
          data?.data
        );
        setIsPreviousAvailable(true);
      } else {
        setIsPreviousAvailable(false);
        selectedIds = validateAndSelectSlots(index, slotNeed, data?.data);
      }
      setSelectedSlotInfo(selectedIds.info);
      setSelectedSlot(selectedIds.ids);
      setIsButtonDisabled(false);
    } catch (error) {
      if (error instanceof Error) {
        setIsButtonDisabled(true);
        setSelectedSlot([]);
        setSelectedSlotInfo([]);
        console.log(error.message);
      }
    }
  };
  // console.log("Total Slots", `${totalTime / 30}`);
  // const bongoBoltu = selectedSlot.find((item) => item[`slot-${2}`]);
  // console.log("bongoBoltu", bongoBoltu ? Object.values(bongoBoltu)[0] : "");
  // console.log(selectedSlot.find((item) => item[`slot-${2}`]) ? selectedSlot.find((item) => item[`slot-${2}`])[`slot-${2}`] : "");
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white max-w-[1440px] w-full py-16 px-10 lg:px-56 relative"
    >
      <div className="text-black lg:flex justify-center items-start gap-8">
        <Image
          src={"/checkout.png"}
          height={702}
          width={334}
          className="hidden sm:block"
          alt="img"
          style={{
            maxWidth: "100%",
            height: "auto",
          }}
        />
        <div className="space-y-4">
          <p className="text-xl font-semibold font-Playfair_Display">
            Beautician
          </p>
          <h1 className="lg:text-4xl text-4xl font-bold text-blue-500 font-Playfair_Display">
            Book Appointment
          </h1>
          {/* <p>Please fill this form to book an appointment</p> */}
          <div className="space-y-4">
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="username"
              >
                Client Name
              </label>
              <input
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                defaultValue={user?.name}
                type="text"
                placeholder="Username"
              />
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="username"
              >
                Email (Not Editable)
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                value={user?.email}
                readOnly
                placeholder="Email"
              />
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                // htmlFor="username"
              >
                Appointment Date
              </label>
              {/* <input
                required
                type="date"
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                min={new Date().toISOString().split("T")[0]}
              /> */}
              <BusinessDayPicker
                allowedWeekdays={allowedWeekdays}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                // htmlFor="username"
              >
                Appointment Time
              </label>
              <select
                className={cn(
                  "appearance-none shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline",
                  { "text-gray-400": !selectedDate }
                )}
                // defaultValue={""}
                value={
                  data?.data?.find(
                    (item: Slot) =>
                      item.id === selectedSlot[isPreviousAvailable ? 1 : 0]
                  )?.id || ""
                }
                required
                onClick={() => {
                  if (!selectedDate)
                    toast.warning("Appointment date select is required!", {
                      position: "bottom-center",
                    });
                }}
                name={"slot" + "-"}
                onChange={(e) => handleSlotChange(e)}
              >
                <option disabled value="">
                  {isLoading ? "Loading..." : "Select start time"}
                </option>
                {data?.data?.map((item: Slot, slotIindex: number) => (
                  <option
                    key={slotIindex}
                    value={item.id}
                    className="notranslate"
                  >
                    {item.start}
                    {/* - {item.end} */}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-600 pt-1">
                You will need {convertMinutesToTotalDuration(totalTime)} from
                selected start time!
              </p>
            </div>
            <div className="lg:py-4 mt-20  mx-auto">
              <h1 className="lg:text-4xl text-3xl font-bold font-Playfair_Display text-blue-500 mb-4">
                Selected Service Prices
              </h1>
              <div>
                {/* <div className="">
                  {selectedSlotInfo.slice(1).map((item, i) => (
                    <p key={item.id || i}>
                      {item.start} - {item.end}
                    </p>
                  ))}
                </div> */}

                {/* <p className="text-gray-700 font-semibold">
                  Selected Time:
                  {selectedSlotInfo?.length > 0 &&
                  selectedSlotInfo[0]?.start &&
                  selectedSlotInfo[selectedSlotInfo.length - 1]?.end
                    ? `${selectedSlotInfo[0].start} - ${
                        selectedSlotInfo[selectedSlotInfo.length - 1].end
                      }`
                    : ""}
                </p> */}
              </div>
              {/* <p className="mb-2 block text-gray-700 font-medium">
                Selected Services
              </p> */}
              <ul className="space-y-2">
                {selectedServices.map((service, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center border-b border-dotted gap-3 pb-3 text-gray-700"
                  >
                    <div className="flex justify-between items-center w-full gap-2">
                      <p>
                        <span className="font-semibold">{service.name}</span>{" "}
                        <span className="text-[10px] font-medium">
                          {service.time} min
                        </span>
                      </p>
                      <span className="text-blue-500 text-right notranslate">
                        € {service.price}
                      </span>
                    </div>
                    {/* <div className="w-full relative max-w-[118px] sm:max-w-32">
                      <FaCaretDown
                        size={12}
                        className="text-gray-500 hover:text-gray-400 absolute top-[15px] right-2 pointer-events-none"
                      />
                    </div> */}
                  </li>
                ))}
              </ul>

              <div className="flex justify-between items-center mt-6 font-bold lg:text-xl text-lg">
                <span>Total</span>
                <span className="text-green-600 notranslate">€ {total}</span>
              </div>
            </div>
          </div>

          {/* <div className="flex justify-center ">
            <button className="bg-[#142F62] w-[600px] py-4 mb-28 text-xl font-bold font-Playfair_Display text-white rounded-3xl transition duration-300 ease-in-out transform hover:bg-blue-500 hover:scale-105">
              Send Request
            </button>
          </div> */}
        </div>
      </div>
      <div className="flex items-center justify-center">
        <button
          type="submit"
          disabled={muLoading}
          className={`${"bg-blue-500"} flex justify-center items-center gap-2 max-w-lg w-full mt-10 rounded-2xl font-nunito bg-blue-500 text-white border-blue-500 border-2 p-3 lg:p-4 `}
          // className="flex justify-center items-center gap-2 max-w-lg w-full mt-10 rounded-2xl font-nunito bg-blue-500 text-white border-blue-500 border-2 p-3 lg:p-4 "
        >
          {muLoading && <BtnSpenner />} Send Request
        </button>
      </div>
    </form>
  );
}
