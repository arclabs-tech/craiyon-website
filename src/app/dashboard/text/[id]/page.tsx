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
import { textOptsSchema, type TextOpts, TextEntry } from "@/lib/schemas";
import { Skeleton } from "@/components/ui/skeleton";

import { generateText, getEmbedding } from "@/actions/generateText";
import { useState } from "react";
import { getTextSrcEmbeddings } from "@/lib/embeddings";
import { cosineSimilarity } from "@/lib/similarity";
import { getCookie } from "cookies-next";
import { addTextEntry, getNumOfEntriesByTextId } from "@/actions/textEntries";
import { getText } from "@/lib/text";

enum State {
  Generate,
  Checking,
  Generating,
  GeneratingEmbedding,
  Calculating,
  Submitting,
  Next,
}

export default function TextGen({ params }: { params: { id: string } }) {
  const textId = Number(params.id);
  const requiredText = getText(textId);
  const [state, setState] = useState<State>(State.Generate);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [similarity, setSimilarity] = useState<number>(0);
  const [remaining, setRemaining] = useState<number>(25);
  const team_name = getCookie("team_name") as string;
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
    setState(State.Checking);
    const numOfRemainingTexts =
      25 - (await getNumOfEntriesByTextId(textId, team_name));
    if (numOfRemainingTexts <= 0) {
      alert("You have reached the limit of 25 submissions");
      return;
    }
    setRemaining(numOfRemainingTexts);
    setState(State.Generating);
    const response = await generateText(data);
    if (response == null) {
      setState(State.Generate);
      return;
    }
    setGeneratedText(response);
    setState(State.GeneratingEmbedding);
    const embedding = await getEmbedding(response);
    const srcEmbeddings = await getTextSrcEmbeddings(textId);
    setState(State.Calculating);
    const similarity = cosineSimilarity(embedding, srcEmbeddings);
    setSimilarity(similarity);
    setState(State.Submitting);
    const textEntry: TextEntry = {
      text_id: textId,
      created_at: new Date(),
      generation: response,
      score: similarity,
      team_name: team_name,
      ...data,
      temperature: data.temperature[0],
    };
    await addTextEntry(textEntry);
    setState(State.Next);
  }

  if (!Array.from({ length: 5 }, (_, i) => i + 1).includes(textId)) {
    return "Text not found";
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => onSubmit(data))}
          className="w-full"
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
                    <p>{remaining} submissions remaining</p>
                  </div>
                )}
              </div>
            </div>
          </formContext.Provider>
        </form>
      </Form>
      <p className="p-4 border-2 rounded-xl">{requiredText}</p>
      {state >= State.Generating && state < State.Next ? (
        <Skeleton className="w-full h-full p-4" />
      ) : (
        <p className="p-4 border-2 rounded-xl">
          {generatedText ? generatedText : "Your generated text here"}
        </p>
      )}
    </div>
  );
}
