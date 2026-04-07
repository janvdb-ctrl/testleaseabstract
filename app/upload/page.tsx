import { redirect } from "next/navigation";

/** Canonical route is `/leases/new`; `/upload` is a convenient alias. */
export default function UploadAliasPage() {
  redirect("/leases/new");
}
