import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { InsertPrototype } from "@shared/schema";
import { z } from "zod";

export function usePrototypes() {
  return useQuery({
    queryKey: [api.prototypes.list.path],
    queryFn: async () => {
      const res = await fetch(api.prototypes.list.path);
      if (!res.ok) throw new Error("Failed to fetch prototypes");
      return api.prototypes.list.responses[200].parse(await res.json());
    },
  });
}

export function usePrototype(id: number) {
  return useQuery({
    queryKey: [api.prototypes.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.prototypes.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch prototype");
      return api.prototypes.get.responses[200].parse(await res.json());
    },
    enabled: !isNaN(id),
  });
}

export function useCreatePrototype() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertPrototype) => {
      const validated = api.prototypes.create.input.parse(data);
      const res = await fetch(api.prototypes.create.path, {
        method: api.prototypes.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.prototypes.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create prototype");
      }
      return api.prototypes.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.prototypes.list.path] });
    },
  });
}
