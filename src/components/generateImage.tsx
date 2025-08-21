import { ImageOpts, stylePresets, imageModels } from "@/lib/schemas";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { createContext, useContext } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "./ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

const formContext = createContext<UseFormReturn<ImageOpts> | null>(null);
function Model() {
  const form = useContext(formContext);
  if (!form) return;
  return (
    <FormField
      control={form.control}
      name="model"
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>Diffusion Model</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {imageModels.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
              min={1}
              max={16}
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

function GuidanceScale() {
  const form = useContext(formContext);
  if (!form) return;
  return (
    <FormField
      control={form.control}
      name="guidance_scale"
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>Guidance Scale {field.value || 7}</FormLabel>
          <FormControl>
            <Slider
              onValueChange={field.onChange}
              value={field.value}
              min={0}
              max={100}
              step={0.1}
            />
          </FormControl>
          <FormDescription>Guidance Scale</FormDescription>
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
            <Input
              placeholder="Enter seed..."
              {...field}
              onChange={(event) => {
                const numValue = parseInt(event.target.value);
                if (isNaN(numValue)) {
                  field.onChange(event.target.value);
                } else {
                  field.onChange(numValue);
                }
              }}
            />
          </FormControl>
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
            <Input
              placeholder="Enter width..."
              {...field}
              onChange={(event) => {
                const numValue = parseInt(event.target.value);
                if (isNaN(numValue)) {
                  field.onChange(event.target.value);
                } else {
                  field.onChange(numValue);
                }
              }}
            />
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
            <Input
              placeholder="Enter height..."
              {...field}
              onChange={(event) => {
                const numValue = parseInt(event.target.value);
                if (isNaN(numValue)) {
                  field.onChange(event.target.value);
                } else {
                  field.onChange(numValue);
                }
              }}
            />
          </FormControl>
          <FormDescription>Height of generated image</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}



export {
  Model,
  Prompt,
  NegativePrompt,
  Steps,
  GuidanceScale as CFGScale,
  Seed,
  Width,
  Height,
  formContext,
};
