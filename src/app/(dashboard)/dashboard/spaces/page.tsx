import { redirect } from "next/navigation";

// /dashboard/spaces → redirect to inbox (spaces listed in sidebar)
// If user lands here without a specific space ID, send them to inbox
export default function SpacesPage() {
  redirect("/dashboard/inbox");
}
