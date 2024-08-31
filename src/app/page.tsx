/* eslint-disable @next/next/no-img-element */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Form, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";

import { type ImageOpts, imageOptsSchema } from "@/lib/schemas";
import {
  generateImage,
  getBase64Image,
  getImageUrl,
} from "@/actions/generateImage";

import {
  Model,
  Prompt,
  NegativePrompt,
  Steps,
  CFGScale,
  Sampler,
  APIKey,
  Seed,
  formContext,
} from "@/components/generateImage";
import { toast } from "sonner";
import { GetApiKey } from "@/lib/api-keys";

enum State {
  Generate,
  Checking,
  Initializing,
  Generating,
  Downloading,
  Submitting,
  Next,
}

export default function SelectForm() {
  const [state, setState] = useState<State>(State.Generate);
  const [base64Data, setBase64Data] = useState<string>("");
  const form = useForm<ImageOpts>({
    resolver: zodResolver(imageOptsSchema),
    defaultValues: {
      model: "sd_xl_base_1.0.safetensors [be9edd61]",
      prompt: "",
      negative_prompt: "",
      steps: [20],
      cfg_scale: [7],
      seed: 8926958723,
      api_key: GetApiKey(),
      sampler: "DPM++ 2M Karras",
      width: 1024,
      height: 1024,
    },
  });

  async function onSubmit(data: ImageOpts) {
    try {
      if (state == State.Next) {
        // form.reset();
        setBase64Data("");
        setState(State.Generate);
        return;
      }
      setState(State.Checking);
      setState(State.Initializing);
      const { job } = await generateImage(data);
      setState(State.Generating);
      const url = await getImageUrl(job, data.api_key!);
      setState(State.Downloading);
      const base64 = await getBase64Image(url);
      setBase64Data(base64);
      setState(State.Next);
    } catch (error: any) {
      toast.error(error.message);
      setState(State.Generate);
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:p-8">
      <div className="w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => onSubmit(data))}
            className="w-full px-4"
          >
            <formContext.Provider value={form}>
              <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-4 w-full">
                  <Model />
                  <Sampler />
                </div>
                <div className="flex flex-row gap-4 w-full">
                  <APIKey />
                  <Seed />
                </div>
                <div className="flex flex-col lg:flex-row gap-4">
                  <Prompt />
                  <NegativePrompt />
                </div>
                <div className="flex flex-row gap-4 w-full">
                  <Steps />
                  <CFGScale />
                </div>
                <div className="flex flex-row items-center gap-4">
                  <Button
                    type="submit"
                    className="w-48"
                    disabled={!(state == State.Generate || state == State.Next)}
                  >
                    {State[state]}
                  </Button>
                  <FormMessage />
                </div>
              </div>
            </formContext.Provider>
          </form>
        </Form>
      </div>
      <div className="w-full flex flex-col gap-4 items-center p-6">
        {state >= State.Initializing && state <= State.Downloading ? (
          <Skeleton className="rounded-xl w-80 h-80 lg:w-[36rem] lg:h-[36rem]" />
        ) : (
          <div className="flex flex-col rounded-xl justify-center items-center gap-4">
            <img
              className="w-80 h-80 lg:w-[36rem] lg:h-[36rem] border-4 flex flex-col rounded-xl justify-center items-center"
              src={`data:image/png;base64,${base64Data}`}
              alt="Your generated image here"
              width={240}
              height={240}
            />
            {base64Data && (
              <a
                href={`data:image/png;base64,${base64Data}`}
                download="craiyon.jpg"
              >
                <Button className="px-8">Download</Button>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
