import {useMutation, useQueryClient} from "@tanstack/react-query";
import {InferRequestType, InferResponseType} from "hono";

import {client} from "@/lib/rpc";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

type ResponseType = InferResponseType<(typeof client.api.auth.login)["$post"]>;
type RequestType = InferRequestType<(typeof client.api.auth.login)["$post"]>;

export const useLogin = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    return useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({json}) => {
            const response = await client.api.auth.login.$post({json});
            if (!response.ok) throw new Error("Ошибка входа");
            return await response.json();
        },
        onSuccess: () => {
            router.refresh();
            toast.success("Вы успешно вошли");
            queryClient.invalidateQueries({queryKey: ["current"]});
        },
        onError: () => {
            toast.error("Ошибка входа");
        },
    });
};