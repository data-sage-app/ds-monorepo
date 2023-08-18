import React, { Fragment, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  SignInButton,
  useAuth,
  useOrganization,
  UserButton,
} from "@clerk/nextjs";
import { Dialog, Disclosure, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  CalendarDaysIcon,
  ChartPieIcon,
  ChevronRightIcon,
  ClipboardDocumentCheckIcon,
  CursorArrowRippleIcon,
  EnvelopeOpenIcon,
  HomeIcon,
  LinkIcon,
} from "@heroicons/react/24/solid";

import FullLogo from "../../assets/fullLogo.svg";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function Sidebar({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const { isSignedIn } = useAuth();

  const navigation = [
    {
      name: "MENU",
      items: [
        {
          name: "Overview",
          tag: "overview",
          href: `/dashboard/${useOrganization().organization?.slug}/overview`,
          icon: HomeIcon,
        },
        {
          name: "Reports",
          tag: "reports",
          href: `/dashboard/${useOrganization().organization?.slug}/reports`,
          icon: ChartPieIcon,
          children: [
            {
              name: "Profitability",
              href: `/dashboard/${
                useOrganization().organization?.slug
              }/reports/profitability`,
            },
            {
              name: "Customer Aquisition",
              href: `/dashboard/${
                useOrganization().organization?.slug
              }/reports/new-customers`,
            },
            {
              name: "Sales",
              href: `/dashboard/${
                useOrganization().organization?.slug
              }/reports/sales`,
            },
            {
              name: "Inventory",
              href: `/dashboard/${
                useOrganization().organization?.slug
              }/reports/inventory`,
            },
            {
              name: "Behavior",
              href: `/dashboard/${
                useOrganization().organization?.slug
              }/reports/behavior`,
            },
          ],
        },
        {
          name: "Advertising",
          tag: "retention",
          href: `/dashboard/${
            useOrganization().organization?.slug
          }/advertising`,
          icon: CursorArrowRippleIcon,
        },
        {
          name: "Retention",
          tag: "advertising",
          href: `/dashboard/${useOrganization().organization?.slug}/retention`,
          icon: EnvelopeOpenIcon,
        },
        {
          name: "Calender",
          tag: "settings",
          href: `/dashboard/${useOrganization().organization?.slug}/calender`,
          icon: CalendarDaysIcon,
        },
      ],
    },
    {
      name: "OTHERS",
      items: [
        {
          name: "Integrations",
          tag: "docs",
          href: `/dashboard/${
            useOrganization().organization?.slug
          }/integrations`,
          icon: LinkIcon,
        },
        {
          name: "Docs",
          tag: "docs",
          href: "/docs",
          icon: ClipboardDocumentCheckIcon,
        },
      ],
    },
  ];

  return (
    <>
      <div className="h-full bg-neutral-900">
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-30 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-neutral-800" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-neutral-900 px-6 pb-4">
                    <div className="flex h-20 shrink-0 items-center justify-center">
                      <Image
                        src={FullLogo as string}
                        alt="DataSage"
                        className=" h-12 w-auto"
                      />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <div className="my-3 text-xs font-medium leading-3 tracking-wide text-lime-500">
                              {item.name}
                            </div>
                            <ul role="list" className="-mx-2 space-y-1">
                              {item.items.map((item) => (
                                <li key={item.name}>
                                  {!item.children ? (
                                    <a
                                      href={item.href}
                                      className={classNames(
                                        router.pathname ===
                                          `/dashboard/[store]/${item.tag}`
                                          ? "bg-lime-400/10 font-medium text-lime-500"
                                          : "font-normal text-neutral-200 hover:bg-neutral-100/10 hover:text-neutral-100",
                                        "group flex cursor-pointer items-center gap-x-4 rounded-md p-3 pl-4 text-sm leading-4 tracking-wide duration-200",
                                      )}
                                    >
                                      <item.icon
                                        className={classNames(
                                          router.pathname ===
                                            `/dashboard/[store]/${item.tag}`
                                            ? "text-lime-500"
                                            : "text-neutral-100 group-hover:text-neutral-100",
                                          "h-6 w-6 flex-shrink-0",
                                        )}
                                        aria-hidden="true"
                                      />
                                      {item.name}
                                    </a>
                                  ) : (
                                    <Disclosure as="div">
                                      {({ open }) => (
                                        <ul className="flex flex-1 flex-col">
                                          <Disclosure.Button
                                            className={classNames(
                                              router.pathname ===
                                                `/dashboard/[store]/${item.tag}`
                                                ? "bg-lime-400/10 font-medium text-lime-500"
                                                : "font-normal text-neutral-200 hover:bg-neutral-100/10 hover:text-neutral-100",
                                              "group flex cursor-pointer items-center gap-x-4 rounded-md p-3 pl-4 text-sm leading-4 tracking-wide duration-200",
                                            )}
                                          >
                                            <item.icon
                                              className={classNames(
                                                router.pathname ===
                                                  `/dashboard/[store]/${item.tag}`
                                                  ? "text-lime-500"
                                                  : "text-neutral-100 group-hover:text-neutral-100",
                                                "h-6 w-6 flex-shrink-0",
                                              )}
                                              aria-hidden="true"
                                            />
                                            {item.name}
                                            <ChevronRightIcon
                                              className={classNames(
                                                open
                                                  ? "rotate-90 text-lime-500"
                                                  : "text-neutral-100 group-hover:text-neutral-100",
                                                "ml-auto h-6 w-6 ",
                                              )}
                                              aria-hidden="true"
                                            />
                                          </Disclosure.Button>
                                          <Disclosure.Panel
                                            as="ul"
                                            className="mt-1 px-2"
                                          >
                                            {item.children.map((subItem) => (
                                              <li key={subItem.name}>
                                                {/* 44px */}
                                                <Disclosure.Button
                                                  as="a"
                                                  href={subItem.href}
                                                  className={classNames(
                                                    router.pathname ===
                                                      `/dashboard/[store]/${item.tag}`
                                                      ? "bg-lime-400/10 font-medium text-lime-500"
                                                      : "font-normal text-neutral-200 hover:bg-neutral-100/10 hover:text-neutral-100",
                                                    "group flex cursor-pointer items-center gap-x-4 rounded-md p-3 pl-4 text-sm leading-4 tracking-wide duration-200",
                                                  )}
                                                >
                                                  {subItem.name}
                                                </Disclosure.Button>
                                              </li>
                                            ))}
                                          </Disclosure.Panel>
                                        </ul>
                                      )}
                                    </Disclosure>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-neutral-700 bg-neutral-900 px-6 pb-4">
            <div className="flex h-20 shrink-0 items-center justify-start">
              <a href="/">
                <Image
                  src={FullLogo as string}
                  alt="DataSage"
                  className=" h-12 w-auto"
                />
              </a>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <div className="my-3 text-xs font-medium leading-3 tracking-wide text-lime-500">
                      {item.name}
                    </div>
                    <ul role="list" className="-mx-2 space-y-1">
                      {item.items.map((item) => (
                        <li key={item.name}>
                          {!item.children ? (
                            <a
                              href={item.href}
                              className={classNames(
                                router.pathname ===
                                  `/dashboard/[store]/${item.tag}`
                                  ? "bg-lime-400/10 font-medium text-lime-500"
                                  : "font-normal text-neutral-200 hover:bg-neutral-100/10 hover:text-neutral-100",
                                "group flex items-center gap-x-4 rounded-md p-3 pl-4 text-sm leading-4 tracking-wide duration-200",
                              )}
                            >
                              <item.icon
                                className={classNames(
                                  router.pathname ===
                                    `/dashboard/[store]/${item.tag}`
                                    ? "text-lime-500"
                                    : "text-neutral-100 group-hover:text-neutral-100",
                                  "h-6 w-6 flex-shrink-0",
                                )}
                                aria-hidden="true"
                              />
                              {item.name}
                            </a>
                          ) : (
                            <Disclosure as="div">
                              {({ open }) => (
                                <ul className="flex flex-1 flex-col">
                                  <Disclosure.Button
                                    className={classNames(
                                      router.pathname ===
                                        `/dashboard/[store]/${item.tag}`
                                        ? "bg-lime-400/10 font-medium text-lime-500"
                                        : "font-normal text-neutral-200 hover:bg-neutral-100/10 hover:text-neutral-100",
                                      "group flex cursor-pointer items-center gap-x-4 rounded-md p-3 pl-4 text-sm leading-4 tracking-wide duration-200",
                                    )}
                                  >
                                    <item.icon
                                      className={classNames(
                                        router.pathname ===
                                          `/dashboard/[store]/${item.tag}`
                                          ? "text-lime-500"
                                          : "text-neutral-100 group-hover:text-neutral-100",
                                        "h-6 w-6 flex-shrink-0",
                                      )}
                                      aria-hidden="true"
                                    />
                                    {item.name}
                                    <ChevronRightIcon
                                      className={classNames(
                                        open
                                          ? "rotate-90 text-lime-500"
                                          : "text-neutral-100 group-hover:text-neutral-100",
                                        "ml-auto h-6 w-6 ",
                                      )}
                                      aria-hidden="true"
                                    />
                                  </Disclosure.Button>
                                  <Disclosure.Panel
                                    as="ul"
                                    className="mt-1 px-2"
                                  >
                                    {item.children.map((subItem) => (
                                      <li key={subItem.name}>
                                        {/* 44px */}
                                        <Disclosure.Button
                                          as="a"
                                          href={subItem.href}
                                          className={classNames(
                                            router.pathname ===
                                              `/dashboard/[store]/${item.tag}`
                                              ? "bg-lime-400/10 font-medium text-lime-500"
                                              : "font-normal text-neutral-200 hover:bg-neutral-100/10 hover:text-neutral-100",
                                            "group flex cursor-pointer items-center gap-x-4 rounded-md p-3 pl-4 text-sm leading-4 tracking-wide duration-200",
                                          )}
                                        >
                                          {subItem.name}
                                        </Disclosure.Button>
                                      </li>
                                    ))}
                                  </Disclosure.Panel>
                                </ul>
                              )}
                            </Disclosure>
                          )}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72">
          <div className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-x-4 border-b border-neutral-700 bg-neutral-900  px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-neutral-200 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Separator */}
            <div
              className="h-6 w-px bg-neutral-800 lg:hidden"
              aria-hidden="true"
            />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 ">
              <form
                className="focus relative flex flex-1"
                action="#"
                method="GET"
              >
                <label htmlFor="search-field" className="sr-only">
                  Search
                </label>
                <MagnifyingGlassIcon
                  className="pointer-events-none absolute inset-y-0 left-4 h-full w-5 text-slate-300"
                  aria-hidden="true"
                />
                <input
                  id="search-field"
                  className="flex h-2/3 w-full self-center rounded-lg bg-neutral-800 pl-12 pr-0 text-xs font-normal leading-3 tracking-wide text-neutral-100 placeholder:text-neutral-300 focus-visible:outline-none sm:text-sm"
                  placeholder="Search"
                  type="search"
                  name="search"
                />
              </form>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <button
                  type="button"
                  className="-m-2.5 p-2.5 text-neutral-300 hover:text-neutral-200"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Separator */}
                <div
                  className="hidden rounded-full lg:block lg:h-6 lg:w-0.5 lg:bg-neutral-700"
                  aria-hidden="true"
                />

                {/* Profile dropdown */}
                <div className="relative">
                  {isSignedIn ? (
                    <div className="flex">
                      <span className="sr-only">Open user menu</span>
                      <UserButton
                        appearance={{
                          elements: {
                            userButtonAvatarBox: {
                              width: "2rem",
                              height: "2rem",
                            },
                          },
                        }}
                      />
                    </div>
                  ) : (
                    <SignInButton />
                  )}
                </div>
              </div>
            </div>
          </div>

          <main className="bg-neutral-900 p-6">
            <div className="">{children}</div>
          </main>
        </div>
      </div>
    </>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Sidebar>{children}</Sidebar>;
}
