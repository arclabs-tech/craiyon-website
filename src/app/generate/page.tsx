"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormReturn, useForm } from "react-hook-form";

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

import { type ImageOpts, imageOptsSchema, stylePresets } from "@/lib/schemas";
import { Input } from "@/components/ui/input";
import { createContext, useContext } from "react";

const formContext = createContext<UseFormReturn<ImageOpts> | null>(null);

export default function SelectForm() {
  const form = useForm<ImageOpts>({
    resolver: zodResolver(imageOptsSchema),
    defaultValues: {
      model: "asfdgb",
      prompt: "dgell",
      negative_prompt: "dsvflkj",
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
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4">
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
                <div className="flex flex-row gap-4">
                  <Prompt />
                  <NegativePrompt />
                </div>
                <div className="flex flex-row gap-4 w-full">
                  <Steps />
                  <CFGScale />
                </div>
                <Sampler />
                <StylePreset />
                <div className="flex flex-row gap-4 w-full">
                  <Width />
                  <Height />
                </div>
                <Seed />
              </div>
              <Button type="submit">Submit</Button>
            </formContext.Provider>
          </form>
        </Form>
      </div>
      <div className="w-full flex flex-col gap-4">
        <div className="w-full h-full min-h-96 border-8">Source Image</div>
        <div className="w-full h-full min-h-96 border-8">Your Image</div>
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
            <Input placeholder="Your prompt here..." {...field} />
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
            <Input placeholder="Your negative prompt here..." {...field} />
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
          <FormDescription>Fixed at 2</FormDescription>
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
          <Select onValueChange={field.onChange} defaultValue={field.value}>
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
