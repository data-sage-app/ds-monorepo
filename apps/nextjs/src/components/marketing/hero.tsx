import {
  Bars3Icon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";

import DashboardImage from "../../assets/dashboard-hero.png";
import { Dialog } from "@headlessui/react";
import FullLogo from "../../assets/fullLogo.svg";
import Image from "next/image";
import { useState } from "react";

const navigation = [
  { name: "Features", href: "#" },
  { name: "Case Studies", href: "#" },
  { name: "Pricing", href: "#" },
  { name: "Docs", href: "#" },
];

function Blur() {
  return (
    <svg
      className="absolute inset-0 -z-10 h-full w-full stroke-white/10"
      viewBox="0 0 902 948"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_0_27)">
        <path
          d="M788.98 310.961C819.65 463.737 757.309 543.593 679.568 619.059C612.684 813.163 333.612 695.467 243.299 602.432C152.985 509.396 413.559 500.582 491.3 425.116C621.039 135.96 698.666 217.925 788.98 310.961Z"
          fill="url(#paint0_linear_0_27)"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_0_27"
          x="0.517384"
          y="0.458862"
          width="1020.44"
          height="947.404"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="112"
            result="effect1_foregroundBlur_0_27"
          />
        </filter>
        <linearGradient
          id="paint0_linear_0_27"
          x1="423.306"
          y1="361.065"
          x2="577.506"
          y2="749.287"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6DDCFF60" />
          <stop offset="1" stopColor="#152ADF60" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Hero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="relative isolate overflow-hidden bg-neutral-900">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          className="flex items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <Image className="h-8 w-auto" src={FullLogo} alt="" />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-semibold leading-6 text-white"
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a
              href="/sign-in"
              className="hover:bg-accent/90 rounded-md border-2 border-lime-500 bg-lime-500 px-3.5 py-2.5 text-sm font-semibold text-neutral-800 shadow-sm transition-colors duration-200 hover:border-lime-700 hover:bg-lime-700 focus-visible:outline"
            >
              Sign In <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </nav>
        <Dialog
          as="div"
          className="lg:hidden"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed inset-0 z-50" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <Image className="h-8 w-auto" src={FullLogo} alt="" />
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Sign in
                  </a>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>
      <Blur />

      <div
        className="absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]"
        aria-hidden="true"
      >
        <div
          className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-5"
          style={{
            clipPath:
              "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
          }}
        />
      </div>
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <a href="#" className="inline-flex space-x-6">
              <span className="ring-accent/20 rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-[600] leading-6 text-lime-500 ring-1 ring-inset">
                What's new
              </span>
              <span className="inline-flex items-center space-x-2 text-sm font-normal leading-6 text-neutral-300">
                <span>Just shipped v1.0</span>
                <ChevronRightIcon
                  className="h-5 w-5 text-neutral-500"
                  aria-hidden="true"
                />
              </span>
            </a>
          </div>
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Supercharge your Business using AI & Automation
          </h1>
          <p className="text-md mt-6 leading-7 tracking-normal text-neutral-300">
            Get the most out of your data with our AI-powered tools. We help you
            to make better decisions and grow your business faster.
          </p>
          <div className="mt-10 flex w-full items-center gap-x-4">
            <a
              href="#"
              className="hover:bg-accent/90 rounded-md border-2 border-lime-500 bg-lime-500 px-3.5 py-2.5 text-sm font-semibold  text-neutral-800 shadow-sm transition-colors duration-200 hover:border-lime-700 hover:bg-lime-700 focus-visible:outline"
            >
              Join Waitlist
            </a>
            <input
              className=" flex-grow rounded-md border-2 border-lime-500 bg-transparent px-3.5 py-2.5 text-sm font-medium text-white shadow-sm placeholder:text-neutral-300 hover:bg-white/10 focus-visible:outline-none "
              type="email"
              id="email"
              placeholder="Enter your email"
            />
          </div>
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <Image
              src={DashboardImage}
              alt="App screenshot"
              width={2432}
              height={1442}
              className="ring-accent/20 shadow-neon w-[64rem] rounded-md bg-white/5 ring-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
