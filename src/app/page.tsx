"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React from "react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { teamLoginAction } from "@/actions/loginAction";
import {
  teamLoginSchema as schema,
  type TeamLoginSchema as Schema,
} from "@/lib/schemas";
import { useTeamNameStore } from "@/lib/stores";

export default function TeamLogin() {
  const router = useRouter();
  const [alert, setAlert] = React.useState<React.ReactNode | null>(null);
  const setTeamName = useTeamNameStore((state) => state.setTeamName);
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      team_name: "",
      password: "",
    },
  });
  async function onSubmit(data: Schema) {
    try {
      const hashedTeamName = await teamLoginAction(data);
      setTeamName(hashedTeamName);
      router.push("/dashboard");
    } catch (err: any) {
      setAlert(
        <Alert variant="destructive">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {err.message || "Something went wrong."}
          </AlertDescription>
        </Alert>
      );
    }
  }
  return (
    <main className="flex flex-col py-8 gap-8 items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => onSubmit(data))}
          className="flex flex-col gap-y-4"
        >
          <h1 className="text-3xl font-bold">Craiyon</h1>
          <p>The AI art generation contest</p>
          {alert}
          <FormField
            control={form.control}
            name="team_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Team Name..." {...field} />
                </FormControl>
                <FormDescription>
                  Use the team name you registered with.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password..." {...field} />
                </FormControl>
                <FormDescription>
                  Use the password provided to your email.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </main>
  );
}
