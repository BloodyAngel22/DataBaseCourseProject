import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import IDepartment from "../types/IDepartment";
import IDepartmentById from "../types/IDepartmentById";
import ICreateDepartment from "../types/ICreateDepartment";
import IError from "../types/IError";

const API_URL = "/api/Department";

export function useDepartments() {
  const fetchData = async (): Promise<IDepartment> => {
    const response = await axios.get(API_URL);
    return response.data;
  };

  const { data, isLoading, error } = useQuery<IDepartment, Error>({
    queryKey: ["departments"],
    queryFn: fetchData,
  });

  return { data, isLoading, error };
}

export function useDepartmentById(id: string) {
	const fetchData = async (): Promise<IDepartmentById> => {
		const response = await axios.get(`${API_URL}/${id}`);
		return response.data;
	};

	const { data, isLoading, error } = useQuery<IDepartmentById, Error>({
		queryKey: ["department", id],
		queryFn: fetchData,
	});

	return { data, isLoading, error };
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newDepartment: ICreateDepartment) => {
			const response = await axios.post(API_URL, newDepartment);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
				queryKey: ["departments"],
      });
		},
		onError: (error: AxiosError<IError>) => {
			alert(error.response?.data.message);
		}
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedDepartment: IDepartment) => {
      const response = await axios.put(
        `${API_URL}/${updatedDepartment.$id}`,
        updatedDepartment
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["departments"],
      });
    },
  });
}

export function useDeleteDepartment() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			await axios.delete(`${API_URL}/${id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["departments"],
			});
		}
	});
}