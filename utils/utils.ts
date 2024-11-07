import { useProfile } from "@/shared/providers/ProfileProvider";
import store from "@/shared/redux/store";

export function toWordUpperCase(str: string) {
  return str?.replace(/\b\w/g, (char) => char?.toUpperCase());
}
export function convertToPlainTextAndShorten(text: string, maxLength?: number) {
  // Remove HTML tags
  text = text.replace(/<[^>]*>/g, "");

  // Trim leading and trailing whitespace
  text = text.trim();

  // Shorten the text to 150 characters if longer
  if (maxLength && text.length > maxLength) {
    text = text.substring(0, maxLength) + "...";
  }

  return text;
}

export function getImageUrl(path = null) {
  if (path) {
    return `${process.env.NEXT_PUBLIC_AWS_S3_URL}/${path}`;
  }
  return "";
}

export const nodeVisibilityOption = ["public", "private", "protected"];

export function convertToUUID(str: string) {
  if (str.length == 36) {
    return str;
  } else if (str.length !== 32) {
    throw new Error("Input string must be exactly 32 characters long");
  }

  // Insert the dashes in the appropriate places to match the UUID format
  return `${str.slice(0, 8)}-${str.slice(8, 12)}-${str.slice(
    12,
    16
  )}-${str.slice(16, 20)}-${str.slice(20)}`;
}

export const hasPermission = (permissionOrPermissions: string | string[]) => {
  const { auth } = store.getState();
  let user = auth.user;

  // Super admin bypass
  if (user?.roleType === "superAdmin") {
    return true;
  }

  // If the input is a single permission (string)
  if (typeof permissionOrPermissions === "string") {
    return user?.role?.permissions?.some((permission: any) => {
      return permission?.name === permissionOrPermissions;
    });
  }

  // If the input is an array of permissions, check if the user has at least one
  if (Array.isArray(permissionOrPermissions)) {
    const hasAnyPermission = permissionOrPermissions.some(
      (requiredPermission) => {
        return user?.role?.permissions?.some((permission: any) => {
          return permission?.name === requiredPermission;
        });
      }
    );
    return hasAnyPermission;
  }

  return false;
};


export const formatAmount = (amount: number) => {
  if (amount % 1 === 0) {
    return new Intl.NumberFormat('en-US', {
      style: "currency",
      currency: "PHP", currencyDisplay: "narrowSymbol",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat('en-US', {
    style: "currency",
    currency: "PHP", currencyDisplay: "narrowSymbol",
    // minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
export const formatNumber = (amount: number) => {
  return new Intl.NumberFormat('en-US', {

  }).format(amount);
};
export const formatMonth = (yearMonth: string) => {
  const date = new Date(`${yearMonth}-01`);

  // Get the month abbreviation
  const month = date.toLocaleString('en-US', { month: 'short' });

  // Get the last two digits of the year
  const year = date.getFullYear().toString().slice(-2);

  if (new Date().getFullYear() == date.getFullYear()) {
    return month;
  }

  return `${month} '${year}`;
};

export const chartColors = [
  "#ff6666",
  "#ffcc99",
  "#99cc00",
  "#3366cc",
  "#cccc00",
  "#660066",
]