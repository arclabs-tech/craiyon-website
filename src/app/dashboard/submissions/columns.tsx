"use client";
import { Button } from "@/components/ui/button";
import { ImageEntry } from "@/lib/schemas";
import { ColumnDef } from "@tanstack/react-table";

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
    header: () => <h1 className="w-18">Image ID</h1>,
  },
  {
    accessorKey: "score",
    header: "Score",
  },
  {
    accessorKey: "image_url",
    header: () => <h1 className="w-20">Image Link</h1>,
    cell: ({ row }) => {
      return (
        <a
          href={row.original.image_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline">Link</Button>
        </a>
      );
    },
  },
  {
    accessorKey: "model",
    header: () => <h1 className="w-28">Model Name</h1>,
    cell: ({ row }) => {
      return <p className="truncate w-28">{row.original.model}</p>;
    },
  },
  {
    accessorKey: "prompt",
    header: () => <h1 className="w-56">Prompt</h1>,
    cell: ({ row }) => {
      return <p className="w-56">{row.original.prompt}</p>;
    },
  },
  {
    accessorKey: "negative_prompt",
    header: () => <h1 className="w-56">Negative Prompt</h1>,
    cell: ({ row }) => {
      return <p className="w-56">{row.original.negative_prompt}</p>;
    },
  },
  {
    accessorKey: "steps",
    header: "steps",
  },
  {
    accessorKey: "cfg_scale",
    header: "cfg_scale",
  },
  {
    accessorKey: "seed",
    header: "seed",
  },
  {
    accessorKey: "style_preset",
    header: "style_preset?",
  },
  {
    accessorKey: "sampler",
    header: "sampler",
  },
  {
    accessorKey: "width",
    header: "width",
  },
  {
    accessorKey: "height",
    header: "height",
  },
];
