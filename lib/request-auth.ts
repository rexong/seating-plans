import { cookies, headers } from "next/headers";
import {
  SEATING_BASIC_COOKIE,
  isBasicAuthorized,
  isCookieAuthorized,
} from "@/lib/basic-auth";

export async function isOperatorAuthorized() {
  const headerList = await headers();
  if (isBasicAuthorized(headerList.get("authorization"))) {
    return true;
  }
  const token = (await cookies()).get(SEATING_BASIC_COOKIE)?.value;
  return isCookieAuthorized(token);
}

export async function assertOperatorAuthorized() {
  if (!(await isOperatorAuthorized())) {
    throw new Error("Unauthorized");
  }
}
