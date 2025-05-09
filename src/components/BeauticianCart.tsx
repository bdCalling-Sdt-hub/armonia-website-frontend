"use client";

import React, { useState } from "react";
import Image from "next/image";
import ProfileCategory from "./ProfileCategory";
import Link from "next/link";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { TUniObject } from "@/type/index.type";
import { Service } from "@/redux/features/auth/authSlice";

export default function BeauticianCart({ data }: { data: TUniObject }) {
  const [sliceQty, setSliceQty] = useState(0);

  const next = (length: number) => {
    setSliceQty((c) => (c < length - 4 ? c + 1 : c));
  };
  const preview = () => {
    setSliceQty((c) => (c > 0 ? c - 1 : c));
  };
  return (
    <div className="bg-yellow-50 rounded-lg relative w-full drop-shadow-md h-full">
      {!!data.category && (
        <ProfileCategory
          category={data.category}
          className="absolute top-5 lg:top-4 right-4"
        />
      )}
      <Link href={`/beauticians/${data.profile_id}`}>
        <div className="w-full flex flex-col items-center sm:flex-row px-5 lg:px-8 py-6 gap-4">
          <div className="w-full md:w-20 xl:min-w-32 xl:w-32 h-full max-h-56 md:h-20 xl:h-32 md:rounded-full overflow-hidden flex items-center justify-center">
            <Image
              src={
                data?.image
                  ? `${process.env.NEXT_PUBLIC_API_URL}${data?.image}`
                  : "/profile-demo.png"
              }
              alt="beautician"
              // style={{
              //   // objectFit: '', // cover, contain, none
              //   objectPosition: 'bottom', // center, top, bottom, left, right
              // }}
              width={128}
              height={128}
              className="w-full h-full"
            />
          </div>
          <div className="w-full overflow-hidden flex flex-col gap-4 text-start">
            <h3 className="font-Playfair_Display text-xl lg:text-2xl font-bold notranslate">
              {data.user_name}
            </h3>
            <p className="flex items-center gap-2 text-blue-500 notranslate">
              <svg
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="size-5 lg:size-6"
              >
                <g clipPath="url(#clip0_2413_2713)">
                  <path
                    d="M13.0876 20.2346C12.7257 20.0058 12.272 20.0058 11.9102 20.2347L6.36042 23.7446C5.50023 24.2887 4.43684 23.4837 4.66541 22.4616L6.13673 15.8821C6.23232 15.4547 6.09372 15.0071 5.77652 14.7189L0.891516 10.2798C0.134835 9.59221 0.541615 8.29345 1.5414 8.20485L7.97912 7.6344C8.39834 7.59726 8.76354 7.32137 8.92826 6.9174L11.4547 0.721256C11.8469 -0.240419 13.1531 -0.240418 13.5453 0.721257L16.0717 6.9174C16.2365 7.32137 16.6017 7.59726 17.0209 7.6344L23.4586 8.20485C24.4584 8.29345 24.8652 9.59221 24.1085 10.2798L19.2235 14.7189C18.9063 15.0071 18.7677 15.4547 18.8633 15.8821L20.3347 22.4621C20.5632 23.4841 19.5 24.2891 18.6398 23.7452L13.0876 20.2346Z"
                    fill="#FFC500"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2413_2713">
                    <rect
                      width="24"
                      height="24"
                      fill="white"
                      transform="translate(0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>
              {data.average_rating ? data.average_rating : "0.0"} (
              {data.total_reviews})
            </p>
            <p className="flex items-center gap-2 text-blue-500 notranslate">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 0C7.34756 0 3.5625 3.78506 3.5625 8.4375C3.5625 10.0094 3.99792 11.5434 4.82198 12.8743L11.5197 23.6676C11.648 23.8744 11.874 24 12.1171 24C12.119 24 12.1208 24 12.1227 24C12.3679 23.9981 12.5944 23.8686 12.7204 23.6582L19.2474 12.7603C20.026 11.4576 20.4375 9.96277 20.4375 8.4375C20.4375 3.78506 16.6524 0 12 0ZM18.0406 12.0383L12.1065 21.9462L6.0172 12.1334C5.33128 11.0257 4.95938 9.74766 4.95938 8.4375C4.95938 4.56047 8.12297 1.39687 12 1.39687C15.877 1.39687 19.0359 4.56047 19.0359 8.4375C19.0359 9.7088 18.6885 10.9541 18.0406 12.0383Z"
                  fill="#141414"
                />
                <path
                  d="M12 4.21875C9.67378 4.21875 7.78125 6.11128 7.78125 8.4375C7.78125 10.7489 9.64298 12.6562 12 12.6562C14.3861 12.6562 16.2188 10.7235 16.2188 8.4375C16.2188 6.11128 14.3262 4.21875 12 4.21875ZM12 11.2594C10.4411 11.2594 9.17813 9.9922 9.17813 8.4375C9.17813 6.88669 10.4492 5.61563 12 5.61563C13.5508 5.61563 14.8172 6.88669 14.8172 8.4375C14.8172 9.96952 13.5836 11.2594 12 11.2594Z"
                  fill="#141414"
                />
              </svg>
              {data?.address}
            </p>
            <div className="max-w-full w-full flex items-center gap-2 overflow-x-scroll scrollbar-none">
              {data?.services
                ?.slice(0, 3)
                .map((item: Service, index: number) => (
                  <span
                    key={index}
                    className="bg-blue-400 w-fit block text-white text-center px-2 pt-0.5 pb-1 rounded text-base text-nowrap"
                  >
                    {item.name}
                  </span>
                ))}
              {/* {data.services?.length > 3 && <span>etc.</span>} */}
            </div>
          </div>
        </div>
      </Link>
      <hr />
      <div className="my-5 flex items-center gap-2 sm:gap-3 px-3 2xl:px-4 w-full justify-between">
        <button
          disabled={sliceQty < 1}
          onClick={() => preview()}
          className="outline-none text-slate-600 disabled:text-slate-400 py-1.5"
        >
          <FaArrowLeft className="size-4" />
        </button>
        {data?.weekly_schedule?.weekDays
          ?.slice(sliceQty, sliceQty + 4)
          .map((item: TUniObject) => (
            <span
              key={item.id}
              className="px-3 xl:px-4 py-1.5 lg:py-2 border border-blue-400 rounded text-center bg-blue-100 text-xs sm:text-sm w-full notranslate"
            >
              {item.dayName?.slice(0, 3)}
            </span>
          ))}
        <button
          disabled={data?.weekly_schedule?.weekDays?.length === sliceQty + 4}
          onClick={() =>
            next(data?.weekly_schedule?.weekDays?.length as number)
          }
          className="outline-none text-slate-600 disabled:text-slate-400 py-1.5"
        >
          <FaArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
