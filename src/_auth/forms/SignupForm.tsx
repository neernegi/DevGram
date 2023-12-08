import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { SignupValidationSchema } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";

import { useToast } from "@/components/ui/use-toast";
import {
  useCreateUserAccount,
  useSignInAccount,
} from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";

const SignupForm = () => {
  const { toast } = useToast();
  const { checkAuthUser } = useUserContext();
  const { mutateAsync: createUserAccount, isPending: isCreatingUser } =
    useCreateUserAccount();
  const navigate = useNavigate();

  const { mutateAsync: signInAccount } = useSignInAccount();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SignupValidationSchema>>({
    resolver: zodResolver(SignupValidationSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignupValidationSchema>) {
    const newUser = await createUserAccount(values);
    if (!newUser) {
      return toast({ title: "Sign up failed.Please try again" });
    }
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });

    if (!session) {
      return toast({ title: "Sign in failed. Please try again" });
    }
    const isLoggedIn = await checkAuthUser();
    if (isLoggedIn) {
      form.reset();
      navigate("/");
    } else {
      return toast({
        title: "Sign up failed. Please try again",
      });
    }
  }
  return (
    <Form {...form}>
      <div
        className="sm:w-420 flex flex-col p-6"
        style={{ boxShadow: "2px 2px 4px 1px rgba(0, 0, 0, 0.2)" }}
      >
        <Link to="/" className="flex gap-3 items-center justify-center mb-3 ">
          <img
            src="/assets/images/logoSVG.svg"
            alt="logo"
            width={170}
            height={36}
          />
          <h3
            style={{
              marginLeft: "-8.5rem",
              fontSize: "1.6rem",
              fontWeight: "bold",
            }}
          >
            DevGram
          </h3>
        </Link>

        <h1 className="text-2xl font-bold self-center ">
          Create a new account
        </h1>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          To use Hellogram enter your account details{" "}
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3 flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>

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
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">
            {isCreatingUser ? (
              <div className="flex gap-2 bg-slate-700">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign up"
            )}
          </Button>

          <p className="text-small-regular text-dark-4 text-center mt-2">
            Already have an account?{" "}
            <Link
              to={"/sign-in"}
              className="text-sky-900 text-small-semibold ml-1"
            >
              Login
            </Link>{" "}
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignupForm;
