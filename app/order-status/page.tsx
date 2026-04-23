import { redirect } from "next/navigation";

export default function OrderStatusRedirectPage() {
  redirect("/account/status");
}
