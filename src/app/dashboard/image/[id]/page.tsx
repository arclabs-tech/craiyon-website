/* eslint-disable @next/next/no-img-element */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { getCookie } from "cookies-next";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
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
import {
  addImageEntry,
  getNumOfEntriesByImageId,
} from "@/actions/imageEntries";

import {
  Model,
  Prompt,
  NegativePrompt,
  Steps,
  CFGScale,
  Sampler,
  StylePreset,
  Width,
  Height,
  Seed,
  formContext,
} from "@/components/generateImage";

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
  const [similarity, setSimilarity] = useState<number>(0);
  const [remaining, setRemaining] = useState<number>(25);
  const team_name = getCookie("team_name") as string;
  const form = useForm<ImageOpts>({
    resolver: zodResolver(imageOptsSchema),
    defaultValues: {
      model: "sd_xl_base_1.0.safetensors [be9edd61]",
      prompt: "puppies in a cloud, 4k",
      negative_prompt: "badly drawn",
      steps: [20],
      cfg_scale: [7],
      seed: 2,
      style_preset: "none",
      sampler: "DPM++ 2M Karras",
      width: 1024,
      height: 1024,
    },
  });

  async function onSubmit(data: ImageOpts) {
    if (state == State.Next) {
      // form.reset();
      setBase64Data("");
      setSimilarity(0);
      setState(State.Generate);
      return;
    }
    setState(State.Checking);
    const numOfRemainingImages =
      25 - (await getNumOfEntriesByImageId(imageId, team_name));
    if (numOfRemainingImages <= 0) {
      alert("You have reached the limit of 25 submissions per image");
      return;
    }
    setRemaining(numOfRemainingImages);
    setState(State.Initializing);
    const { job } = await generateImage(data);
    setState(State.Generating);
    const url = await getImageUrl(job);
    setState(State.Downloading);
    const base64 = await getBase64Image(url);
    setBase64Data(base64);
    setState(State.GeneratingEmbedding);
    const embedding = await getEmbedding(base64);
    setState(State.Calculating);
    const srcEmbeddings = await getSrcEmbeddings(imageId);
    const similarity = cosineSimilarity(embedding, srcEmbeddings);
    setSimilarity(similarity);
    setState(State.Submitting);
    const imageEntry: ImageEntry = {
      image_id: imageId,
      team_name: team_name!,
      image_url: url,
      created_at: new Date(),
      score: similarity,
      ...data,
      steps: data.steps[0],
      cfg_scale: data.cfg_scale[0],
    };
    await addImageEntry(imageEntry);
    setState(State.Next);
  }

  if (!Array.from({ length: 10 }, (_, i) => i + 1).includes(imageId)) {
    return "Image not found";
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
                <div className="flex flex-row gap-4 w-full">
                  <Sampler />
                  <StylePreset />
                </div>
                <div className="flex flex-row gap-4 w-full">
                  <Width />
                  <Height />
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
                      <p>Score = {similarity.toFixed(10)}</p>
                      <p>{remaining} submissions remaining</p>
                    </div>
                  )}
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
