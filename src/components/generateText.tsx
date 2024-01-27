import { createContext, useContext } from "react";
import { UseFormReturn } from "react-hook-form";

import {
  FormControl,
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
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { TextOpts } from "@/lib/schemas";

const formContext = createContext<UseFormReturn<TextOpts> | null>(null);

function Model() {
  const form = useContext(formContext);
  if (!form) return;
  return (
    <FormField
      control={form.control}
      name="model"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Model</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="gpt-3.5-turbo-1106">
                gpt-3.5-turbo-1106
              </SelectItem>
              <SelectItem value="llama-2-13b">llama-2-13b</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
function SystemPrompt() {
  const form = useContext(formContext);
  if (!form) return;
  return (
    <FormField
      control={form.control}
      name="system_prompt"
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>System Prompt</FormLabel>
          <FormControl>
            <Textarea placeholder="Your prompt here..." {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function UserPrompt() {
  const form = useContext(formContext);
  if (!form) return;
  return (
    <FormField
      control={form.control}
      name="user_prompt"
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>User Prompt</FormLabel>
          <FormControl>
            <Textarea placeholder="Your prompt here..." {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function Temperature() {
  const form = useContext(formContext);
  if (!form) return;
  return (
    <FormField
      control={form.control}
      name="temperature"
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>Temperature {field.value || 0.5}</FormLabel>
          <FormControl>
            <Slider
              onValueChange={field.onChange}
              value={field.value}
              min={0}
              max={1}
              step={0.01}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function MaxTokens() {
  const form = useContext(formContext);
  if (!form) return;
  return (
    <FormField
      control={form.control}
      name="max_tokens"
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>Max Tokens</FormLabel>
          <FormControl>
            <Input
              {...field}
              onChange={(event) => field.onChange(+event.target.value)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export { formContext, Model, SystemPrompt, UserPrompt, Temperature, MaxTokens };
