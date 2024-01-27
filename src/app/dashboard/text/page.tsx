"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Model,
  SystemPrompt,
  UserPrompt,
  Temperature,
  MaxTokens,
  formContext,
} from "@/components/generateText";
import { Form } from "@/components/ui/form";
import { textOptsSchema, type TextOpts } from "@/lib/schemas";
import { Skeleton } from "@/components/ui/skeleton";

import { generateText, getEmbedding } from "@/actions/generateText";
import { useState } from "react";
import { getTextSrcEmbeddings } from "@/lib/embeddings";
import { cosineSimilarity } from "@/lib/similarity";

enum State {
  Generate,
  Generating,
  GeneratingEmbedding,
  Calculating,
  Next,
}

export default function TextGen() {
  const [state, setState] = useState<State>(State.Generate);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [similarity, setSimilarity] = useState<number>(0);
  const form = useForm<TextOpts>({
    resolver: zodResolver(textOptsSchema),
    defaultValues: {
      model: "gpt-3.5-turbo-1106",
      system_prompt: "You are Maria",
      user_prompt: "Hello, I am Robert",
      temperature: [0.5],
      max_tokens: 50,
    },
  });

  async function onSubmit(data: TextOpts) {
    if (state == State.Next) {
      setState(State.Generate);
      return;
    }
    setState(State.Generating);
    const response = await generateText(data);
    if (response == null) {
      setState(State.Generate);
      return;
    }
    setGeneratedText(response);
    setState(State.GeneratingEmbedding);
    const embedding = await getEmbedding(response);
    setState(State.Calculating);
    const srcEmbeddings = await getTextSrcEmbeddings();
    const similarity = cosineSimilarity(embedding, srcEmbeddings);
    setSimilarity(similarity);
    setState(State.Next);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => onSubmit(data))}
          className="w-full px-4"
        >
          <formContext.Provider value={form}>
            <div className="flex flex-col gap-4">
              <Model />
              <SystemPrompt />
              <UserPrompt />
              <Temperature />
              <MaxTokens />
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
                    {/* <p>{remaining} submissions remaining</p> */}
                  </div>
                )}
              </div>
            </div>
          </formContext.Provider>
        </form>
      </Form>
      <p>Required text</p>
      {state >= State.Generating && state < State.Next ? (
        <Skeleton className="w-[90%] h-full p-4" />
      ) : (
        <p>{generatedText ? generatedText : "Your generated text here"}</p>
      )}
    </div>
  );
}
