"use client";
import { ImageEntry, TextEntry } from "@/lib/schemas";
import { ColumnDef } from "@tanstack/react-table";
import { MoreImageInfo, MoreTextInfo } from "./more-info";

export const columns: ColumnDef<ImageEntry>[] = [
  {
    accessorKey: "created_at",
    header: () => <h1 className="w-18">Created At</h1>,
    cell: ({ row }) => (
      <p className="w-18">{row.original.created_at.toLocaleString()}</p>
    ),
  },
  {
    accessorKey: "image_id",
    header: () => <h1 className="w-18">Image No.</h1>,
    cell: ({ row }) => (
      <p className="w-18">
        {row.original.image_id == 0 ? "Open" : row.original.image_id}
      </p>
    ),
  },
  {
    accessorKey: "score",
    header: "Score",
  },
  {
    id: "more-info",
    cell: ({ row }) => <MoreImageInfo entry={row.original} />,
  },
];

export const textColumns: ColumnDef<TextEntry>[] = [
  {
    accessorKey: "created_at",
    header: () => <h1 className="w-18">Created At</h1>,
    cell: ({ row }) => (
      <p className="w-18">{row.original.created_at.toLocaleString()}</p>
    ),
  },
  {
    accessorKey: "text_id",
    header: () => <h1 className="w-18">Text No.</h1>,
  },
  {
    accessorKey: "score",
    header: "Score",
  },
  {
    id: "more-info",
    cell: ({ row }) => <MoreTextInfo entry={row.original} />,
  },
];
