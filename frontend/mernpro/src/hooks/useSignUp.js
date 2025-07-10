import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../lib/api";

const useSignUp = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: signup,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      // Call the custom onSuccess if provided
      if (context && context.onSuccess) {
        context.onSuccess(data);
      }
    },
  });

  // Wrap mutate to accept an onSuccess callback
  const signupMutation = (variables, { onSuccess } = {}) => {
    mutate(variables, { context: { onSuccess } });
  };

  return { isPending, error, signupMutation };
};
export default useSignUp;