"use client";

import React, { useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaTwitter } from "react-icons/fa";
import { BiLogoInstagramAlt } from "react-icons/bi";
import { IoLogoFacebook } from "react-icons/io5";
import { context } from "@/app/Context";
import Register from "./Register";

export default function Footer() {
  const appContext = useContext(context);
  return (
    <footer className="bg-gradient-pink-blue text-blue-300">
      <div className="px-3 xl:px-36 py-8 lg:py-20 flex flex-col lg:flex-row lg:items-center justify-between bg-blue-50 gap-10">
        <div>
          <Image
            src="/logo-footer.png"
            alt="logo"
            width={102}
            height={120}
            // style={{
            //   maxWidth: "100%",
            //   height: "auto"
            // }}
          />
          <p className="font-medium max-w-lg mt-4">
            Founded by Isabela, a passionate beauty professional, Armonia was
            created to offer something deeply personal: the highest standard of
            care, wherever you are. We bring the spa, salon, and wellness studio
            to your villa, hotel, or home—so you can indulge, unwind, and glow
            on your own terms.
          </p>
          <div className="flex justify-start gap-3 lg:gap-5 mt-4">
            <a
              className="hover:text-blue-500 transition-all"
              href="https://www.facebook.com/armonia.concierge"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IoLogoFacebook size={22} />
            </a>
            <a
              className="hover:text-blue-500 transition-all"
              href="https://www.instagram.com/armonia.concierge/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BiLogoInstagramAlt size={22} />
            </a>
            <a
              className="hover:text-blue-500 transition-all"
              href="http://"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter size={22} />
            </a>
          </div>
        </div>
        <div className="grid lg:grid-cols-3 justify-between lg:w-1/2 w-full gap-4">
          <div>
            <h3 className="font-bold font-Playfair_Display text-2xl text-blue-500">
              Explore
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <Link href="/treatments">Treatments</Link>
              </li>
              {/* <li>
                <Link href="/events">
                Events
                </Link>
              </li> */}
              {/* <li>
                <Link href="/gift">
                Gift CARDS
                </Link>
              </li> */}
              <li>
                <Link href="/faq">FAQ</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold font-Playfair_Display text-2xl text-blue-500">
              ABOUT US
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <Link href="/policy">PRIVACY POLICY</Link>
              </li>
              <li>
                <Link href="/terms">TERMS OF SERVICE</Link>
              </li>
              <li>
                <Link href="/cancellation-policy">CANCELLATION POLICY</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold font-Playfair_Display text-2xl text-blue-500">
              Get In Touch
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              <li
                className="cursor-pointer"
                onClick={() =>
                  appContext?.setModal(<Register requestType="beautician" />)
                }
              >
                BECOME A THERAPIST
              </li>
              <li>
                <Link href={"/contact"}>CONTACT US</Link>
              </li>
              <li>
                <a href="tel:+351911796101">+00351 911796101</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <p className="py-3 text-sm md:text-base text-center font-nunito bg-gradient-to-b from-[#7E8EAC] to-[#142F62] text-white">
        Copyright © <span>{new Date().getFullYear()}</span>Armonia. All Rights
        Reserved
      </p>
    </footer>
  );
}
