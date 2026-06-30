'use client'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import React, { SubmitEvent, useId, useState } from "react"
import { Form } from "./ui/form"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const router = useRouter();
  const id = useId();
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      console.log('Email', email, 'Password', password);

      setLoading(true);
      
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/'
      });

      console.log('login res', res)

      setLoading(false);

      if (res?.error) {
        res.error === "CredentialsSignin" && setError('Invalid email or password.')
        res.error === "fetch failed" && setError("Service temporarily unavailable.")
      }

      if(res?.ok){
        setError(undefined)
        router.push('/')
      }

    } catch (error) {
      setError(String(error))
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>
            Enter your email below to login to your  Cedro Management account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form onSubmit={handleLogin}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <InputGroup>
                  <InputGroupInput
                    aria-describedby={`${id}-description`}
                    id={id}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    type={isVisible ? "text" : "password"}
                    value={password}
                    name="password"
                  />
                  <InputGroupAddon align="inline-end">
                    <Button
                      aria-label={isVisible ? "Hide password" : "Show password"}
                      onClick={() => setIsVisible(!isVisible)}
                      size="icon-xs"
                      variant="ghost"
                      type="button"
                    >
                      {isVisible ? (
                        <EyeOffIcon aria-hidden="true" />
                      ) : (
                        <EyeIcon aria-hidden="true" />
                      )}
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </Field>
              <Field>
                <Button disabled={loading} type="submit">{loading ? "Logging in..." : "Login"}</Button>
                {error && <p className="text-red-600 font-medium text-sm">{error}</p>}
              </Field>
            </FieldGroup>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
