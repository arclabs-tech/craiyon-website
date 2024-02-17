/* eslint-disable @next/next/no-img-element */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { getCookie } from "cookies-next";

import { Button } from "@/components/ui/button";
import { Form, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";

import { type ImageOpts, imageOptsSchema, ImageEntry } from "@/lib/schemas";
import {
  generateImage,
  getBase64Image,
  getEmbedding,
  getImageUrl,
} from "@/actions/generateImage";
import { cosineSimilarity } from "@/lib/similarity";
import { getSrcEmbeddings } from "@/lib/embeddings";
import { addImageEntry } from "@/actions/imageEntries";

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

enum State {
  Generate,
  Checking,
  Initializing,
  Generating,
  Downloading,
  GeneratingEmbedding,
  Calculating,
  Submitting,
  Next,
}

export default function SelectForm({ params }: { params: { id: string } }) {
  const imageId = Number(params.id);
  const [state, setState] = useState<State>(State.Generate);
  const [base64Data, setBase64Data] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const team_name = getCookie("team_name") as string;
  const form = useForm<ImageOpts>({
    resolver: zodResolver(imageOptsSchema),
    defaultValues: {
      model: "sd_xl_base_1.0.safetensors [be9edd61]",
      prompt: "",
      negative_prompt: "",
      steps: [20],
      cfg_scale: [7],
      seed: -1,
      api_key: "",
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
        // setScore(0);
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
      setState(State.GeneratingEmbedding);
      const embedding = await getEmbedding(base64);
      setState(State.Calculating);
      const srcEmbeddings = await getSrcEmbeddings(imageId);
      const similarity = cosineSimilarity(embedding, srcEmbeddings);
      if (data.model === "v1-5-pruned-emaonly.safetensors [d7049739]") {
        setScore(similarity * 1.01);
      } else if (data.model === "sd_xl_base_1.0.safetensors [be9edd61]") {
        setScore(similarity * 1);
      } else {
        setScore(similarity);
      }
      setState(State.Submitting);
      const { api_key, ...rest } = data;
      const imageEntry: ImageEntry = {
        ...rest,
        image_id: imageId,
        team_name: team_name!,
        image_url: url,
        created_at: new Date(),
        score: score,
        steps: data.steps[0],
        cfg_scale: data.cfg_scale[0],
      };
      await addImageEntry(imageEntry);
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
                <div className="flex flex-row items-center gap-4">
                  <h1 className="text-3xl font-bold">Image {imageId}</h1>
                </div>
                <div className="flex flex-row gap-4 w-full">
                  <Model />
                  <APIKey />
                </div>
                <div className="flex flex-col lg:flex-row gap-4">
                  <Prompt />
                  <NegativePrompt />
                </div>
                <div className="flex flex-row gap-4 w-full">
                  <Steps />
                  <CFGScale />
                </div>
                <div className="flex flex-row gap-4 w-full">
                  <Sampler />
                  <Seed />
                </div>
                <div className="flex flex-row items-center gap-4">
                  <Button
                    type="submit"
                    className="w-48"
                    disabled={!(state == State.Generate || state == State.Next)}
                  >
                    {State[state]}
                  </Button>
                  {state >= State.Next && (
                    <div>
                      <p>Score = {score.toFixed(10)}</p>
                    </div>
                  )}
                  <FormMessage />
                </div>
              </div>
            </formContext.Provider>
          </form>
        </Form>
      </div>
      <div className="w-full flex flex-col gap-4 items-center p-6">
        <img
          className="w-80 h-80 md:w-96 md:h-96 border-4 rounded-xl"
          src={`/images/${params.id}.png`}
          alt="Source image"
          width={24}
          height={24}
        />
        {state >= State.Initializing && state <= State.Downloading ? (
          <Skeleton className="w-96 h-96 rounded-xl" />
        ) : (
          <div className="flex flex-col rounded-xl justify-center items-center">
            <img
              className="w-80 h-80 md:w-96 md:h-96 border-4 flex flex-col rounded-xl justify-center items-center"
              src={`data:image/png;base64,${base64Data}`}
              alt="Your generated image here"
              width={24}
              height={24}
            />
          </div>
        )}
      </div>
    </div>
  );
}
