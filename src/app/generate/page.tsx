/* eslint-disable @next/next/no-img-element */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormReturn, useForm } from "react-hook-form";
import { createContext, useContext, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

import { type ImageOpts, imageOptsSchema, stylePresets } from "@/lib/schemas";
import { getImageData } from "@/actions/generateImage";

const formContext = createContext<UseFormReturn<ImageOpts> | null>(null);

export default function SelectForm() {
  const [generatedImageBase64Data, setGeneratedImageBase64Data] =
    useState<string>("");
  const [similarity, setSimilarity] = useState<number>(0);
  const [generated, setGenerated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
    console.log(data);
    setIsLoading(true);
    const { base64, similarity } = await getImageData(data);
    setGeneratedImageBase64Data(base64);
    setSimilarity(similarity);
    setIsLoading(false);
    setGenerated(true);
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
                <h1 className="text-3xl font-bold">Generate Image</h1>
                <Model />
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
                <Seed />
                <Button type="submit" className="w-48">
                  Generate
                </Button>
              </div>
            </formContext.Provider>
          </form>
        </Form>
      </div>
      <div className="w-full flex flex-col gap-4 items-center p-6">
        <img
          className="w-96 h-96 border-4 rounded-xl"
          src="/puppies.png"
          alt="Source image"
          width={24}
          height={24}
        />
        {isLoading ? (
          <Skeleton className="w-96 h-96 rounded-xl" />
        ) : (
          <div className="flex flex-col rounded-xl justify-center items-center">
            <img
              className="w-96 h-96 border-4 flex flex-col rounded-xl justify-center items-center"
              src={`data:image/png;base64,${generatedImageBase64Data}`}
              alt="Your generated image here"
              width={24}
              height={24}
            />
            {generated && <p>Similarity is {similarity.toFixed(10)}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

function Model() {
  const form = useContext(formContext);
  if (!form) return;
  return (
    <FormField
      control={form.control}
      name="model"
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>Model Name</FormLabel>
          <FormControl>
            <Input placeholder="Model Name..." {...field} />
          </FormControl>
          <FormDescription>
            Choose one from the given list of models.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function Prompt() {
  const form = useContext(formContext);
  if (!form) return;
  return (
    <FormField
      control={form.control}
      name="prompt"
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>Prompt</FormLabel>
          <FormControl>
            <Textarea placeholder="Your prompt here..." {...field} />
          </FormControl>
          <FormDescription>
            What do you want the model to generate
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function NegativePrompt() {
  const form = useContext(formContext);
  if (!form) return;
  return (
    <FormField
      control={form.control}
      name="negative_prompt"
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>Negative Prompt</FormLabel>
          <FormControl>
            <Textarea placeholder="Your negative prompt here..." {...field} />
          </FormControl>
          <FormDescription>
            What you don&apos;t want the model to generate
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function Steps() {
  const form = useContext(formContext);
  if (!form) return;
  return (
    <FormField
      control={form.control}
      name="steps"
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>Steps {field.value || 20}</FormLabel>
          <FormControl>
            <Slider
              onValueChange={field.onChange}
              value={field.value}
              min={10}
              max={25}
              step={1}
            />
          </FormControl>
          <FormDescription>How many steps to run the model for</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function CFGScale() {
  const form = useContext(formContext);
  if (!form) return;
  return (
    <FormField
      control={form.control}
      name="cfg_scale"
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>CFG Scale {field.value || 7}</FormLabel>
          <FormControl>
            <Slider
              onValueChange={field.onChange}
              value={field.value}
              min={0}
              max={20}
              step={1}
            />
          </FormControl>
          <FormDescription>CFG Scale</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function Seed() {
  const form = useContext(formContext);
  if (!form) return;
  return (
    <FormField
      control={form.control}
      name="seed"
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>Seed</FormLabel>
          <FormControl>
            <Input disabled defaultValue={2} />
          </FormControl>
          <FormDescription>Seed is fixed at 2</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function Sampler() {
  const form = useContext(formContext);
  if (!form) return;
  return (
    <FormField
      control={form.control}
      name="sampler"
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>Sampler</FormLabel>
          <FormControl>
            <Input placeholder="Sampler Name..." {...field} />
          </FormControl>
          <FormDescription>Idk what is sampler</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function Width() {
  const form = useContext(formContext);
  if (!form) return;
  return (
    <FormField
      control={form.control}
      name="width"
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>Width</FormLabel>
          <FormControl>
            <Input placeholder="Enter width..." {...field} />
          </FormControl>
          <FormDescription>Width of generated image</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function Height() {
  const form = useContext(formContext);
  if (!form) return;
  return (
    <FormField
      control={form.control}
      name="height"
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>Height</FormLabel>
          <FormControl>
            <Input placeholder="Enter height..." {...field} />
          </FormControl>
          <FormDescription>Height of generated image</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function StylePreset() {
  const form = useContext(formContext);
  if (!form) return;
  return (
    <FormField
      control={form.control}
      name="style_preset"
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>Style Preset</FormLabel>
          <Select onValueChange={field.onChange}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select style preset" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {stylePresets.map((preset) => (
                <SelectItem key={preset} value={preset}>
                  {preset}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription>
            Select a style preset to use for the image.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
