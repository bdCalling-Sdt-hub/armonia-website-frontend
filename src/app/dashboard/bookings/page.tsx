"use client";
import { context } from "@/app/Context";
import BookingDetails from "@/components/BookingDetails";
import BookingReviewForm from "@/components/BookingReviewForm";
import LoaderWraperComp from "@/components/LoaderWraperComp";
import PaginationC, { TQuery } from "@/components/PaginationC";
import {
  useBookingsQuery,
  useUpdateBookingStatusMutation,
} from "@/redux/features/booking/booking.api";
import { useCreatePaymentMutation } from "@/redux/features/earnings/earnings.api";
import { useAppSelector } from "@/redux/hook";
import { TUniObject } from "@/type/index.type";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import Swal from "sweetalert2";

export default function Page() {
  const router = useRouter();
  const appContext = useContext(context);
  const [query, setQuery] = useState<TQuery<TUniObject>>({
    status: "accepted",
    page: 1,
    limit: 15,
    bookingNumber: "",
  });
  const { user } = useAppSelector((state) => state.auth);
  const { data, isLoading, isError } = useBookingsQuery(
    Object.entries(query)
      .filter((item) => item[1])
      .map(([name, value]) => ({ name, value: value.toString() }))
  );
  const [updateBookingStatus, { isLoading: upLoading }] =
    useUpdateBookingStatusMutation();
  const [payment] = useCreatePaymentMutation();

  const handleEarlyPayment = async (service: TUniObject) => {
    Swal.fire({
      text: `Would you like to proceed with an early payment of 30% of the total service amount $${service.totalAmount}?`,
      title: `Amount: $${(service.totalAmount * 0.3).toFixed(2)}`,
      showCancelButton: true,
      confirmButtonText: "Pay Now",
      cancelButtonText: "Cancel",
      showConfirmButton: true,
      confirmButtonColor: "green",
      reverseButtons: true,
      customClass: {
        confirmButton:
          "text-white font-normal py-2 px-4 rounded-full w-40 outline-none",
        cancelButton: "py-2 px-4 font-normal rounded-full w-40",
      },
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          const res = await payment({
            bookingId: service.id,
          }).unwrap();
          // console.log(res);
          window.location = res.data.paymentIntent;
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
      }
    });
  };
  // const hanleStatus = async ({
  //   status,
  //   id,
  // }: {
  //   status: "accepted" | "rejected" | "cancelled" | "done";
  //   id: string;
  // }) => {
  //   const toastId = toast.loading("Please wait...");
  //   try {
  //     await updateBookingStatus({
  //       status,
  //       id,
  //     }).unwrap();
  //     toast.success(`Successfully request ${status}!`);
  //   } catch (error: any) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Failed!!",
  //       text:
  //         error.message ||
  //         error?.data?.message ||
  //         "Something went wrong. Please try again later.",
  //     });
  //   } finally {
  //     toast.dismiss(toastId);
  //   }
  // };
  return (
    <section className="bg-yellow-50 w-full">
      <div className="flex justify-between items-center gap-3 bg-blue-500 px-5 ">
        <h1 className="text-2xl font-semibold py-4 text-white">
          Confirmed Service
        </h1>
        <input
          type="text"
          onChange={(e) =>
            setQuery((c) => ({ ...c, bookingNumber: e.target.value }))
          }
          placeholder="Search by booking number"
          className="flex-grow ml-2 max-w-xs bg-white border border-gray-300 rounded px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className=" mx-auto sm:p-4 dark:text-gray-800">
        <LoaderWraperComp
          isError={isError}
          isLoading={isLoading}
          dataEmpty={data?.data?.length < 1}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <colgroup>
                <col />
                <col />
                <col />
                <col />
                <col />
                <col className="w-24" />
              </colgroup>
              <thead className=" border-b-2 border-black">
                <tr className=" text-left">
                  <th className="p-3 border-r-4">Booking NO.</th>
                  <th className="p-3 border-r-4">
                    {user?.type === "customer" ? "Beautician" : "User"} Name
                  </th>
                  <th className="p-3 border-r-4">
                    {user?.type === "customer" ? "Post Code" : "Email"}
                  </th>
                  <th className="p-3 border-r-4">Price</th>
                  <th className="p-3 border-r-4 text-right">
                    Appointment Date
                  </th>
                  {user?.type === "beautician" && (
                    <th className="p-3 border-r-4 text-center">Service</th>
                  )}
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((item: TUniObject, index: number) => (
                  <tr key={index} className="border-t-2 border-b-2">
                    <td className="p-3 border-r-4 notranslate">
                      {item.bookingNumber}
                    </td>
                    <td className="p-3 border-r-4 ">
                      {user?.type === "customer"
                        ? item.profile?.user?.name
                        : item.user?.name}
                    </td>
                    <td className="p-3 border-r-4 notranslate">
                      {user?.type === "customer"
                        ? item.profile?.postalCode
                        : item.user?.email}
                    </td>
                    <td className="p-3 border-r-4 notranslate">
                      € {item.totalAmount}
                    </td>
                    <td className="p-3 border-r-4 text-right notranslate">
                      {new Date(item.bookingDate).toDateString()}
                    </td>
                    {user?.type === "beautician" && (
                      <td className="p-3 border-r-4 text-center">
                        <button
                          onClick={() =>
                            appContext?.setModal(
                              <BookingDetails bookingId={item.id} />
                            )
                          }
                          className="rounded-md px-3 py-1 hover:text-sky-600"
                        >
                          View
                        </button>
                      </td>
                    )}
                    <td className="p-3">
                      {user?.type === "beautician" ? (
                        <>
                          {item.status === "paid" ? (
                            <button
                              onClick={() =>
                                updateBookingStatus({
                                  status: "completed",
                                  id: item.id,
                                })
                              }
                              disabled={upLoading}
                              className="bg-blue-500 text-white w-full px-2 py-1 rounded-md disabled:bg-blue-200"
                            >
                              Complete
                            </button>
                          ) : item.status === "completed" ? (
                            <button className="bg-yellow-400 text-white w-full px-2 py-1 rounded-md cursor-not-allowed">
                              Done
                            </button>
                          ) : (
                            <p className="w-full px-2 py-1 text-center">
                              Accepted
                            </p>
                          )}
                        </>
                      ) : (
                        <>
                          {item.status === "accepted" ? (
                            <button
                              onClick={() => handleEarlyPayment(item)}
                              className="bg-blue-500 text-white w-full px-2 py-1 rounded-md disabled:bg-blue-200 whitespace-pre"
                            >
                              Early Pay
                            </button>
                          ) : item.status === "paid" ? (
                            <button
                              onClick={() =>
                                router.push(
                                  `/dashboard/bookings/beautician-tracking?id=${item.id}`
                                )
                              }
                              className="bg-blue-400 text-white w-full px-2 py-1 rounded-md disabled:bg-blue-200 flex justify-center items-center gap-1"
                            >
                              Tracking
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                appContext?.setModal(
                                  <BookingReviewForm
                                    profileId={item.profile?.id}
                                    bookingId={item.id}
                                  />
                                )
                              }
                              className="bg-green-500 text-white w-full px-2 py-1 rounded-md disabled:bg-blue-200"
                            >
                              Review
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PaginationC
            setQuery={setQuery}
            query={query}
            totalPage={data?.pagination?.totalPages}
          />
        </LoaderWraperComp>
      </div>
    </section>
  );
}
