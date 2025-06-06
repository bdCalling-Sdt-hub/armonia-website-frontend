"use client";

import React, { useState } from "react";
import { useServicesByCategoryQuery } from "@/redux/features/services/services.api";
import { TUniObject } from "@/type/index.type";
import LoaderWraperComp from "@/components/LoaderWraperComp";
import Image from "next/image";
import ServiceCart from "@/components/ui/ServiceCart";
import PaginationC, { TQuery } from "@/components/PaginationC";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const searchParams = useSearchParams();
  const { category, bg } = Object.fromEntries(searchParams.entries());
  const [query, setQuery] = useState<TQuery<TUniObject>>({ page: 1, limit: 9 });
  const { data, isLoading, isError } = useServicesByCategoryQuery(
    {
      category: category as string,
      args: [
        ...Object.entries(query)
          .filter((item) => item[1])
          .map(([name, value]) => ({ name, value: value.toString() })),
      ],
    },
    { skip: !category }
  );
  return (
    <div className="min-h-[90vh]">
      <header className="relative h-[200px] lg:h-[350px] flex items-center justify-center bg-[#435981]">
        <Image
          src={bg ? `${process.env.NEXT_PUBLIC_API_URL}${bg}` : "/headerBG.png"}
          alt="header"
          fill
          sizes="100vw"
          style={{
            objectFit: "cover",
          }}
          // className="blur-sm grayscale"
        />
        <div className="absolute inset-0 bg-black/30 blur-sm"></div>
        <h1 className="text-3xl lg:text-6xl text-center text-white font-Playfair_Display font-bold z-20">
          {category}
        </h1>
      </header>
      {/* <p className="text-center text-xl font-medium mt-6">
        Services of {category}
      </p> */}
      <LoaderWraperComp
        isError={isError}
        isLoading={isLoading}
        dataEmpty={data?.data?.length < 1}
        className="h-[80vh]"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 items-center gap-6 lg:gap-9 px-5 2xl:px-36 my-8 md:my-14">
          {data?.data?.map((service: any) => (
            <ServiceCart
              key={service.id}
              service={service}
              category={category}
              bg={bg}
            />
          ))}
        </div>
        <PaginationC
          setQuery={setQuery}
          query={query}
          totalPage={data?.pagination?.totalPages}
        />
      </LoaderWraperComp>
    </div>
  );
};

export default Page;
