import {
  ChartPieIcon,
  ClipboardDocumentCheckIcon,
  Cog6ToothIcon,
  CursorArrowRippleIcon,
  EnvelopeOpenIcon,
  HomeIcon,
  LinkIcon,
} from "@heroicons/react/24/solid";

export const navigation = [
  {
    name: "MENU",
    items: [
      {
        name: "Overview",
        tag: "overview",
        href: `/dashboard/overview`,
        icon: HomeIcon,
      },
      {
        name: "Reports",
        tag: "reports",
        href: `/dashboard/reports`,
        icon: ChartPieIcon,
      },
      {
        name: "Advertising",
        tag: "retention",
        href: `/dashboard/advertising`,
        icon: CursorArrowRippleIcon,
      },
      {
        name: "Retention",
        tag: "advertising",
        href: `/dashboard/retention`,
        icon: EnvelopeOpenIcon,
      },
    ],
  },
  {
    name: "OTHERS",
    items: [
      {
        name: "Calender",
        tag: "settings",
        href: `/dashboard/settings`,
        icon: Cog6ToothIcon,
      },
      {
        name: "Integrations",
        tag: "docs",
        href: "/dashboard/integrations",
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
