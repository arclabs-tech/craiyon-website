/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { ImageEntry, TextEntry } from "@/lib/schemas";
import { ScrollArea } from "@radix-ui/react-scroll-area";

export function MoreImageInfo({ entry }: { entry: ImageEntry }) {
  return (
    <Drawer>
      <DrawerTrigger>
        <Button variant="outline">Details</Button>
      </DrawerTrigger>
      <DrawerContent className="w-full pb-4 h-3/4 lg:h-3/5 fixed bottom-0 left-0 right-0 max-h-[90dvh]">
        <DrawerHeader>
          <DrawerTitle className="text-center">
            Image {entry.image_id}
          </DrawerTitle>
        </DrawerHeader>
        <DrawerDescription className="p-4 flex flex-col items-center">
          <ScrollArea className="overflow-auto h-2/3 lg:h-full">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <img
                src={entry.image_url}
                alt="Generated Image"
                className="w-80 h-80 rounded-xl border-2"
              />
              <div className="grid grid-rows-1 lg:grid-rows-2 gap-4 lg:gap-8 overflow-auto w-full">
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <h1 className="text-xl font-semibold">Created At</h1>
                      <p>{entry.created_at.toLocaleString()}</p>
                    </div>
                    <div>
                      <h1 className="text-xl font-semibold">Score</h1>
                      <p>{entry.score}</p>
                    </div>
                    <div>
                      <h1 className="text-xl font-semibold">Model Name</h1>
                      <p>{entry.model}</p>
                    </div>
                    <div>
                      <h1 className="text-xl font-semibold">Steps</h1>
                      <p>{entry.steps}</p>
                    </div>
                    <div>
                      <h1 className="text-xl font-semibold">CFG Scale</h1>
                      <p>{entry.cfg_scale}</p>
                    </div>
                    <div>
                      <h1 className="text-xl font-semibold">Style Preset</h1>
                      <p>{entry.style_preset}</p>
                    </div>
                    <div>
                      <h1 className="text-xl font-semibold">Sampler</h1>
                      <p>{entry.sampler}</p>
                    </div>
                    <div>
                      <h1 className="text-xl font-semibold">Dimensions</h1>
                      <p>
                        {entry.width}x{entry.height}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="w-full">
                      <h1 className="text-xl font-semibold">Prompt</h1>
                      <p className="">{entry.prompt}</p>
                    </div>
                    <div className="w-full">
                      <h1 className="text-xl font-semibold">Negative Prompt</h1>
                      <p className="">{entry.negative_prompt}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DrawerDescription>
      </DrawerContent>
    </Drawer>
  );
}

export function MoreTextInfo({ entry }: { entry: TextEntry }) {
  return (
    <Drawer>
      <DrawerTrigger>
        <Button variant={"outline"}>Details</Button>
      </DrawerTrigger>
      <DrawerContent className="w-full pb-4 h-3/4 lg:h-3/5 fixed bottom-0 left-0 right-0 max-h-[90dvh]">
        <DrawerHeader>
          <DrawerTitle className="text-center">
            Text {entry.text_id}
          </DrawerTitle>
        </DrawerHeader>
        <DrawerDescription className="p-4 flex flex-col items-center">
          <ScrollArea className="overflow-auto h-full lg:h-full">
            <div className="flex flex-col lg:flex-row gap-4 items-start">
              <div className="w-full">
                <h1 className="text-3xl font-semibold">Generation</h1>
                <p>{entry.generation}</p>
              </div>
              <div className="grid grid-rows-1 lg:grid-rows-2 gap-4 lg:gap-8 overflow-auto w-full">
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <h1 className="text-xl font-semibold">Created At</h1>
                      <p>{entry.created_at.toLocaleString()}</p>
                    </div>
                    <div>
                      <h1 className="text-xl font-semibold">Score</h1>
                      <p>{entry.score}</p>
                    </div>
                    <div>
                      <h1 className="text-xl font-semibold">Model</h1>
                      <p>{entry.model}</p>
                    </div>
                    <div>
                      <h1 className="text-xl font-semibold">Temperature</h1>
                      <p>{entry.temperature}</p>
                    </div>
                  </div>
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="w-full">
                      <h1 className="text-xl font-semibold">Prompt</h1>
                      <p className="">{entry.system_prompt}</p>
                    </div>
                    <div className="w-full">
                      <h1 className="text-xl font-semibold">Negative Prompt</h1>
                      <p className="">{entry.user_prompt}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DrawerDescription>
      </DrawerContent>
    </Drawer>
  );
}
